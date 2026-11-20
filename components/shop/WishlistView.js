"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import { useStore } from "@/components/providers/StoreProvider";

export default function WishlistView({ products }) {
  const { hydrated, wishlist } = useStore();
  const saved = products.filter((p) => wishlist.includes(p.id));

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8 h-12 w-56 animate-pulse rounded bg-black/10" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] animate-pulse rounded-xl bg-black/10" />
          ))}
        </div>
      </div>
    );
  }

  if (saved.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
        <Heart size={56} className="mb-4 text-black/20" />
        <h1 className="font-display text-4xl">Your wishlist is empty</h1>
        <p className="mt-3 text-black/60">
          Tap the heart on any product to save it for later.
        </p>
        <Link
          href="/shop"
          className="mt-8 rounded-full bg-brand px-8 py-3 text-sm font-semibold text-white transition hover:bg-accent"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 font-display text-4xl sm:text-5xl">
        Wishlist <span className="text-xl text-black/40">({saved.length})</span>
      </h1>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
        {saved.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}