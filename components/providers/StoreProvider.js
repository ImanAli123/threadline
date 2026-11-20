"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/lib/utils";

const StoreContext = createContext(null);

const CART_KEY = "threadline-cart";
const WISHLIST_KEY = "threadline-wishlist";
const MAX_QTY = 10;

function readStorage(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function StoreProvider({ children }) {
  const [items, setItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load saved data once in the browser
  useEffect(() => {
    setItems(readStorage(CART_KEY));
    setWishlist(readStorage(WISHLIST_KEY));
    setHydrated(true);
  }, []);

  // Save whenever things change (only after the first load)
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {}
  }, [wishlist, hydrated]);

  const addItem = useCallback(({ product, color, size, qty = 1 }) => {
    const key = `${product.id}-${color.name}-${size}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) } : i
        );
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          slug: product.slug,
          title: product.title,
          price: product.discountPrice ?? product.price,
          color: color.name,
          colorHex: color.hex,
          size,
          qty,
          image: product.images[0] ?? null,
        },
      ];
    });
  }, []);

  const updateQty = useCallback((key, qty) => {
    setItems((prev) =>
      qty < 1
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) =>
            i.key === key ? { ...i, qty: Math.min(MAX_QTY, qty) } : i
          )
    );
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const toggleWishlist = useCallback((id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const isWishlisted = useCallback((id) => wishlist.includes(id), [wishlist]);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  const totals = useMemo(() => {
    const cartCount = items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shipping =
      items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    return { cartCount, subtotal, shipping, total: subtotal + shipping };
  }, [items]);

  const value = {
    hydrated,
    items,
    wishlist,
    cartOpen,
    ...totals,
    addItem,
    updateQty,
    removeItem,
    clearCart,
    toggleWishlist,
    isWishlisted,
    openCart,
    closeCart,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}