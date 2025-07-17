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

// Analytics functions for Sales Dashboard

// Get daily revenue trends for the last 30 days
export const getRevenueTrendsServer = async () => {
  try {
    const orders = await getOrdersServer();
    const completedOrders = orders.filter(
      (o) => o.status?.status === "completed"
    );

    // Get last 30 days
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split("T")[0], // YYYY-MM-DD format
        revenue: 0,
        orders: 0,
      };
    });

    // Calculate revenue for each day
    completedOrders.forEach((order) => {
      const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
      const dayData = last30Days.find((day) => day.date === orderDate);
      if (dayData) {
        dayData.revenue += order.total || 0;
        dayData.orders += 1;
      }
    });

    return last30Days.map((day) => ({
      ...day,
      formattedDate: new Date(day.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));
  } catch (error) {
    console.error("Error calculating revenue trends:", error);
    return [];
  }
};

// Get best-selling products
export const getBestSellingProductsServer = async () => {
  try {
    const orders = await getOrdersServer();
    const completedOrders = orders.filter(
      (o) => o.status?.status === "completed"
    );

    // Count product sales
    const productSales: Record<
      string,
      { name: string; sales: number; revenue: number }
    > = {};

    completedOrders.forEach((order) => {
      if (order.items) {
        order.items.forEach((item: any) => {
          // Handle different item structures
          const productId = item.product?.id || item.productId || item.id;
          const productName =
            item.product?.name || item.name || "Unknown Product";
          const quantity = item.quantity || 1;
          const price = item.product?.price || item.price || 0;

          if (!productId) return; // Skip items without a valid product ID

          if (!productSales[productId]) {
            productSales[productId] = {
              name: productName,
              sales: 0,
              revenue: 0,
            };
          }

          productSales[productId].sales += quantity;
          productSales[productId].revenue += price * quantity;
        });
      }
    });

    // Convert to array and sort by sales
    const sortedProducts = Object.entries(productSales)
      .map(([id, data]) => ({
        productId: id,
        ...data,
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10); // Top 10 products

    return sortedProducts;
  } catch (error) {
    console.error("Error calculating best-selling products:", error);
    return [];
  }
};

// Get peak sales hours
export const getPeakSalesHoursServer = async () => {
  try {
    const orders = await getOrdersServer();
    const completedOrders = orders.filter(
      (o) => o.status?.status === "completed"
    );

    // Initialize hours array (0-23)
    const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      formattedHour: `${hour.toString().padStart(2, "0")}:00`,
      orders: 0,
      revenue: 0,
    }));

    // Count orders by hour
    completedOrders.forEach((order) => {
      const orderHour = new Date(order.createdAt).getHours();
      hourlyData[orderHour].orders += 1;
      hourlyData[orderHour].revenue += order.total || 0;
    });

    return hourlyData;
  } catch (error) {
    console.error("Error calculating peak sales hours:", error);
    return [];
  }
};

// Get weekly revenue comparison (this week vs last week)
export const getWeeklyComparisonServer = async () => {
  try {
    const orders = await getOrdersServer();
    const completedOrders = orders.filter(
      (o) => o.status?.status === "completed"
    );

    const now = new Date();
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - now.getDay()); // Start of this week
    thisWeekStart.setHours(0, 0, 0, 0);

    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(thisWeekStart);
    lastWeekEnd.setTime(lastWeekEnd.getTime() - 1);

    let thisWeekRevenue = 0;
    let thisWeekOrders = 0;
    let lastWeekRevenue = 0;
    let lastWeekOrders = 0;

    completedOrders.forEach((order) => {
      const orderDate = new Date(order.createdAt);

      if (orderDate >= thisWeekStart) {
        thisWeekRevenue += order.total || 0;
        thisWeekOrders += 1;
      } else if (orderDate >= lastWeekStart && orderDate <= lastWeekEnd) {
        lastWeekRevenue += order.total || 0;
        lastWeekOrders += 1;
      }
    });

    const revenueChange =
      lastWeekRevenue === 0
        ? 100
        : ((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100;

    const ordersChange =
      lastWeekOrders === 0
        ? 100
        : ((thisWeekOrders - lastWeekOrders) / lastWeekOrders) * 100;

    return {
      thisWeek: {
        revenue: thisWeekRevenue,
        orders: thisWeekOrders,
      },
      lastWeek: {
        revenue: lastWeekRevenue,
        orders: lastWeekOrders,
      },
      changes: {
        revenue: Math.round(revenueChange * 100) / 100,
        orders: Math.round(ordersChange * 100) / 100,
      },
    };
  } catch (error) {
    console.error("Error calculating weekly comparison:", error);
    return {
      thisWeek: { revenue: 0, orders: 0 },
      lastWeek: { revenue: 0, orders: 0 },
      changes: { revenue: 0, orders: 0 },
    };
  }
};
