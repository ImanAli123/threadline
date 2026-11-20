import Link from "next/link";
import NewsletterForm from "@/components/layout/NewsletterForm";

const cols = [
  { title: "Shop", links: [["New Arrivals", "/shop?category=new"], ["Women", "/shop?category=women"], ["Men", "/shop?category=men"], ["Accessories", "/shop?category=accessories"]] },
  { title: "Studio", links: [["Lookbook", "/#lookbook"], ["About", "/about"], ["Contact", "/contact"], ["FAQ", "/faq"]] },
  { title: "Client care", links: [["Shipping & Returns", "/shipping-returns"], ["My account", "/account"], ["Wishlist", "/wishlist"], ["Cart", "/cart"]] },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-obsidian pb-10 pt-20 text-alabaster">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <div className="grid gap-12 border-b border-white/15 pb-16 md:grid-cols-2 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-terracotta">Early access</p>
            <h3 className="font-serif text-3xl leading-tight sm:text-4xl">Get first look at every drop, and 10% off your first order.</h3>
            <NewsletterForm />
          </div>
          {cols.map((c, i) => (
            <div key={c.title} className={`space-y-4 lg:col-span-2 ${i === 0 ? "lg:col-start-7" : ""}`}>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">{c.title}</h4>
              <ul className="space-y-2.5 text-sm text-white/80">
                {c.links.map(([label, href]) => (
                  <li key={label}><Link href={href} className="transition-colors hover:text-terracotta">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div aria-hidden="true" className="select-none overflow-hidden pb-4 pt-10 text-center font-serif text-[13.5vw] font-semibold uppercase leading-[0.85] tracking-[0.14em] text-white/[0.07]">
          Threadline
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-4 text-xs text-white/45 sm:flex-row">
          <p>© 2026 Threadline. Demo store, not a real business.</p>
          <p>Built as a portfolio project</p>
        </div>
      </div>
    </footer>
  );
}
