import { FREE_SHIPPING_THRESHOLD, formatPrice } from "@/lib/utils";

export default function ShippingProgress({ subtotal }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const percent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div>
      <p className="mb-2 text-xs">
        {remaining > 0 ? (
          <>
            Add <strong>{formatPrice(remaining)}</strong> more for free shipping
          </>
        ) : (
          <strong>You've unlocked free shipping 🎉</strong>
        )}
      </p>
      <div className="h-1.5 overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}