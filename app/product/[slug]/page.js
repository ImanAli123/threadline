import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/product/ProductDetail";
import ProductCard from "@/components/shop/ProductCard";
import { categories } from "@/data/products";
import { getProducts, getProductBySlug, getRelatedProducts } from "@/lib/products";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found | Threadline" };
  return {
    title: `${product.title} | Threadline`,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const all = await getProducts();
  const related = getRelatedProducts(product, all, 4);
  const categoryLabel = categories.find((c) => c.slug === product.category)?.label;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:pb-0">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-black/60">
        <Link href="/" className="hover:text-accent">Home</Link> /{" "}
        <Link href="/shop" className="hover:text-accent">Shop</Link> /{" "}
        <Link href={`/shop?category=${product.category}`} className="hover:text-accent">
          {categoryLabel}
        </Link>{" "}
        / <span className="text-brand">{product.title}</span>
      </nav>

      <ProductDetail product={product} />

      <section className="mt-24">
        <h2 className="mb-8 text-center font-display text-3xl">You may also like</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
