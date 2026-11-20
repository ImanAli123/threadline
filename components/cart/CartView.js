"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import CartLine from "@/components/cart/CartLine";
import ShippingProgress from "@/components/cart/ShippingProgress";
import { useStore } from "@/components/providers/StoreProvider";
import { formatPrice } from "@/lib/utils";

export default function CartView() {
  const { hydrated, items, subtotal, shipping, total, cartCount, clearCart } =
    useStore();

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8 h-12 w-56 animate-pulse rounded bg-black/10" />
        <div className="h-64 animate-pulse rounded-2xl bg-black/10" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
        <ShoppingBag size={56} className="mb-4 text-black/20" />
        <h1 className="font-display text-4xl">Your cart is empty</h1>
        <p className="mt-3 text-black/60">
          Find something you love and it will show up here.
        </p>
        <Link
          href="/shop"
          className="mt-8 rounded-full bg-brand px-8 py-3 text-sm font-semibold text-white transition hover:bg-accent"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 font-display text-4xl sm:text-5xl">
        Shopping cart{" "}
        <span className="text-xl text-black/40">({cartCount})</span>
      </h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <ul className="divide-y divide-black/10 border-y border-black/10">
            {items.map((item) => (
              <CartLine key={item.key} item={item} />
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between text-sm">
            <Link href="/shop" className="underline hover:text-accent">
              ← Continue shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-black/50 underline hover:text-red-600"
            >
              Clear cart
            </button>
          </div>
        </div>

        <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-28">
          <h2 className="mb-5 font-display text-2xl">Order summary</h2>
          <ShippingProgress subtotal={subtotal} />

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-black/60">Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-black/60">Shipping</dt>
              <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-black/10 pt-4 text-base font-semibold">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>

          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-brand py-3.5 text-center text-sm font-semibold text-white transition hover:bg-accent"
          >
            Proceed to checkout
          </Link>
          <p className="mt-3 text-center text-xs text-black/50">
            Secure checkout · 30-day returns
          </p>
        </aside>
      </div>
    </div>
  );
}