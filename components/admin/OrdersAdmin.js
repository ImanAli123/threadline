"use client";

import { useEffect, useState } from "react";
import { api, STATUS_STYLES, PAYMENT_LABELS, fmtDate } from "@/components/admin/api";
import { formatPrice } from "@/lib/utils";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
const select = "rounded-sm border border-taupe bg-white px-3 py-2 text-base outline-none focus:border-obsidian sm:text-sm";

export default function OrdersAdmin() {
  const [orders, setOrders] = useState(null);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    setOrders(null);
    api(`/api/admin/orders${filter === "all" ? "" : `?status=${filter}`}`)
      .then((d) => setOrders(d.orders))
      .catch((e) => setError(e.message));
  }, [filter]);

  const update = async (order, patch) => {
    const before = orders;
    setOrders((list) => list.map((o) => (o.id === order.id ? { ...o, ...patch } : o)));
    try {
      await api(`/api/admin/orders/${order.id}`, { method: "PATCH", body: JSON.stringify(patch) });
    } catch (e) {
      setOrders(before);
      setError(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-4xl">Orders</h1>

      <div className="flex flex-wrap gap-2">
        {["all", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-sm px-4 py-2 text-xs capitalize transition-colors ${filter === s ? "bg-obsidian text-alabaster" : "border border-taupe bg-white hover:border-obsidian"}`}
          >
            {s}
          </button>
        ))}
      </div>

      {error && <p className="rounded-sm bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {!orders && !error && <div className="h-48 animate-pulse rounded-sm bg-black/10" />}
      {orders?.length === 0 && <p className="text-sm text-charcoal">No orders found.</p>}

      <ul className="space-y-4">
        {orders?.map((o) => (
          <li key={o.id} className="rounded-sm border border-stone bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
              <div>
                <p className="font-medium">{o.orderNumber}</p>
                <p className="text-xs text-charcoal">{fmtDate(o.createdAt)}</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">{o.customer.name}</p>
                <p className="text-xs text-charcoal">{o.customer.phone}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatPrice(o.total)}</p>
                <p className="text-xs text-charcoal">{PAYMENT_LABELS[o.paymentMethod]}</p>
              </div>
              <span className={`rounded-sm px-2.5 py-1 text-xs capitalize ${STATUS_STYLES[o.status]}`}>{o.status}</span>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-stone px-4 py-3 sm:px-5">
              <label className="flex items-center gap-2 text-xs text-charcoal">
                Status
                <select value={o.status} onChange={(e) => update(o, { status: e.target.value })} className={`${select} capitalize`}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-2 text-xs text-charcoal">
                Payment
                <select value={o.paymentStatus} onChange={(e) => update(o, { paymentStatus: e.target.value })} className={select}>
                  <option value="unpaid">Unpaid</option>
                  <option value="paid">Paid</option>
                </select>
              </label>
            </div>

            <details className="border-t border-stone">
              <summary className="cursor-pointer px-4 py-3 text-sm underline-offset-4 hover:underline sm:px-5">Order details</summary>
              <div className="grid gap-6 px-4 pb-5 text-sm sm:px-5 md:grid-cols-2">
                <ul className="space-y-2">
                  {o.items.map((i, idx) => (
                    <li key={idx} className="flex justify-between gap-4">
                      <span>{i.title}<span className="block text-xs text-charcoal">{i.color}, size {i.size}, qty {i.qty}</span></span>
                      <span>{formatPrice(i.unitPrice * i.qty)}</span>
                    </li>
                  ))}
                  <li className="flex justify-between border-t border-stone pt-2 text-charcoal"><span>Delivery</span><span>{o.shippingFee === 0 ? "Free" : formatPrice(o.shippingFee)}</span></li>
                </ul>
                <div className="space-y-1">
                  <p className="font-medium">Deliver to</p>
                  <p>{o.shipping.address}</p>
                  <p>{o.shipping.city}, {o.shipping.province}</p>
                  <p className="text-charcoal">{o.customer.email}</p>
                  {o.shipping.notes && <p className="pt-2 text-charcoal">Note: {o.shipping.notes}</p>}
                </div>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
