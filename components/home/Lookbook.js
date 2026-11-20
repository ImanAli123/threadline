"use client";

import Link from "next/link";
import { useState } from "react";
import ProductImage from "@/components/ui/ProductImage";
import { useStore } from "@/components/providers/StoreProvider";
import { formatPrice } from "@/lib/utils";

const priceOf = (p) => p.discountPrice ?? p.price;
const sizeOf = (p) => (p.sizes.includes("M") ? "M" : p.sizes[0]);

export default function Lookbook({ items }) {
  const { addItem, openCart } = useStore();
  const [active, setActive] = useState(0);
  const total = items.reduce((sum, p) => sum + priceOf(p), 0);
  const add = (p) => addItem({ product: p, color: p.colors[0], size: sizeOf(p) });
  const addAll = () => {
    items.forEach(add);
    openCart();
  };

  return (
    <section id="lookbook" className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 sm:py-28">
      <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-pop">Lookbook</p>
          <h2 className="font-serif text-4xl tracking-[-0.02em] sm:text-5xl">Shop the Look</h2>
        </div>
        <p className="max-w-md text-sm text-charcoal">
          Pick a piece to see its details, or add the whole outfit to your bag in one tap.
        </p>
      </div>

      <div className="grid items-stretch gap-8 lg:grid-cols-12">
        {/* Outfit board built from the real products */}
        <div className="grid h-[520px] grid-cols-2 grid-rows-2 gap-3 sm:h-[620px] lg:col-span-7 lg:h-auto lg:min-h-[640px]">
          {items.map((p, idx) => {
            const isActive = active === idx;
            const tall = idx === 0 || items.length < 3;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActive(idx)}
                aria-label={`Select ${p.title}`}
                aria-pressed={isActive}
                className={`group relative h-full overflow-hidden rounded-sm bg-stone text-left transition-shadow ${tall ? "row-span-2" : ""} ${isActive ? "ring-2 ring-pop ring-offset-2 ring-offset-alabaster" : ""}`}
              >
                <ProductImage
                  src={p.images[0]}
                  alt={p.title}
                  color={p.colors[0].hex}
                  className="transition-transform duration-700 group-hover:scale-105"
                />
                <span
                  className={`absolute left-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold shadow ${isActive ? "bg-pop text-white" : "bg-alabaster text-obsidian"}`}
                >
                  {idx + 1}
                </span>
                <span className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-obsidian/75 to-transparent p-3 pt-10 text-alabaster">
                  <span className="block font-serif text-lg leading-tight sm:text-xl">{p.title}</span>
                  <span className="block text-xs text-white/80">{formatPrice(priceOf(p))}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Outfit details */}
        <div className="flex flex-col justify-between rounded-sm border border-stone bg-stone/35 p-6 sm:p-8 lg:col-span-5">
          <div>
            <div className="flex items-center justify-between border-b border-stone pb-4">
              <span className="text-xs uppercase tracking-[0.18em] text-charcoal">
                Complete outfit ({items.length} pieces)
              </span>
              <span className="font-serif text-lg">{formatPrice(total)}</span>
            </div>
            <ul className="mt-6 space-y-4">
              {items.map((p, idx) => (
                <li
                  key={p.id}
                  className={`flex items-center gap-4 rounded-sm border p-3.5 transition-all ${active === idx ? "border-obsidian bg-alabaster" : "border-stone bg-alabaster/60"}`}
                >
                  <button
                    type="button"
                    onClick={() => setActive(idx)}
                    className="relative h-20 w-16 shrink-0 overflow-hidden rounded-sm bg-stone"
                    aria-label={`Select ${p.title}`}
                  >
                    <ProductImage src={p.images[0]} alt="" color={p.colors[0].hex} />
                  </button>
                  <div className="min-w-0 flex-1">
                    <span className={`rounded-sm px-1.5 py-0.5 text-[10px] ${active === idx ? "bg-pop text-white" : "bg-stone"}`}>
                      {idx + 1}
                    </span>
                    <h3 className="mt-0.5 truncate font-serif text-lg">
                      <Link href={`/product/${p.slug}`} className="transition-colors hover:text-pop">
                        {p.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-charcoal">
                      {formatPrice(priceOf(p))}, size {sizeOf(p)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      add(p);
                      openCart();
                    }}
                    className="shrink-0 rounded-sm border border-obsidian px-3.5 py-2 text-[11px] uppercase tracking-widest transition-colors hover:bg-obsidian hover:text-alabaster"
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            onClick={addAll}
            className="mt-8 w-full rounded-sm bg-pop py-4 text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-obsidian"
          >
            Add complete outfit to bag
          </button>
        </div>
      </div>
    </section>
  );
}