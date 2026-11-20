import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import RemoteImage from "@/components/ui/RemoteImage";
import CategoryTile from "@/components/home/CategoryTile";
import FabricTabs from "@/components/home/FabricTabs";
import Lookbook from "@/components/home/Lookbook";
import { getProducts } from "@/lib/products";
import { formatPrice, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";

export const revalidate = 60;

// Category tiles: photos live in public/images/categories/
const tiles = [
  { name: "Women", href: "/shop?category=women", image: "/images/categories/women.jpg", kind: "dress", bg: "bg-pop", garment: "#f9f8f6", stitch: "#dc1f7a" },
  { name: "Men", href: "/shop?category=men", image: "/images/categories/men.jpg", kind: "hoodie", bg: "bg-obsidian", garment: "#f9f8f6", stitch: "#dc1f7a" },
  { name: "Accessories", href: "/shop?category=accessories", image: "/images/categories/accessories.jpg", kind: "tote", bg: "bg-charcoal", garment: "#f9f8f6", stitch: "#dc1f7a" },
];

export default async function Home() {
  const products = await getProducts();
  const bySlug = (slug) => products.find((p) => p.slug === slug);
  const feature = bySlug("oversized-wool-coat") ?? products.find((p) => p.isNew) ?? products[0];
  const look = ["oversized-wool-coat", "ribbed-knit-top", "pleated-trousers"].map(bySlug).filter(Boolean);
  const staples = products.slice(0, 8);

  const perks = [
    `Free delivery over ${formatPrice(FREE_SHIPPING_THRESHOLD)}`,
    "30-day returns",
    "Cash on delivery",
    "Heavyweight natural fabrics",
  ];

  return (
    <>
      <section className="border-b border-stone">
        <div className="mx-auto grid min-h-[82vh] max-w-[1440px] grid-cols-1 lg:grid-cols-12">
          <div className="order-2 flex flex-col justify-between bg-alabaster p-6 sm:p-12 lg:order-1 lg:col-span-5 lg:p-16">
            <p className="hidden items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-charcoal lg:flex">
              <span className="h-2 w-2 rounded-full bg-pop" />
              Autumn–Winter ’26
            </p>
            <div className="my-auto py-8 lg:py-0">
              <h1 className="font-serif text-5xl font-normal leading-[1.03] tracking-[-0.02em] sm:text-6xl xl:text-[74px]">
                Crafted in silence. <br />
                <span className="italic text-pop">Worn in motion.</span>
              </h1>
              <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-charcoal sm:text-base">
                Clean silhouettes in heavyweight cotton, linen and wool. Made to be worn for years, not seasons.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/shop" className="rounded-sm bg-pop px-7 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-obsidian">
                  Explore collection
                </Link>
                <Link href="/#lookbook" className="rounded-sm border border-obsidian/25 px-7 py-3.5 text-xs font-medium uppercase tracking-[0.18em] transition-all duration-300 hover:border-obsidian hover:bg-stone/50">
                  View lookbook
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-stone pt-6 text-xs text-charcoal">
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-charcoal/70">Featured piece</span>
                <span className="font-medium text-obsidian">{feature.title}, {formatPrice(feature.price)}</span>
              </div>
              <Link href={`/product/${feature.slug}`} className="font-medium underline underline-offset-4 hover:text-pop">Shop the coat</Link>
            </div>
          </div>

          <div className="relative order-1 min-h-[54vh] overflow-hidden bg-stone sm:min-h-[65vh] lg:order-2 lg:col-span-7 lg:min-h-full">
            <RemoteImage
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=85"
              alt="Model wearing a long coat from the Threadline autumn collection"
              priority
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/35 via-transparent to-transparent" />

            <div className="absolute left-5 top-5 z-10 flex h-28 w-28 -rotate-12 flex-col items-center justify-center rounded-full bg-pop text-center text-white shadow-lg sm:left-8 sm:top-8 sm:h-32 sm:w-32">
              <span className="text-[10px] font-medium uppercase tracking-[0.16em]">Free delivery</span>
              <span className="font-serif text-lg leading-tight sm:text-xl">over {formatPrice(FREE_SHIPPING_THRESHOLD)}</span>
            </div>

            <Link
              href={`/product/${feature.slug}`}
              className="absolute bottom-6 left-6 right-6 max-w-xs rounded-sm border border-white/40 bg-alabaster/90 p-4 shadow-lg backdrop-blur-md sm:left-auto sm:right-8 sm:bottom-8 sm:p-5"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-pop">Look 01</p>
              <p className="mt-0.5 font-serif text-lg">{feature.title}</p>
              <p className="mt-1 text-xs text-charcoal">{feature.details?.[0]}</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-pop-soft">
        <ul className="mx-auto grid max-w-[1440px] grid-cols-2 gap-x-4 gap-y-2 px-4 py-4 text-center text-xs font-medium text-obsidian sm:px-8 md:grid-cols-4">
          {perks.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pt-20 sm:px-8 sm:pt-28">
        <h2 className="mb-10 font-serif text-4xl tracking-[-0.02em] sm:text-5xl">Shop by category</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {tiles.map((t) => (
            <CategoryTile key={t.name} {...t} />
          ))}
        </div>
      </section>

      <section id="collection" className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 sm:py-28">
        <div className="flex flex-col justify-between gap-6 border-b border-stone pb-10 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.22em] text-pop">Autumn–Winter ’26</p>
            <h2 className="font-serif text-4xl tracking-[-0.02em] sm:text-5xl">Curated Staples</h2>
          </div>
          <Link href="/shop" className="text-sm font-medium underline underline-offset-4 hover:text-pop">Shop all products</Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4 lg:gap-x-6">
          {staples.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="bg-pop text-alabaster">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-8 px-4 py-16 sm:px-8 sm:py-24 md:flex-row md:items-end">
          <h2 className="max-w-3xl font-serif text-5xl leading-[1.02] tracking-[-0.02em] sm:text-7xl">
            Made once. <span className="italic">Worn for years.</span>
          </h2>
          <Link href="/shop" className="shrink-0 rounded-sm bg-alabaster px-8 py-4 text-xs font-medium uppercase tracking-[0.18em] text-obsidian transition-colors hover:bg-obsidian hover:text-alabaster">
            Shop the collection
          </Link>
        </div>
      </section>

      <FabricTabs />
      {look.length >= 2 && <Lookbook items={look} />}
    </>
  );
}