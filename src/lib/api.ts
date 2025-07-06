import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import {
  Product,
  ProductFormData,
  ProductFilter,
  Review,
  PaginatedResponse,
} from "@/types";

// Colecciones de Firestore
const PRODUCTS_COLLECTION = "products";
const REVIEWS_COLLECTION = "reviews";

// Obtener todos los productos con filtros
export const getProducts = async (
  filters: ProductFilter = {},
  page: number = 1,
  pageSize: number = 12
): Promise<PaginatedResponse<Product>> => {
  try {
    let q = query(collection(db, PRODUCTS_COLLECTION));

    // Aplicar filtros
    if (filters.category) {
      q = query(q, where("category", "==", filters.category));
    }

    if (filters.inStock) {
      q = query(q, where("stock", ">", 0));
    }

    if (filters.featured) {
      q = query(q, where("featured", "==", true));
    }

    if (filters.minPrice || filters.maxPrice) {
      if (filters.minPrice && filters.maxPrice) {
        q = query(
          q,
          where("price", ">=", filters.minPrice),
          where("price", "<=", filters.maxPrice)
        );
      } else if (filters.minPrice) {
        q = query(q, where("price", ">=", filters.minPrice));
      } else if (filters.maxPrice) {
        q = query(q, where("price", "<=", filters.maxPrice));
      }
    }

    // Ordenar
    q = query(q, orderBy("createdAt", "desc"));

    // Paginación
    q = query(q, limit(pageSize));

    const querySnapshot = await getDocs(q);
    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      } as Product);
    });

    // Contar total (simplificado)
    const total = products.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
      data: products,
      total,
      page,
      limit: pageSize,
      totalPages,
    };
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener productos");
  }
};

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
    // Subir imágenes
    const imageUrls = await uploadImages(productData.images);

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

// Subir imágenes a Firebase Storage
const uploadImages = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(async (file) => {
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  });

  return Promise.all(uploadPromises);
};

// Buscar productos
export const searchProducts = async (
  searchTerm: string
): Promise<Product[]> => {
  try {
    // Búsqueda simple por nombre (Firebase no soporta búsqueda de texto completo nativa)
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where("name", ">=", searchTerm),
      where("name", "<=", searchTerm + "\uf8ff"),
      orderBy("name")
    );

    const querySnapshot = await getDocs(q);
    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      } as Product);
    });

    return products;
  } catch (error: any) {
    throw new Error(error.message || "Error al buscar productos");
  }
};

// Obtener productos destacados
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where("featured", "==", true),
      where("isActive", "==", true),
      orderBy("createdAt", "desc"),
      limit(8)
    );

    const querySnapshot = await getDocs(q);
    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      } as Product);
    });

    return products;
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener productos destacados");
  }
};

// Obtener reseñas de un producto
export const getProductReviews = async (
  productId: string
): Promise<Review[]> => {
  try {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      where("productId", "==", productId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const reviews: Review[] = [];

    querySnapshot.forEach((doc) => {
      reviews.push({
        id: doc.id,
        ...doc.data(),
      } as Review);
    });

    return reviews;
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener reseñas");
  }
};
