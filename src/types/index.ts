// Product types
export type {
  Product,
  NutritionalInfo,
  ProductFormData,
  ProductFilter,
  CartItem,
  Review,
} from "./product";

export { ProductCategory } from "./product";

// User types
export type {
  User,
  Address,
  AuthUser,
  LoginFormData,
  RegisterFormData,
  ProfileFormData,
  AuthState,
  Seller,
} from "./user";

export { UserRole } from "./user";

// Common types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FirebaseError {
  code: string;
  message: string;
}
