import WishlistView from "@/components/shop/WishlistView";
import { getProducts } from "@/lib/products";

export const revalidate = 60;

export const metadata = {
  title: "Wishlist | Threadline",
};

export default async function WishlistPage() {
  const products = await getProducts();
  return <WishlistView products={products} />;
}
