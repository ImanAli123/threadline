import Link from "next/link";
import PageShell, { Section } from "@/components/layout/PageShell";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, formatPrice } from "@/lib/utils";

export const metadata = {
  title: "Shipping & Returns | Threadline",
  description: "Delivery times, delivery fees and our 30-day return policy.",
};

export default function ShippingReturnsPage() {
  return (
    <PageShell
      eyebrow="Help"
      title="Shipping and returns"
      intro="Simple delivery across Pakistan and an easy 30-day return policy."
    >
      <Section title="Delivery">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-obsidian text-xs uppercase tracking-[0.15em] text-obsidian">
                <th className="py-3 pr-4 font-medium">Order value</th>
                <th className="py-3 pr-4 font-medium">Delivery fee</th>
                <th className="py-3 font-medium">Delivery time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone">
              <tr>
                <td className="py-3 pr-4">Under {formatPrice(FREE_SHIPPING_THRESHOLD)}</td>
                <td className="py-3 pr-4">{formatPrice(SHIPPING_FEE)}</td>
                <td className="py-3">2 to 6 working days</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">{formatPrice(FREE_SHIPPING_THRESHOLD)} and above</td>
                <td className="py-3 pr-4">Free</td>
                <td className="py-3">2 to 6 working days</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>Major cities usually take 2 to 3 working days. Other areas take 4 to 6 working days. We confirm every order by phone or message before dispatch.</p>
      </Section>

      <Section title="Returns">
        <ul className="list-disc space-y-2 pl-5">
          <li>Return unworn, unwashed items with tags within 30 days of delivery.</li>
          <li>Refunds go back to your original payment method, or as a bank or wallet transfer for cash on delivery orders.</li>
          <li>Sale items can be returned for store credit.</li>
          <li>Items that arrive damaged or incorrect are replaced or refunded at no cost to you.</li>
        </ul>
      </Section>

      <Section title="How to start a return">
        <ol className="list-decimal space-y-2 pl-5">
          <li>Contact us with your order number and the item you want to return.</li>
          <li>We will confirm and share the return address.</li>
          <li>Send the item back. We refund you within 5 to 7 working days of receiving it.</li>
        </ol>
        <p>
          <Link href="/contact" className="font-medium text-obsidian underline underline-offset-4 hover:text-terracotta">Contact us to start a return</Link>
        </p>
      </Section>
    </PageShell>
  );
}
