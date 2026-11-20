"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import ProductImage from "@/components/ui/ProductImage";
import { useStore } from "@/components/providers/StoreProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { formatPrice } from "@/lib/utils";

const PROVINCES = [
  "Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan",
  "Islamabad Capital Territory", "Gilgit-Baltistan", "Azad Jammu & Kashmir",
];

const PAYMENTS = [
  { value: "cod", title: "Cash on delivery", text: "Pay in cash when your order arrives." },
  { value: "bank", title: "Bank transfer", text: "We email the account details after you place the order." },
  { value: "wallet", title: "JazzCash / Easypaisa", text: "We send a payment request to your mobile number." },
];

const input =
  "w-full rounded-sm border border-taupe bg-white px-4 py-3 text-base outline-none sm:text-sm transition focus:border-obsidian";

function Field({ label, id, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

export default function CheckoutView() {
  const router = useRouter();
  const { hydrated, items, subtotal, shipping, total, clearCart } = useStore();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", province: "", notes: "",
  });
  const [payment, setPayment] = useState("cod");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // Pre-fill name and email for logged-in customers
  useEffect(() => {
    if (!user) return;
    setForm((f) => ({ ...f, name: f.name || user.name, email: f.email || user.email }));
  }, [user]);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 h-10 w-56 animate-pulse rounded bg-black/10" />
        <div className="h-72 animate-pulse rounded-sm bg-black/10" />
      </div>
    );
  }

  if (items.length === 0 && !done) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
        <ShoppingBag size={52} className="mb-4 text-black/20" />
        <h1 className="font-serif text-4xl">Your bag is empty</h1>
        <p className="mt-3 text-charcoal">Add something to your bag before checking out.</p>
        <Link href="/shop" className="mt-8 rounded-sm bg-obsidian px-8 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-alabaster transition-colors hover:bg-pop">
          Continue shopping
        </Link>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: form.name, email: form.email, phone: form.phone },
          shipping: { address: form.address, city: form.city, province: form.province, notes: form.notes },
          paymentMethod: payment,
          items: items.map((i) => ({ slug: i.slug, color: i.color, size: i.size, qty: i.qty })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not place your order. Please try again.");

      try {
        sessionStorage.setItem(
          "threadline-last-order",
          JSON.stringify({
            number: data.order.orderNumber,
            total: data.order.total,
            paymentMethod: payment,
            name: form.name,
            items: items.map((i) => ({ title: i.title, color: i.color, size: i.size, qty: i.qty, price: i.price })),
          })
        );
      } catch {}

      setDone(true);
      clearCart();
      router.push(`/order-success?number=${encodeURIComponent(data.order.orderNumber)}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.22em] text-terracotta">Secure checkout</p>
      <h1 className="mb-10 font-serif text-4xl tracking-[-0.02em] sm:text-5xl">Checkout</h1>

      <form onSubmit={submit} className="grid gap-12 lg:grid-cols-[1fr_400px]">
        <div className="space-y-10">
          <section>
            <h2 className="mb-5 font-serif text-2xl">Contact</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" id="name">
                <input id="name" required autoComplete="name" value={form.name} onChange={set("name")} className={input} placeholder="Your full name" />
              </Field>
              <Field label="Mobile number" id="phone">
                <input id="phone" required type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} className={input} placeholder="0300 1234567" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Email" id="email">
                  <input id="email" required type="email" autoComplete="email" value={form.email} onChange={set("email")} className={input} placeholder="you@example.com" />
                </Field>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-5 font-serif text-2xl">Delivery address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Address" id="address">
                  <input id="address" required autoComplete="street-address" value={form.address} onChange={set("address")} className={input} placeholder="House, street, area" />
                </Field>
              </div>
              <Field label="City" id="city">
                <input id="city" required autoComplete="address-level2" value={form.city} onChange={set("city")} className={input} placeholder="e.g. Rawalpindi" />
              </Field>
              <Field label="Province" id="province">
                <select id="province" required value={form.province} onChange={set("province")} className={input}>
                  <option value="">Choose province</option>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Order notes (optional)" id="notes">
                  <textarea id="notes" rows={3} value={form.notes} onChange={set("notes")} className={input} placeholder="Landmark, delivery timing, or anything we should know" />
                </Field>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-5 font-serif text-2xl">Payment</h2>
            <div className="space-y-3">
              {PAYMENTS.map((p) => (
                <label
                  key={p.value}
                  className={`flex cursor-pointer items-start gap-4 rounded-sm border p-4 transition ${payment === p.value ? "border-obsidian bg-white" : "border-taupe bg-white/50 hover:border-obsidian"}`}
                >
                  <input type="radio" name="payment" value={p.value} checked={payment === p.value} onChange={() => setPayment(p.value)} className="mt-1 accent-[#141414]" />
                  <span>
                    <span className="block text-sm font-semibold">{p.title}</span>
                    <span className="block text-sm text-charcoal">{p.text}</span>
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-charcoal">This is a demo store. No real payment is taken.</p>
          </section>
        </div>

        <aside className="h-fit rounded-sm border border-stone bg-white p-6 lg:sticky lg:top-28">
          <h2 className="mb-5 font-serif text-2xl">Order summary</h2>
          <ul className="divide-y divide-stone">
            {items.map((i) => (
              <li key={i.key} className="flex gap-4 py-4">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-sm bg-stone">
                  <ProductImage src={i.image} alt="" color={i.colorHex} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-lg leading-tight">{i.title}</p>
                  <p className="mt-0.5 text-xs text-charcoal">{i.color}, size {i.size}, qty {i.qty}</p>
                </div>
                <span className="text-sm font-medium">{formatPrice(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-3 border-t border-stone pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-charcoal">Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-charcoal">Delivery</dt>
              <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-stone pt-4 text-base font-semibold">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>

          {error && (
            <p role="alert" className="mt-5 rounded-sm bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-sm bg-obsidian py-4 text-xs font-medium uppercase tracking-[0.2em] text-alabaster transition-colors hover:bg-pop disabled:opacity-60"
          >
            {submitting ? "Placing order…" : `Place order, ${formatPrice(total)}`}
          </button>
          <p className="mt-3 text-center text-xs text-charcoal">
            <Link href="/cart" className="underline underline-offset-4 hover:text-terracotta">Back to bag</Link>
          </p>
        </aside>
      </form>
    </div>
  );
}
