"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const METHODS = {
  cod: "Cash on delivery. Please keep the amount ready when the parcel arrives.",
  bank: "Bank transfer. We will email you the account details shortly.",
  wallet: "JazzCash / Easypaisa. We will send a payment request to your mobile number.",
};

export default function OrderSuccess() {
  const number = useSearchParams().get("number");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("threadline-last-order");
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.number === number) setOrder(saved);
    } catch {}
  }, [number]);

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:py-28">
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-pop/15 text-terracotta">
        <Check size={28} />
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-terracotta">Order placed</p>
      <h1 className="mt-2 font-serif text-4xl sm:text-5xl">
        {order?.name ? `Thank you, ${order.name.split(" ")[0]}` : "Thank you for your order"}
      </h1>
      {number && (
        <p className="mt-4 text-charcoal">
          Your order number is <strong className="text-obsidian">{number}</strong>. We will call or message you to confirm delivery.
        </p>
      )}

      {order && (
        <div className="mt-8 rounded-sm border border-stone bg-white p-6 text-left">
          <ul className="divide-y divide-stone text-sm">
            {order.items.map((i, idx) => (
              <li key={idx} className="flex justify-between gap-4 py-3">
                <span>
                  {i.title}
                  <span className="block text-xs text-charcoal">{i.color}, size {i.size}, qty {i.qty}</span>
                </span>
                <span className="font-medium">{formatPrice(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex justify-between border-t border-stone pt-4 font-semibold">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
          <p className="mt-4 text-xs text-charcoal">{METHODS[order.paymentMethod]}</p>
        </div>
      )}

      <p className="mt-6 text-xs text-charcoal">This is a demo store, so no goods will be shipped.</p>
      <Link href="/shop" className="mt-8 inline-block rounded-sm bg-obsidian px-8 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-alabaster transition-colors hover:bg-pop">
        Continue shopping
      </Link>
    </div>
  );
}
