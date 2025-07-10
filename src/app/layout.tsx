import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { cookies } from "next/headers";
import admin from "firebase-admin";
import { AuthUser, UserRole } from "@/types";
import ClientWrapper from "../components/layout/ClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Carlito's ESEN - Campus Store",
  description:
    "Your favorite marketplace for snacks, sweets, and beverages on campus",
};

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
      client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n"
      ),
    } as any),
  });
}

const db = admin.firestore();

async function getServerUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const idToken = cookieStore.get("firebase-id-token")?.value;

    if (!idToken) {
      return null;
    }

    // Verify the ID token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Get user data from Firestore
    const userDoc = await db.collection("users").doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      return null;
    }

    const userData = userDoc.data()!;

    return {
      id: decodedToken.uid,
      email: decodedToken.email || "",
      name: decodedToken.name || userData.displayName || "",
      role: userData.role || UserRole.USER,
      isVerified: userData.isVerified || false,
    };
  } catch (error) {
    // If there's any error, treat as unauthenticated
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const serverUser = await getServerUser();

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <ClientWrapper serverUser={serverUser}>{children}</ClientWrapper>
      </body>
    </html>
  );
}
