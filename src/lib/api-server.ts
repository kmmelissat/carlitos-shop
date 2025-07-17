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

// Recursively convert all Firestore Timestamps to Date objects
const convertTimestampsToDate = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // If it's a Firestore Timestamp, convert it
  if (obj && typeof obj.toDate === "function") {
    return obj.toDate();
  }

  // If it's a plain Date, return as is
  if (obj instanceof Date) {
    return obj;
  }

  // If it's an array, recursively process each element
  if (Array.isArray(obj)) {
    return obj.map(convertTimestampsToDate);
  }

  // If it's an object, recursively process each property
  if (typeof obj === "object") {
    const converted: any = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertTimestampsToDate(value);
    }
    return converted;
  }

  // For primitive values, return as is
  return obj;
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
      // Convert all nested Firestore Timestamps to Date objects
      const cleanData = convertTimestampsToDate(data);
      products.push({
        id: doc.id,
        ...cleanData,
        // Ensure top-level dates are properly set
        createdAt: safeToDate(cleanData.createdAt) || new Date(),
        updatedAt: safeToDate(cleanData.updatedAt) || new Date(),
        expiryDate: safeToDate(cleanData.expiryDate),
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
    // Convert all nested Firestore Timestamps to Date objects
    const cleanData = convertTimestampsToDate(data);
    return {
      id: productDoc.id,
      ...cleanData,
      // Ensure top-level dates are properly set
      createdAt: safeToDate(cleanData.createdAt) || new Date(),
      updatedAt: safeToDate(cleanData.updatedAt) || new Date(),
      expiryDate: safeToDate(cleanData.expiryDate),
    } as Product;
  } catch (error) {
    console.error("Error fetching product from server:", error);
    return null;
  }
};

// Fetch orders for admin dashboard
export const getOrdersServer = async () => {
  try {
    const ordersSnapshot = await db
      .collection("orders")
      .orderBy("createdAt", "desc")
      .get();

    const orders: any[] = [];
    ordersSnapshot.forEach((doc) => {
      const data = doc.data();
      // Convert all nested Firestore Timestamps to Date objects
      const cleanData = convertTimestampsToDate(data);
      orders.push({
        id: doc.id,
        ...cleanData,
        // Ensure top-level dates are properly set
        createdAt: safeToDate(cleanData.createdAt) || new Date(),
        updatedAt: safeToDate(cleanData.updatedAt) || new Date(),
      });
    });

    return orders;
  } catch (error) {
    console.error("Error fetching orders from server:", error);
    return [];
  }
};

// Fetch users for admin dashboard
export const getUsersServer = async () => {
  try {
    const usersSnapshot = await db
      .collection("users")
      .orderBy("createdAt", "desc")
      .get();

    const users: any[] = [];
    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      // Convert all nested Firestore Timestamps to Date objects
      const cleanData = convertTimestampsToDate(data);
      users.push({
        id: doc.id,
        ...cleanData,
        // Ensure top-level dates are properly set
        createdAt: safeToDate(cleanData.createdAt) || new Date(),
      });
    });

    return users;
  } catch (error) {
    console.error("Error fetching users from server:", error);
    return [];
  }
};

// Get recent orders (last 5)
export const getRecentOrdersServer = async () => {
  try {
    const ordersSnapshot = await db
      .collection("orders")
      .orderBy("createdAt", "desc")
      .limit(5)
      .get();

    const orders: any[] = [];
    ordersSnapshot.forEach((doc) => {
      const data = doc.data();
      // Convert all nested Firestore Timestamps to Date objects
      const cleanData = convertTimestampsToDate(data);
      orders.push({
        id: doc.id,
        ...cleanData,
        // Ensure top-level dates are properly set
        createdAt: safeToDate(cleanData.createdAt) || new Date(),
      });
    });

    return orders;
  } catch (error) {
    console.error("Error fetching recent orders from server:", error);
    return [];
  }
};

// Get admin dashboard statistics
export const getAdminStatsServer = async () => {
  try {
    const [products, orders, users] = await Promise.all([
      getProductsServer(),
      getOrdersServer(),
      getUsersServer(),
    ]);

    // Calculate product stats
    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.stock > 0).length;
    const outOfStock = products.filter((p) => p.stock === 0).length;

    // Calculate order stats
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(
      (o) => o.status?.status === "pending"
    ).length;
    const completedOrders = orders.filter(
      (o) => o.status?.status === "completed"
    ).length;

    // Calculate customer stats
    const totalCustomers = users.length;
    const thisMonth = new Date();
    thisMonth.setMonth(thisMonth.getMonth() - 1);
    const newCustomers = users.filter((u) => u.createdAt > thisMonth).length;

    // Calculate revenue from completed orders
    const revenue = orders
      .filter((o) => o.status?.status === "completed")
      .reduce((sum, order) => sum + (order.total || 0), 0);

    return {
      totalProducts,
      activeProducts,
      outOfStock,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalCustomers,
      newCustomers,
      revenue,
    };
  } catch (error) {
    console.error("Error calculating admin stats:", error);
    return {
      totalProducts: 0,
      activeProducts: 0,
      outOfStock: 0,
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      totalCustomers: 0,
      newCustomers: 0,
      revenue: 0,
    };
  }
};

// Update order status
export const updateOrderStatusServer = async (
  orderId: string,
  newStatus: string,
  notes?: string
) => {
  try {
    const orderRef = db.collection("orders").doc(orderId);

    await orderRef.update({
      "status.status": newStatus,
      "status.updatedAt": new Date(),
      "status.notes": notes || "",
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
};
