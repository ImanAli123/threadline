"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, STATUS_STYLES, fmtDate } from "@/components/admin/api";
import { formatPrice } from "@/lib/utils";

function Stat({ label, value }) {
  return (
    <div className="rounded-sm border border-stone bg-white p-5">
      <p className="text-xs uppercase tracking-[0.15em] text-charcoal">{label}</p>
      <p className="mt-2 font-serif text-3xl">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/admin/stats").then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="rounded-sm bg-red-50 p-4 text-sm text-red-700">{error}</p>;
  if (!data) return <div className="h-64 animate-pulse rounded-sm bg-black/10" />;

  const keys = Array.from({ length: 7 }, (_, i) =>
    new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString("en-CA", { timeZone: "Asia/Karachi" })
  );
  const byDay = Object.fromEntries(data.daily.map((d) => [d.date, d]));
  const series = keys.map((k) => ({
    label: new Date(`${k}T12:00:00`).toLocaleDateString("en-GB", { weekday: "short" }),
    total: byDay[k]?.total ?? 0,
  }));
  const max = Math.max(1, ...series.map((s) => s.total));

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-4xl">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Stat label="Revenue" value={formatPrice(data.revenue)} />
        <Stat label="Orders" value={data.orderCount} />
        <Stat label="Products" value={data.productCount} />
        <Stat label="Customers" value={data.customerCount} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-sm border border-stone bg-white p-5 xl:col-span-2">
          <h2 className="mb-5 font-serif text-2xl">Sales, last 7 days</h2>
          <div className="flex h-44 items-end gap-2 sm:gap-4">
            {series.map((s, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div className="w-full rounded-t-sm bg-obsidian" style={{ height: `${Math.max(2, (s.total / max) * 100)}%` }} title={formatPrice(s.total)} />
                <span className="text-[11px] text-charcoal">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-sm border border-stone bg-white p-5">
          <h2 className="mb-4 font-serif text-2xl">Orders by status</h2>
          <ul className="space-y-2 text-sm">
            {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
              <li key={s} className="flex items-center justify-between">
                <span className={`rounded-sm px-2.5 py-1 text-xs capitalize ${STATUS_STYLES[s]}`}>{s}</span>
                <span className="font-medium">{data.byStatus[s] ?? 0}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-sm border border-stone bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm underline underline-offset-4">View all</Link>
          </div>
          {data.recent.length === 0 ? (
            <p className="text-sm text-charcoal">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-stone text-sm">
              {data.recent.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 py-3">
                  <span>
                    <span className="font-medium">{o.orderNumber}</span>
                    <span className="block text-xs text-charcoal">{o.name}, {fmtDate(o.createdAt)}</span>
                  </span>
                  <span className="text-right">
                    <span className="block font-medium">{formatPrice(o.total)}</span>
                    <span className={`rounded-sm px-2 py-0.5 text-[11px] capitalize ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-sm border border-stone bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl">Low stock</h2>
            <Link href="/admin/products" className="text-sm underline underline-offset-4">Products</Link>
          </div>
          {data.lowStock.length === 0 ? (
            <p className="text-sm text-charcoal">All products are well stocked.</p>
          ) : (
            <ul className="divide-y divide-stone text-sm">
              {data.lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-3">
                  <Link href={`/admin/products/${p.id}`} className="hover:text-terracotta">{p.title}</Link>
                  <span className="rounded-sm bg-red-100 px-2.5 py-1 text-xs text-red-800">{p.stock} left</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
