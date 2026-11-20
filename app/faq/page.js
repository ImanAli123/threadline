import Link from "next/link";
import { Plus } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, formatPrice } from "@/lib/utils";

export const metadata = {
  title: "FAQ | Threadline",
  description: "Answers about orders, delivery, payment, returns and sizing.",
};

const groups = [
  {
    title: "Orders and delivery",
    items: [
      ["How long does delivery take?", "Orders usually arrive in 2 to 3 working days in major cities and 4 to 6 working days elsewhere in Pakistan."],
      ["How much is delivery?", `Delivery is free on orders over ${formatPrice(FREE_SHIPPING_THRESHOLD)}. Below that it is ${formatPrice(SHIPPING_FEE)}.`],
      ["Can I change or cancel my order?", "Yes, as long as it has not been shipped. Contact us with your order number as soon as possible."],
    ],
  },
  {
    title: "Payment",
    items: [
      ["Which payment methods do you accept?", "Cash on delivery, bank transfer, and JazzCash or Easypaisa."],
      ["Is cash on delivery available everywhere?", "Yes, for all delivery addresses in Pakistan."],
    ],
  },
  {
    title: "Returns and sizing",
    items: [
      ["What is your return policy?", "You can return unworn items with tags within 30 days for a full refund. See our Shipping & Returns page for details."],
      ["How do I choose my size?", "Most pieces fit true to size. Tees, hoodies and the coat have a relaxed or oversized fit, so size down if you prefer a closer fit."],
      ["How should I wash my clothes?", "Follow the care label on each piece. In general, wash cold and avoid tumble drying to keep fabrics looking their best."],
    ],
  },
];

export default function FaqPage() {
  return (
    <PageShell eyebrow="Help" title="Frequently asked questions" intro="Can't find your answer here? Get in touch and we will help.">
      {groups.map((g) => (
        <section key={g.title}>
          <h2 className="mb-2 font-serif text-3xl tracking-[-0.01em]">{g.title}</h2>
          <div className="divide-y divide-stone border-y border-stone">
            {g.items.map(([q, a]) => (
              <details key={q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium">
                  {q}
                  <Plus size={18} className="shrink-0 transition-transform group-open:rotate-45" aria-hidden="true" />
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-charcoal">{a}</p>
              </details>
            ))}
          </div>
        </section>
      ))}
      <p className="text-charcoal">
        Still need help? <Link href="/contact" className="font-medium text-obsidian underline underline-offset-4 hover:text-terracotta">Contact us</Link>.
      </p>
    </PageShell>
  );
}
