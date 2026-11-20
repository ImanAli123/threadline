"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ShoppingBag, X } from "lucide-react";
import CartLine from "@/components/cart/CartLine";
import ShippingProgress from "@/components/cart/ShippingProgress";
import { useStore } from "@/components/providers/StoreProvider";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { items, cartOpen, closeCart, subtotal, cartCount } = useStore();

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [cartOpen, closeCart]);

  return (
    <div
      inert={!cartOpen}
      className={`fixed inset-0 z-[60] ${
        cartOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          cartOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
          <h2 className="font-display text-2xl">Your cart ({cartCount})</h2>
          <button onClick={closeCart} aria-label="Close cart">
            <X size={24} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag size={48} className="text-black/20" />
            <p className="font-display text-2xl">Your cart is empty</p>
            <p className="text-sm text-black/60">
              Looks like you haven't added anything yet.
            </p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="rounded-full bg-brand px-8 py-3 text-sm font-semibold text-white transition hover:bg-accent"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-black/10 px-6 py-4">
              <ShippingProgress subtotal={subtotal} />
            </div>

            <ul className="flex-1 divide-y divide-black/10 overflow-y-auto px-6">
              {items.map((item) => (
                <CartLine
                  key={item.key}
                  item={item}
                  compact
                  onNavigate={closeCart}
                />
              ))}
            </ul>

            <div className="space-y-3 border-t border-black/10 px-6 py-5">
              <div className="flex justify-between text-base font-semibold">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-black/60">
                Shipping and taxes calculated at checkout.
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block rounded-full bg-brand py-3 text-center text-sm font-semibold text-white transition hover:bg-accent"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="block rounded-full border border-black/20 py-3 text-center text-sm font-semibold transition hover:border-brand"
              >
                View cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}