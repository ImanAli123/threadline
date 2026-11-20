import { Suspense } from "react";
import OrderSuccess from "@/components/checkout/OrderSuccess";

export const metadata = {
  title: "Order placed | Threadline",
};

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-xl px-4 py-28 text-center text-charcoal">Loading…</div>}>
      <OrderSuccess />
    </Suspense>
  );
}
