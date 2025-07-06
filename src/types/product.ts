export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  images: string[];
  stock: number;
  weight?: number; // en gramos
  ingredients?: string[];
  allergens?: string[];
  nutritionalInfo?: NutritionalInfo;
  brand?: string;
  expiryDate?: Date;
  seller: {
    id: string;
    name: string;
    rating: number;
  };
  rating: number;
  reviewCount: number;
  isActive: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export enum ProductCategory {
  CHIPS = "chips",
  COOKIES = "cookies",
  CANDY = "candy",
  NUTS = "nuts",
  CHOCOLATE = "chocolate",
  CRACKERS = "crackers",
  POPCORN = "popcorn",
  DRIED_FRUITS = "dried_fruits",
  HEALTHY = "healthy",
  BEVERAGES = "beverages",
  OTHER = "other",
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  images: string[];
  stock: number;
  weight?: number;
  ingredients?: string;
  allergens?: string;
  brand?: string;
  expiryDate?: string;
}

export interface ProductFilter {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
  featured?: boolean;
  search?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  totalPrice: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
