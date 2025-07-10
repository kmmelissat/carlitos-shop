import {
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  Product,
  ProductFormData,
} from "@/types";

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






