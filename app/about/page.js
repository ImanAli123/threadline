import Link from "next/link";
import PageShell, { Section } from "@/components/layout/PageShell";

export const metadata = {
  title: "About | Threadline",
  description: "Threadline makes clean, lasting everyday clothing from natural fabrics.",
};

const values = [
  ["Fabric first", "We start with the cloth: heavyweight cotton, linen and wool that feel good and last for years."],
  ["Fewer, better pieces", "A small collection of staples that work together, instead of a new trend every week."],
  ["Honest details", "Double-stitched seams, real pockets and clear care instructions on every piece."],
];

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About Threadline"
      title="Clothing made to be worn for years, not seasons."
      intro="Threadline began with a simple idea: everyday clothes should be comfortable, well made and easy to wear together."
    >
      <Section title="Our story">
        <p>
          We design a small range of tees, shirts, trousers, knitwear and outerwear in natural fabrics. Every piece is cut
          to be simple and to get better with wear, so you can build a wardrobe you actually use.
        </p>
        <p className="text-sm">
          Threadline is a concept brand created as a portfolio project. The products, prices and orders on this site are demos.
        </p>
      </Section>

      <section>
        <h2 className="mb-6 font-serif text-3xl tracking-[-0.01em]">What we care about</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {values.map(([title, text]) => (
            <div key={title} className="rounded-sm border border-stone bg-white p-6">
              <h3 className="font-serif text-xl">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-sm bg-obsidian p-8 text-alabaster sm:p-12">
        <h2 className="font-serif text-3xl sm:text-4xl">Questions or ideas?</h2>
        <p className="mt-3 max-w-lg text-white/70">We would love to hear from you.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/contact" className="rounded-sm bg-alabaster px-7 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-obsidian transition-colors hover:bg-pop hover:text-alabaster">
            Contact us
          </Link>
          <Link href="/shop" className="rounded-sm border border-white/30 px-7 py-3.5 text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:bg-white/10">
            Shop the collection
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
