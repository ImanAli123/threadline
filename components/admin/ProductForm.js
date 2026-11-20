"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/components/admin/api";

const input =
  "w-full rounded-sm border border-taupe bg-white px-4 py-3 text-base outline-none transition focus:border-obsidian sm:text-sm";

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const lines = (s) => s.split("\n").map((l) => l.trim()).filter(Boolean);

const empty = {
  title: "", slug: "", category: "men", price: "", discountPrice: "", stock: "50",
  sizes: "S, M, L, XL", colors: "Black #1f1f1f", description: "", details: "", images: "",
  isNewArrival: false, bestSeller: false, active: true,
};

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-charcoal">{hint}</span>}
    </label>
  );
}

export default function ProductForm({ id }) {
  const router = useRouter();
  const [f, setF] = useState(empty);
  const [slugTouched, setSlugTouched] = useState(Boolean(id));
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    api(`/api/admin/products/${id}`)
      .then(({ product: p }) =>
        setF({
          title: p.title, slug: p.slug, category: p.category, price: String(p.price),
          discountPrice: p.discountPrice == null ? "" : String(p.discountPrice), stock: String(p.stock),
          sizes: p.sizes.join(", "), colors: p.colors.map((c) => `${c.name} ${c.hex}`).join("\n"),
          description: p.description, details: p.details.join("\n"), images: p.images.join("\n"),
          isNewArrival: Boolean(p.isNewArrival), bestSeller: Boolean(p.bestSeller), active: p.active !== false,
        })
      )
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setF((s) => {
      const next = { ...s, [k]: v };
      if (k === "title" && !slugTouched) next.slug = slugify(v);
      return next;
    });
    if (k === "slug") setSlugTouched(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const colors = [];
    for (const l of lines(f.colors)) {
      const m = l.match(/^(.*?)\s*(#[0-9a-fA-F]{6})$/);
      if (!m) return setError(`Colour "${l}" needs a hex code, for example: Black #1f1f1f`);
      colors.push({ name: m[1].trim() || m[2], hex: m[2] });
    }

    const payload = {
      title: f.title, slug: f.slug || slugify(f.title), category: f.category,
      price: f.price === "" ? null : Number(f.price),
      discountPrice: f.discountPrice === "" ? null : Number(f.discountPrice),
      stock: f.stock === "" ? null : Number(f.stock),
      sizes: f.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors, description: f.description, details: lines(f.details), images: lines(f.images),
      isNewArrival: f.isNewArrival, bestSeller: f.bestSeller, active: f.active,
    };

    setSaving(true);
    try {
      await api(id ? `/api/admin/products/${id}` : "/api/admin/products", {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      router.push("/admin/products");
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) return <div className="h-64 animate-pulse rounded-sm bg-black/10" />;

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-serif text-4xl">{id ? "Edit product" : "Add product"}</h1>
        <Link href="/admin/products" className="text-sm underline underline-offset-4">Back to products</Link>
      </div>

      <div className="grid gap-4 rounded-sm border border-stone bg-white p-5 sm:grid-cols-2 sm:p-6">
        <div className="sm:col-span-2">
          <Field label="Title"><input required value={f.title} onChange={set("title")} className={input} /></Field>
        </div>
        <Field label="Slug (web address)" hint="Lowercase letters, numbers and dashes">
          <input required value={f.slug} onChange={set("slug")} className={input} />
        </Field>
        <Field label="Category">
          <select value={f.category} onChange={set("category")} className={input}>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="accessories">Accessories</option>
          </select>
        </Field>
        <Field label="Price (Rs)"><input required type="number" min="1" inputMode="numeric" value={f.price} onChange={set("price")} className={input} /></Field>
        <Field label="Sale price (Rs, optional)"><input type="number" min="1" inputMode="numeric" value={f.discountPrice} onChange={set("discountPrice")} className={input} /></Field>
        <Field label="Stock"><input required type="number" min="0" inputMode="numeric" value={f.stock} onChange={set("stock")} className={input} /></Field>
        <Field label="Sizes" hint="Separate with commas, for example S, M, L">
          <input required value={f.sizes} onChange={set("sizes")} className={input} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Colours" hint="One per line: name, then hex code. Example: Black #1f1f1f">
            <textarea required rows={3} value={f.colors} onChange={set("colors")} className={input} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Description"><textarea rows={3} value={f.description} onChange={set("description")} className={input} /></Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Details" hint="One per line, for example: 100% organic cotton">
            <textarea rows={3} value={f.details} onChange={set("details")} className={input} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Image paths" hint="One per line, for example /images/products/my-tee.jpg (save the photo in public/images/products first). The first is the main photo.">
            <textarea rows={2} value={f.images} onChange={set("images")} className={input} />
          </Field>
        </div>
        <div className="flex flex-wrap gap-6 sm:col-span-2">
          {[["isNewArrival", "New arrival"], ["bestSeller", "Bestseller"], ["active", "Visible in store"]].map(([k, label]) => (
            <label key={k} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={f[k]} onChange={set(k)} className="h-4 w-4 accent-[#141414]" /> {label}
            </label>
          ))}
        </div>
      </div>

      {error && <p role="alert" className="rounded-sm bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <button type="submit" disabled={saving} className="rounded-sm bg-obsidian px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-alabaster transition-colors hover:bg-pop disabled:opacity-60">
        {saving ? "Saving…" : id ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}
