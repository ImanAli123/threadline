"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";

const categoryOptions = [
  { value: "all", label: "All Products" },
  { value: "new", label: "New Arrivals" },
  { value: "women", label: "Women" },
  { value: "men", label: "Men" },
  { value: "accessories", label: "Accessories" },
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const sizeOptions = ["XS", "S", "M", "L", "XL"];
const MAX_PRICE = 25000;

const effectivePrice = (p) => p.discountPrice ?? p.price;

export default function ShopClient({ products }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Category and sort live in the URL so links like /shop?category=men work
  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "featured";

  const [sizes, setSizes] = useState([]);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const setParam = (key, value, defaultValue) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === defaultValue) params.delete(key);
    else params.set(key, value);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const toggleSize = (s) =>
    setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const hasFilters = category !== "all" || sizes.length > 0 || maxPrice < MAX_PRICE;

  const clearAll = () => {
    setSizes([]);
    setMaxPrice(MAX_PRICE);
    router.replace(pathname, { scroll: false });
  };

  const filtered = useMemo(() => {
    const list = products.filter((p) => {
      if (category === "new" && !p.isNew) return false;
      if (category !== "all" && category !== "new" && p.category !== category)
        return false;
      if (effectivePrice(p) > maxPrice) return false;
      if (sizes.length && !sizes.some((s) => p.sizes.includes(s))) return false;
      return true;
    });

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => effectivePrice(a) - effectivePrice(b));
        break;
      case "price-desc":
        list.sort((a, b) => effectivePrice(b) - effectivePrice(a));
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.id - a.id);
        break;
      default:
        list.sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller) || a.id - b.id);
    }
    return list;
  }, [products, category, sort, sizes, maxPrice]);

  const heading =
    categoryOptions.find((o) => o.value === category)?.label ?? "All Products";

  const filterPanel = (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">Category</h3>
        <ul className="space-y-2 text-sm">
          {categoryOptions.map((o) => (
            <li key={o.value}>
              <button
                onClick={() => setParam("category", o.value, "all")}
                className={`transition hover:text-accent ${
                  category === o.value ? "font-semibold text-accent" : ""
                }`}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((s) => (
            <button
              key={s}
              onClick={() => toggleSize(s)}
              className={`h-10 min-w-10 rounded-md border px-3 text-sm transition ${
                sizes.includes(s)
                  ? "border-brand bg-brand text-white"
                  : "border-black/20 hover:border-brand"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 flex justify-between text-sm font-semibold uppercase tracking-wider">
          <span>Max price</span>
          <span className="font-normal normal-case">Rs {maxPrice.toLocaleString("en-US")}</span>
        </h3>
        <input
          type="range"
          min="1000"
          max={MAX_PRICE}
          step="500"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#c8a27a]"
        />
      </div>

      {hasFilters && (
        <button onClick={clearAll} className="text-sm underline hover:text-accent">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="mb-2 text-xs uppercase tracking-widest text-black/50">
          Home / Shop
        </p>
        <h1 className="font-display text-4xl sm:text-5xl">{heading}</h1>
      </div>

      {/* Toolbar */}
      <div className="mb-8 flex items-center justify-between gap-4 border-b border-black/10 pb-4">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 text-sm font-medium lg:hidden"
        >
          <SlidersHorizontal size={18} /> Filters
        </button>

        <p className="hidden text-sm text-black/60 lg:block">
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </p>

        <label className="flex items-center gap-2 text-sm">
          <span className="hidden text-black/60 sm:inline">Sort by</span>
          <select
            value={sort}
            onChange={(e) => setParam("sort", e.target.value, "featured")}
            className="rounded-md border border-black/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">{filterPanel}</aside>

        <div>
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display text-2xl">No products match your filters</p>
              <button
                onClick={clearAll}
                className="mt-4 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          drawerOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-cream p-6 transition-transform duration-300 ${
            drawerOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl">Filters</h2>
            <button onClick={() => setDrawerOpen(false)} aria-label="Close filters">
              <X size={24} />
            </button>
          </div>
          {filterPanel}
          <button
            onClick={() => setDrawerOpen(false)}
            className="mt-8 w-full rounded-full bg-brand py-3 text-sm font-semibold text-white"
          >
            Show {filtered.length} products
          </button>
        </div>
      </div>
    </div>
  );
}