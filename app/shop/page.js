import { Suspense } from "react";
import ShopClient from "@/components/shop/ShopClient";
import { getProducts } from "@/lib/products";

export const revalidate = 60;

export const metadata = {
  title: "Shop | Threadline",
  description: "Browse the full Threadline collection of men's, women's and accessories.",
};

function ShopSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-10 h-12 w-64 animate-pulse rounded bg-black/10" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:ml-[260px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse rounded-sm bg-black/10" />
        ))}
      </div>
    </div>
  );
}

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopClient products={products} />
    </Suspense>
  );
}
