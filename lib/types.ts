export const CURRENCIES = ["USD", "PHP"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const CONDITIONS = ["New", "Pre-owned", "Mint"] as const;
export type Condition = (typeof CONDITIONS)[number];

export const STATUSES = ["Available", "Reserved", "Sold"] as const;
export type Status = (typeof STATUSES)[number];

export interface Watch {
  id: number;
  title: string;
  brand: string;
  reference: string | null;
  price: number;
  currency: Currency;
  condition: Condition;
  status: Status;
  images: string[];
  created_at: string;
}

export function formatPrice(watch: Pick<Watch, "price" | "currency">): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: watch.currency,
    maximumFractionDigits: 0,
  }).format(watch.price);
}

/** Approximate USD value for price-range filters (PHP pegged at 56/USD). */
export function priceInUsd(watch: Pick<Watch, "price" | "currency">): number {
  return watch.currency === "PHP" ? watch.price / 56 : watch.price;
}
