"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { CartItem, Product } from "@/types";

// Tipos para actions
type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity: number } }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; quantity: number };
    }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" }
  | { type: "SET_PROCESSING_ORDER"; payload: boolean }
  | { type: "LOAD_CART"; payload: CartItem[] };

// Estado del carrito
interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isProcessingOrder: boolean;
}

// Estado inicial
const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isProcessingOrder: false,
};

// Función para calcular totales
const calculateTotals = (
  items: CartItem[]
): { total: number; itemCount: number } => {
  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

// Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      // Prevent adding items while processing order
      if (state.isProcessingOrder) return state;

      const { product, quantity } = action.payload;
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

      const newTotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const newItemCount = newItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItemCount,
      };
    }

    case "UPDATE_QUANTITY": {
      // Prevent updating items while processing order
      if (state.isProcessingOrder) return state;

      const { productId, quantity } = action.payload;
      const newItems = state.items.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity,
              totalPrice: quantity * item.product.price,
            }
          : item
      );

      const newTotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const newItemCount = newItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItemCount,
      };
    }

    case "REMOVE_ITEM": {
      // Prevent removing items while processing order
      if (state.isProcessingOrder) return state;

      const productId = action.payload;
      const newItems = state.items.filter(
        (item) => item.product.id !== productId
      );

      const newTotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const newItemCount = newItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItemCount,
      };
    }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
        isProcessingOrder: false, // Reset processing state when clearing
      };

    case "SET_PROCESSING_ORDER":
      return {
        ...state,
        isProcessingOrder: action.payload,
      };

    case "LOAD_CART":
      // Don't load cart if we're processing an order
      if (state.isProcessingOrder) return state;

      return {
        ...state,
        items: action.payload,
        total: action.payload.reduce((sum, item) => sum + item.totalPrice, 0),
        itemCount: action.payload.reduce((sum, item) => sum + item.quantity, 0),
      };

    default:
      return state;
  }
};

// Context
interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  isProcessingOrder: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setProcessingOrder: (processing: boolean) => void;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: "LOAD_CART", payload: cartItems });
      } catch (error) {
        console.error("Error al cargar carrito desde localStorage:", error);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(state.items));
    }
  }, [state.items]);

  // Funciones del carrito
  const addItem = (product: Product, quantity: number = 1): void => {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
  };

  const removeItem = (productId: string): void => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number): void => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  };

  const clearCart = (): void => {
    dispatch({ type: "CLEAR_CART" });
    // localStorage will be updated automatically by the useEffect
  };

  const setProcessingOrder = (processing: boolean): void => {
    dispatch({ type: "SET_PROCESSING_ORDER", payload: processing });
  };

  const isInCart = (productId: string): boolean => {
    return state.items.some((item) => item.product.id === productId);
  };

  const getItemQuantity = (productId: string): number => {
    const item = state.items.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const contextValue: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setProcessingOrder,
    isInCart,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

// Hook personalizado
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
