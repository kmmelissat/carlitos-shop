import admin from "firebase-admin";
import { cookies } from "next/headers";
import { AuthUser, UserRole } from "@/types";

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

export const verifyAuthToken = async (): Promise<AuthUser | null> => {
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
      avatar: userData.avatar || undefined,
    };
  } catch (error) {
    console.error("Error verifying auth token:", error);
    return null;
  }
};

export const requireAdmin = async (): Promise<AuthUser> => {
  const user = await verifyAuthToken();

  if (!user || user.role !== UserRole.ADMIN) {
    throw new Error("Admin access required");
  }

  return user;
};
