"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import ProductImage from "@/components/ui/ProductImage";
import { api } from "@/components/admin/api";
import { formatPrice } from "@/lib/utils";

export default function ProductsAdmin() {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    api("/api/admin/products").then((d) => setProducts(d.products)).catch((e) => setError(e.message));
  }, []);

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (products ?? []).filter((p) => !t || p.title.toLowerCase().includes(t) || p.category.includes(t));
  }, [products, q]);

  const remove = async (p) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    try {
      await api(`/api/admin/products/${p.id}`, { method: "DELETE" });
      setProducts((list) => list.filter((x) => x.id !== p.id));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-4xl">Products</h1>
        <Link href="/admin/products/new" className="flex items-center gap-2 rounded-sm bg-obsidian px-5 py-3 text-xs font-medium uppercase tracking-[0.15em] text-alabaster transition-colors hover:bg-pop">
          <Plus size={16} /> Add product
        </Link>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search products"
        aria-label="Search products"
        className="w-full max-w-sm rounded-sm border border-taupe bg-white px-4 py-3 text-base outline-none focus:border-obsidian sm:text-sm"
      />

      {error && <p className="rounded-sm bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {!products && !error && <div className="h-48 animate-pulse rounded-sm bg-black/10" />}

      {products && (
        <ul className="divide-y divide-stone rounded-sm border border-stone bg-white">
          {shown.length === 0 && <li className="p-6 text-sm text-charcoal">No products found.</li>}
          {shown.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-4 p-4">
              <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-sm bg-stone">
                <ProductImage src={p.images[0]} alt="" color={p.colors[0]?.hex} />
              </div>
              <div className="min-w-0 flex-1 basis-40">
                <p className="truncate font-medium">{p.title}</p>
                <p className="text-xs capitalize text-charcoal">{p.category}{!p.active && " • Hidden"}</p>
              </div>
              <div className="text-sm">
                {p.discountPrice != null ? (
                  <>{formatPrice(p.discountPrice)} <span className="text-charcoal line-through">{formatPrice(p.price)}</span></>
                ) : (
                  formatPrice(p.price)
                )}
              </div>
              <span className={`rounded-sm px-2.5 py-1 text-xs ${p.stock < 10 ? "bg-red-100 text-red-800" : "bg-stone"}`}>{p.stock} in stock</span>
              <div className="flex gap-2">
                <Link href={`/admin/products/${p.id}`} className="rounded-sm border border-taupe px-4 py-2 text-xs font-medium hover:border-obsidian">Edit</Link>
                <button onClick={() => remove(p)} className="rounded-sm border border-taupe px-4 py-2 text-xs font-medium text-red-700 hover:border-red-700">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
