import admin from "firebase-admin";
import { Product } from "@/types";

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

// Helper function to safely convert various date formats to Date or null
const safeToDate = (dateValue: any): Date | null => {
  if (!dateValue) return null;

  // If it's already a Date object
  if (dateValue instanceof Date) return dateValue;

  // If it's a Firestore Timestamp
  if (dateValue && typeof dateValue.toDate === "function") {
    return dateValue.toDate();
  }

  // If it's a string, try to parse it
  if (typeof dateValue === "string") {
    const parsed = new Date(dateValue);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  // If it's a number (timestamp)
  if (typeof dateValue === "number") {
    return new Date(dateValue);
  }

  return null;
};

export const getProductsServer = async (): Promise<Product[]> => {
  try {
    const productsSnapshot = await db
      .collection("products")
      .orderBy("createdAt", "desc")
      .get();

    const products: Product[] = [];
    productsSnapshot.forEach((doc) => {
      const data = doc.data();
      products.push({
        id: doc.id,
        ...data,
        createdAt: safeToDate(data.createdAt) || new Date(),
        updatedAt: safeToDate(data.updatedAt) || new Date(),
        expiryDate: safeToDate(data.expiryDate),
      } as Product);
    });

    return products;
  } catch (error) {
    console.error("Error fetching products from server:", error);
    return [];
  }
};

export const getProductByIdServer = async (
  id: string
): Promise<Product | null> => {
  try {
    const productDoc = await db.collection("products").doc(id).get();

    if (!productDoc.exists) {
      return null;
    }

    const data = productDoc.data()!;
    return {
      id: productDoc.id,
      ...data,
      createdAt: safeToDate(data.createdAt) || new Date(),
      updatedAt: safeToDate(data.updatedAt) || new Date(),
      expiryDate: safeToDate(data.expiryDate),
    } as Product;
  } catch (error) {
    console.error("Error fetching product from server:", error);
    return null;
  }
};
