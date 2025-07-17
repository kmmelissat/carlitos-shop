import {
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Product, ProductFormData } from "@/types";

// Colecciones de Firestore
const PRODUCTS_COLLECTION = "products";

// Obtener producto por ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Product;
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener producto");
  }
};

// Crear producto
export const createProduct = async (
  productData: ProductFormData,
  sellerId: string
): Promise<Product> => {
  try {
    // Use image URLs directly instead of uploading files
    const imageUrls = productData.images;

    const productDoc = {
      ...productData,
      images: imageUrls,
      seller: {
        id: sellerId,
        name: "Vendedor", // Obtener nombre real del vendedor
        rating: 5,
      },
      rating: 0,
      reviewCount: 0,
      isActive: true,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(
      collection(db, PRODUCTS_COLLECTION),
      productDoc
    );

    return {
      id: docRef.id,
      ...productDoc,
    } as Product;
  } catch (error: any) {
    throw new Error(error.message || "Error al crear producto");
  }
};

// Actualizar producto
export const updateProduct = async (
  id: string,
  updates: Partial<ProductFormData>
): Promise<void> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error: any) {
    throw new Error(error.message || "Error al actualizar producto");
  }
};

// Eliminar producto
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
  } catch (error: any) {
    throw new Error(error.message || "Error al eliminar producto");
  }
};

// Utility to remove undefined fields recursively
function removeUndefined(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  } else if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, removeUndefined(v)])
    );
  }
  return obj;
}

// Crear orden
export const createOrder = async (orderData: any): Promise<string> => {
  // Validate required fields
  if (!orderData.userId) {
    throw new Error("User ID is required for order creation");
  }

  if (!orderData.items || orderData.items.length === 0) {
    throw new Error("Order must contain at least one item");
  }

  if (!orderData.total || orderData.total <= 0) {
    throw new Error("Order total must be greater than 0");
  }

  // Remove undefined values to avoid Firestore errors
  const cleanOrderData = removeUndefined(orderData);

  try {
    const docRef = await addDoc(collection(db, "orders"), cleanOrderData);

    // Verify the order was created by reading it back
    const verificationDoc = await getDoc(doc(db, "orders", docRef.id));

    if (!verificationDoc.exists()) {
      throw new Error("Order was created but verification failed");
    }

    return docRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error(
      `Failed to create order: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

// Update order status
export const updateOrderStatus = async (
  orderId: string,
  newStatus: string,
  notes?: string
): Promise<void> => {
  console.log(`API: Updating order ${orderId} to status ${newStatus}`);

  if (!orderId) {
    throw new Error("Order ID is required");
  }

  if (!newStatus) {
    throw new Error("New status is required");
  }

  try {
    const orderRef = doc(db, "orders", orderId);

    // First check if the order exists
    const orderDoc = await getDoc(orderRef);
    if (!orderDoc.exists()) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    console.log(`API: Order ${orderId} exists, updating status...`);

    await updateDoc(orderRef, {
      "status.status": newStatus,
      "status.updatedAt": new Date(),
      "status.notes": notes || "",
    });

    console.log(
      `API: Successfully updated order ${orderId} status to ${newStatus}`
    );
  } catch (error: any) {
    console.error(`API: Error updating order ${orderId}:`, error);
    throw new Error(error.message || "Error updating order status");
  }
};
