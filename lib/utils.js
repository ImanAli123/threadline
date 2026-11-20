// All prices in the store are in Pakistani rupees (PKR).
export function formatPrice(value) {
  return `Rs ${Math.round(value).toLocaleString("en-US")}`;
}

export const FREE_SHIPPING_THRESHOLD = 7000; // free delivery over Rs 7,000
export const SHIPPING_FEE = 250; // otherwise Rs 250
