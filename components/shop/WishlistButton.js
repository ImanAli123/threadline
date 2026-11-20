"use client";

import { Heart } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";

export default function WishlistButton({ productId, className = "" }) {
  const { toggleWishlist, isWishlisted } = useStore();
  const active = isWishlisted(productId);

  return (
    <button
      type="button"
      onClick={() => toggleWishlist(productId)}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow transition hover:scale-110 ${className}`}
    >
      <Heart
        size={18}
        className={active ? "fill-red-500 text-red-500" : "text-brand"}
      />
    </button>
  );
}
