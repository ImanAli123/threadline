import { revalidatePath } from "next/cache";

// Call after the admin changes products so the storefront updates straight away.
export function refreshStore() {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/wishlist");
  revalidatePath("/product/[slug]", "page");
}
