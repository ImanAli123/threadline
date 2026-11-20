"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import ProductImage from "@/components/ui/ProductImage";
import { useStore } from "@/components/providers/StoreProvider";
import { formatPrice } from "@/lib/utils";

export default function CartLine({ item, compact = false, onNavigate }) {
  const { updateQty, removeItem } = useStore();
  const initials = item.title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <li className="flex gap-4 py-5">
      <Link
        href={`/product/${item.slug}`}
        onClick={onNavigate}
        className={`relative shrink-0 overflow-hidden rounded-lg bg-stone-200 ${
          compact ? "h-24 w-20" : "h-32 w-28"
        }`}
      >
        <ProductImage
          src={item.image}
          alt={item.title}
          color={item.colorHex}
          label={initials}
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/product/${item.slug}`}
              onClick={onNavigate}
              className="block truncate text-sm font-medium hover:text-accent"
            >
              {item.title}
            </Link>
            <p className="mt-1 text-xs text-black/60">
              {item.color} · {item.size}
            </p>
          </div>
          <button
            onClick={() => removeItem(item.key)}
            aria-label={`Remove ${item.title}`}
            className="text-black/40 transition hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center rounded-full border border-black/20">
            <button
              onClick={() => updateQty(item.key, item.qty - 1)}
              aria-label="Decrease quantity"
              className="px-3 py-1.5"
            >
              <Minus size={14} />
            </button>
            <span className="w-6 text-center text-sm">{item.qty}</span>
            <button
              onClick={() => updateQty(item.key, item.qty + 1)}
              aria-label="Increase quantity"
              className="px-3 py-1.5"
            >
              <Plus size={14} />
            </button>
          </div>
          <span className="text-sm font-semibold">
            {formatPrice(item.price * item.qty)}
          </span>
        </div>
      </div>
    </li>
  );
}