import Link from "next/link";
import ProductImage from "@/components/ui/ProductImage";
import WishlistButton from "@/components/shop/WishlistButton";
import QuickAdd from "@/components/shop/QuickAdd";
import { formatPrice } from "@/lib/utils";

export default function ProductCard({ product }) {
  const onSale = product.discountPrice != null;
  const badge = onSale ? "Sale" : product.isNew ? "New" : product.bestSeller ? "Bestseller" : null;
  const badgeStyle = onSale
    ? "bg-hot text-white"
    : product.isNew
      ? "bg-obsidian text-alabaster"
      : "bg-alabaster/90 text-obsidian";
  const href = `/product/${product.slug}`;

  return (
    <article className="product-card group flex flex-col">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-stone">
        <Link href={href} aria-label={product.title} className="absolute inset-0">
          <ProductImage src={product.images[0]} alt={product.title} color={product.colors[0].hex} className="product-img" />
          {product.images[1] && <ProductImage src={product.images[1]} alt="" className="product-img-alt" hideOnError />}
        </Link>
        {badge && (
          <span className={`pointer-events-none absolute left-3 top-3 z-10 rounded-sm px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] ${badgeStyle}`}>
            {badge}
          </span>
        )}
        <WishlistButton productId={product.id} className="absolute right-3 top-3 z-20" />
        <QuickAdd product={product} />
      </div>

      <div className="pt-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-xl leading-snug">
            <Link href={href} className="transition-colors hover:text-pop">{product.title}</Link>
          </h3>
          <span className="shrink-0 text-sm font-medium">
            {onSale ? (
              <>
                <span className="text-hot">{formatPrice(product.discountPrice)}</span>{" "}
                <span className="text-charcoal/60 line-through">{formatPrice(product.price)}</span>
              </>
            ) : (
              formatPrice(product.price)
            )}
          </span>
        </div>
        <p className="mt-1 text-xs text-charcoal">{product.details?.[0]}</p>
        <div className="mt-3 flex items-center gap-2">
          {product.colors.map((c) => (
            <span key={c.name} title={c.name} className="h-4 w-4 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
          ))}
        </div>
      </div>
    </article>
  );
}