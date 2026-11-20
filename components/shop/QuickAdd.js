"use client";

import { useStore } from "@/components/providers/StoreProvider";

export default function QuickAdd({ product }) {
  const { addItem, openCart } = useStore();
  const add = (size) => {
    addItem({ product, color: product.colors[0], size });
    openCart();
  };

  return (
    <div className="quick-add-bar absolute inset-x-0 bottom-0 z-20 border-t border-stone bg-alabaster/95 p-3.5 backdrop-blur-md">
      <p className="mb-2 text-center text-[10px] uppercase tracking-[0.18em] text-charcoal">Quick add: select size</p>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {product.sizes.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => add(s)}
            className="h-8 min-w-9 rounded-sm border border-taupe px-2 text-xs font-medium transition-colors hover:border-obsidian hover:bg-obsidian hover:text-alabaster"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
