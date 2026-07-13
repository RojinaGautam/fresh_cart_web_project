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
import { Wishlist } from "../api/wishlist";
import {
  addWishlistItemAction,
  getWishlistAction,
  removeWishlistItemAction,
} from "../actions/wishlist-action";
import { useAuth } from "./AuthContext";

type WishlistContextValue = {
  wishlist: Wishlist | null;
  loading: boolean;
  refetch: () => Promise<void>;
  addItem: (productId: string) => Promise<boolean>;
  removeItem: (productId: string) => Promise<boolean>;
  isSaved: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined,
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist(null);
      return;
    }

    setLoading(true);

    try {
      const response = await getWishlistAction();
      if (response.success) {
        setWishlist(response.data as Wishlist);
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

  const addItem = useCallback(async (productId: string) => {
    const response = await addWishlistItemAction(productId);
    if (response.success) {
      setWishlist(response.data as Wishlist);
      return true;
    }
    return false;
  }, []);

  const removeItem = useCallback(async (productId: string) => {
    const response = await removeWishlistItemAction(productId);
    if (response.success) {
      setWishlist(response.data as Wishlist);
      return true;
    }
    return false;
  }, []);

  const isSaved = useCallback(
    (productId: string) =>
      Boolean(wishlist?.items.some((item) => item.product.id === productId)),
    [wishlist],
  );

  const value = useMemo(
    () => ({ wishlist, loading, refetch, addItem, removeItem, isSaved }),
    [wishlist, loading, refetch, addItem, removeItem, isSaved],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
}
