"use client";

import { useState } from "react";
import { Heart, Star, Truck, RotateCcw, ShieldCheck, Check, Minus, Plus } from "lucide-react";
import ProductImage from "@/components/ui/ProductImage";
import { formatPrice } from "@/lib/utils";
import { useStore } from "@/components/providers/StoreProvider";

export default function ProductDetail({ product }) {
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const { addItem, openCart, toggleWishlist, isWishlisted } = useStore();
  const wished = isWishlisted(product.id);
  const [activeImg, setActiveImg] = useState(0);

  const onSale = product.discountPrice != null;
  const price = product.discountPrice ?? product.price;
  const savePercent = onSale
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const initials = product.title.split(" ").slice(0, 2).map((w) => w[0]).join("");

   const handleAdd = () => {
    if (!size) {
      setError("Please select a size.");
      document
        .getElementById("size-section")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setError("");
    addItem({ product, color, size, qty });
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone-200">
            <ProductImage
              src={product.images[activeImg]}
              alt={product.title}
              color={color.hex}
              label={initials}
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImg(i)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 ${
                    i === activeImg ? "border-brand" : "border-transparent"
                  }`}
                >
                  <ProductImage src={img} alt={`${product.title} view ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-black/50">
            {product.category}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl">{product.title}</h1>

          {product.reviewCount > 0 && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < Math.round(product.rating)
                      ? "fill-accent text-accent"
                      : "text-black/20"
                  }
                />
              ))}
            </div>
            <span className="text-black/60">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>
          )}

          <div className="mt-5 flex items-center gap-3">
            <span className="text-2xl font-semibold">{formatPrice(price)}</span>
            {onSale && (
              <>
                <span className="text-lg text-black/40 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                  Save {savePercent}%
                </span>
              </>
            )}
          </div>

          <p className="mt-5 leading-relaxed text-black/70">{product.description}</p>

          {/* Colour */}
          <div className="mt-8">
            <p className="mb-3 text-sm font-semibold">
              Colour: <span className="font-normal">{color.name}</span>
            </p>
            <div className="flex gap-3">
              {product.colors.map((col) => (
                <button
                  key={col.name}
                  onClick={() => setColor(col)}
                  aria-label={col.name}
                  title={col.name}
                  className={`h-9 w-9 rounded-full border border-black/20 transition ${
                    color.name === col.name
                      ? "ring-2 ring-brand ring-offset-2 ring-offset-cream"
                      : ""
                  }`}
                  style={{ backgroundColor: col.hex }}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div id="size-section" className="mt-8">
            <div className="mb-3 flex justify-between text-sm">
              <p className="font-semibold">
                Size: <span className="font-normal">{size ?? "Select a size"}</span>
              </p>
              <span className="underline">Size guide</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSize(s);
                    setError("");
                  }}
                  className={`h-11 min-w-12 rounded-md border px-4 text-sm transition ${
                    size === s
                      ? "border-brand bg-brand text-white"
                      : "border-black/20 hover:border-brand"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          {/* Quantity + add */}
          <div className="mt-8 flex gap-3">
            <div className="flex items-center rounded-full border border-black/20">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-4 py-3"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                className="px-4 py-3"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAdd}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white transition ${
                added ? "bg-green-600" : "bg-brand hover:bg-accent"
              }`}
            >
              {added ? (
                <>
                  <Check size={18} /> Added to cart
                </>
              ) : (
                "Add to cart"
              )}
            </button>

            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label="Add to wishlist"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-black/20"
            >
              <Heart size={20} className={wished ? "fill-red-500 text-red-500" : ""} />
            </button>
          </div>

          {/* Trust */}
          <div className="mt-8 grid grid-cols-3 gap-3 border-y border-black/10 py-5 text-center text-xs">
            <div className="flex flex-col items-center gap-2">
              <Truck size={20} /> Free delivery over Rs 7,000
            </div>
            <div className="flex flex-col items-center gap-2">
              <RotateCcw size={20} /> 30-day returns
            </div>
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck size={20} /> Secure checkout
            </div>
          </div>

          {/* Accordions */}
          <div className="mt-2 divide-y divide-black/10 text-sm">
            <details className="group py-4" open>
              <summary className="cursor-pointer font-semibold">Details &amp; care</summary>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-black/70">
                {product.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </details>
            <details className="py-4">
              <summary className="cursor-pointer font-semibold">Shipping</summary>
              <p className="mt-3 text-black/70">
                Standard delivery takes 3 to 5 working days. Free on orders over Rs 7,000, otherwise Rs 250.
              </p>
            </details>
            <details className="py-4">
              <summary className="cursor-pointer font-semibold">Returns</summary>
              <p className="mt-3 text-black/70">
                Not happy? Return unworn items within 30 days for a full refund.
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* Sticky mobile bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-black/10 bg-cream/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div>
          <p className="text-xs text-black/60">{product.title}</p>
          <p className="font-semibold">{formatPrice(price)}</p>
        </div>
        <button
          onClick={handleAdd}
          className="rounded-full bg-brand px-8 py-3 text-sm font-semibold text-white"
        >
          {added ? "Added ✓" : "Add to cart"}
        </button>
      </div>
    </>
  );
}