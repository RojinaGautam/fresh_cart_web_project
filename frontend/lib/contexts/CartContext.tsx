"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Cart } from "../api/cart";
import {
  addCartItemAction,
  clearCartAction,
  getCartAction,
  removeCartItemAction,
  updateCartItemAction,
} from "../actions/cart-action";
import { useAuth } from "./AuthContext";

type CartContextValue = {
  cart: Cart | null;
  loading: boolean;
  refetch: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<boolean>;
  updateItem: (productId: string, quantity: number) => Promise<boolean>;
  removeItem: (productId: string) => Promise<boolean>;
  clear: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    setLoading(true);

    try {
      const response = await getCartAction();
      if (response.success) {
        setCart(response.data as Cart);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void refetch();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [refetch]);

  const addItem = useCallback(async (productId: string, quantity = 1) => {
    const response = await addCartItemAction(productId, quantity);
    if (response.success) {
      setCart(response.data as Cart);
      return true;
    }
    return false;
  }, []);

  const updateItem = useCallback(async (productId: string, quantity: number) => {
    const response = await updateCartItemAction(productId, quantity);
    if (response.success) {
      setCart(response.data as Cart);
      return true;
    }
    return false;
  }, []);

  const removeItem = useCallback(async (productId: string) => {
    const response = await removeCartItemAction(productId);
    if (response.success) {
      setCart(response.data as Cart);
      return true;
    }
    return false;
  }, []);

  const clear = useCallback(async () => {
    const response = await clearCartAction();
    if (response.success) {
      setCart(response.data as Cart);
    }
  }, []);

  const value = useMemo(
    () => ({ cart, loading, refetch, addItem, updateItem, removeItem, clear }),
    [cart, loading, refetch, addItem, updateItem, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
