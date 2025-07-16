import "@/styles/globals.css";
import { Metadata } from "next";
import { cookies } from "next/headers";
import admin from "firebase-admin";
import { AuthUser, UserRole } from "@/types";
import { ClientWrapper } from "@/components";
import { App, ConfigProvider } from "antd";
import { antdConfig } from "@/lib/antd-config";

export const metadata: Metadata = {
  title: "CarlitosStore",
  description: "Your favorite snack store at ESEN",
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
      isVerified: decodedToken.email_verified || false,
      avatar: userData.avatar,
    };
  } catch (error) {
    console.error("Error getting server user:", error);
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
        <link rel="icon" href="/carlitos-logo.svg" type="image/svg+xml" />
      </head>
      <body>
        <ConfigProvider {...antdConfig}>
          <App>
            <ClientWrapper serverUser={serverUser}>{children}</ClientWrapper>
          </App>
        </ConfigProvider>
      </body>
    </html>
  );
}
