import { cache } from "react";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { serializeProduct } from "@/lib/serialize";
import { products as sampleProducts } from "@/data/products";

const sample = () => sampleProducts.map((p) => ({ ...p, id: String(p.id), stock: 100 }));

// Reads the catalogue from MongoDB (once per request).
// If the database is empty or unreachable, the built-in sample products are used so the site never goes blank.
export const getProducts = cache(async () => {
  try {
    await connectDB();
    const docs = await Product.find({ active: true }).sort({ createdAt: 1 }).lean();
    if (docs.length === 0) {
      console.warn("No products in MongoDB yet. Open /api/seed to load them. Showing sample data.");
      return sample();
    }
    return docs.map(serializeProduct);
  } catch (err) {
    console.error("Could not load products from MongoDB, showing sample data:", err.message);
    return sample();
  }
});

export async function getProductBySlug(slug) {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export function getRelatedProducts(product, all, limit = 4) {
  const same = all.filter((p) => p.category === product.category && p.id !== product.id);
  const others = all.filter((p) => p.category !== product.category && p.id !== product.id);
  return [...same, ...others].slice(0, limit);
}
