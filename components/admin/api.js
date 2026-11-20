export async function api(url, options = {}) {
  const res = await fetch(url, {
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

export const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-pink-100 text-pink-800",
  shipped: "bg-violet-100 text-violet-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export const PAYMENT_LABELS = {
  cod: "Cash on delivery",
  bank: "Bank transfer",
  wallet: "JazzCash / Easypaisa",
};

export const fmtDate = (d) =>
  new Date(d).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Karachi" });
