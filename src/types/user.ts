export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  address?: Address;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export interface ProfileFormData {
  name: string;
  email: string;
  phone?: string;
  address?: Address;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

export interface Seller extends User {
  storeName: string;
  storeDescription?: string;
  storeLogo?: string;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  verificationStatus: "pending" | "verified" | "rejected";
}
