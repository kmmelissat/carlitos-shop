"use client";

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isProcessingOrder: boolean;
}

interface CartActions {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setProcessingOrder: (processing: boolean) => void;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
  loadCartFromStorage: () => void;
  calculateTotals: (items: CartItem[]) => { total: number; itemCount: number };
}

type CartStore = CartState & CartActions;

// Helper function to calculate totals
const calculateTotals = (
  items: CartItem[]
): { total: number; itemCount: number } => {
  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

export const useCartStore = create<CartStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    items: [],
    total: 0,
    itemCount: 0,
    isProcessingOrder: false,

    // Helper function
    calculateTotals,

    // Actions
    addItem: (product: Product, quantity: number = 1) => {
      const state = get();

      // Prevent adding items while processing order
      if (state.isProcessingOrder) return;

      const existingItemIndex = state.items.findIndex(
        (item) => item.product.id === product.id
      );

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? {
                ...item,
                quantity: item.quantity + quantity,
                totalPrice: (item.quantity + quantity) * product.price,
              }
            : item
        );
      } else {
        newItems = [
          ...state.items,
          {
            product,
            quantity,
            totalPrice: quantity * product.price,
          },
        ];
      }

      const { total, itemCount } = calculateTotals(newItems);
      set({ items: newItems, total, itemCount });
    },

    updateQuantity: (productId: string, quantity: number) => {
      const state = get();

      // Prevent updating items while processing order
      if (state.isProcessingOrder) return;

      const newItems = state.items.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity,
              totalPrice: quantity * item.product.price,
            }
          : item
      );

      const { total, itemCount } = calculateTotals(newItems);
      set({ items: newItems, total, itemCount });
    },

    removeItem: (productId: string) => {
      const state = get();

      // Prevent removing items while processing order
      if (state.isProcessingOrder) return;

      const newItems = state.items.filter(
        (item) => item.product.id !== productId
      );

      const { total, itemCount } = calculateTotals(newItems);
      set({ items: newItems, total, itemCount });
    },

    clearCart: () => {
      set({
        items: [],
        total: 0,
        itemCount: 0,
        isProcessingOrder: false, // Reset processing state when clearing
      });
    },

    setProcessingOrder: (processing: boolean) => {
      set({ isProcessingOrder: processing });
    },

    isInCart: (productId: string) => {
      const state = get();
      return state.items.some((item) => item.product.id === productId);
    },

    getItemQuantity: (productId: string) => {
      const state = get();
      const item = state.items.find((item) => item.product.id === productId);
      return item ? item.quantity : 0;
    },

    loadCartFromStorage: () => {
      if (typeof window === "undefined") return;

      const state = get();
      // Don't load cart if we're processing an order
      if (state.isProcessingOrder) return;

      try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          const cartItems = JSON.parse(savedCart);
          const { total, itemCount } = calculateTotals(cartItems);
          set({ items: cartItems, total, itemCount });
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    },
  }))
);

// Auto-load cart from localStorage on client-side
if (typeof window !== "undefined") {
  useCartStore.getState().loadCartFromStorage();
}

// Subscribe to items changes and save to localStorage
useCartStore.subscribe(
  (state) => state.items,
  (items) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }
);
