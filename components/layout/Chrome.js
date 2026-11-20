"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import CartDrawer from "@/components/cart/CartDrawer";

export default function Chrome({ announcement, footer, children }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return <>{children}</>;
  return (
    <>
      {announcement}
      <Header />
      <main>{children}</main>
      {footer}
      <CartDrawer />
    </>
  );
}
