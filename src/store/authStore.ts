"use client";

import { create } from "zustand";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getCurrentUser } from "@/lib/auth";
import { AuthUser, LoginFormData, RegisterFormData } from "@/types";
import {
  loginUser,
  registerUser,
  logoutUser,
  signInWithGoogle,
} from "@/lib/auth";

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  setLoading: (loading: boolean) => void;
  setUser: (user: AuthUser | null) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  login: (credentials: LoginFormData) => Promise<void>;
  register: (userData: RegisterFormData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: (serverUser?: AuthUser | null) => (() => void) | undefined;
  setupAuthListener: () => () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  loading: true,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),

  setUser: (user) => set({ user, loading: false, error: null }),

  setError: (error) => set({ error, loading: false }),

  clearError: () => set({ error: null }),

  login: async (credentials) => {
    try {
      set({ loading: true, error: null });
      const user = await loginUser(credentials);
      set({ user, loading: false, error: null });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  register: async (userData) => {
    try {
      set({ loading: true, error: null });
      const user = await registerUser(userData);
      set({ user, loading: false, error: null });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  loginWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      const user = await signInWithGoogle();
      set({ user, loading: false, error: null });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ loading: true });
      await logoutUser();
      set({ user: null, loading: false, error: null });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  initializeAuth: (serverUser) => {
    // Initialize with server user if provided
    if (serverUser) {
      set({ user: serverUser, loading: true, error: null });
      // Small delay to prevent flash
      setTimeout(() => {
        set({ loading: false });
      }, 100);
    }

    // Set up Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Store the ID token in a cookie for server-side verification
          const idToken = await firebaseUser.getIdToken();
          document.cookie = `firebase-id-token=${idToken}; path=/; secure; samesite=strict; max-age=3600`;

          const user = await getCurrentUser();
          set({ user, loading: false, error: null });
        } catch (error) {
          console.error("Error getting user:", error);
          set({ user: null, loading: false, error: null });
        }
      } else {
        // Clear the cookie when user logs out
        document.cookie =
          "firebase-id-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        set({ user: null, loading: false, error: null });
      }
    });

    // Return cleanup function
    return unsubscribe;
  },

  // Helper function to set up auth listener (for external use)
  setupAuthListener: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          document.cookie = `firebase-id-token=${idToken}; path=/; secure; samesite=strict; max-age=3600`;

          const user = await getCurrentUser();
          set({ user, loading: false, error: null });
        } catch (error) {
          console.error("Error getting user:", error);
          set({ user: null, loading: false, error: null });
        }
      } else {
        document.cookie =
          "firebase-id-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        set({ user: null, loading: false, error: null });
      }
    });

    return unsubscribe;
  },
}));

// Initialize auth listener when the store is created
let unsubscribeAuth: (() => void) | null = null;

// Auto-initialize the auth listener
if (typeof window !== "undefined") {
  unsubscribeAuth = useAuthStore.getState().setupAuthListener();
}

// Cleanup function for when needed
export const cleanupAuthStore = () => {
  if (unsubscribeAuth) {
    unsubscribeAuth();
    unsubscribeAuth = null;
  }
};
 