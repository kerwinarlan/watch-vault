// Demo dataset: mirrors supabase/seed.sql so the site renders without a
// Supabase project. Read-only; admin writes still require real env vars.
import type { Watch } from "./types.ts";

export const DEMO_WATCHES: Watch[] = [
  {
    id: 1,
    title: 'Heritage "Snowflake" SBGA211',
    brand: "Grand Seiko",
    reference: "SBGA211",
    price: 520000,
    currency: "PHP",
    condition: "Mint",
    status: "Available",
    images: ["https://picsum.photos/seed/gs1/900/700", "https://picsum.photos/seed/gs2/900/700"],
    created_at: "2026-08-01T00:00:00Z",
  },
  {
    id: 2,
    title: "Prospex MarineMaster SLA043",
    brand: "Seiko",
    reference: "SLA043",
    price: 165000,
    currency: "PHP",
    condition: "Pre-owned",
    status: "Available",
    images: ["https://picsum.photos/seed/seiko1/900/700"],
    created_at: "2026-08-02T00:00:00Z",
  },
  {
    id: 3,
    title: "Presage Sharp Edged SARX055",
    brand: "Seiko",
    reference: "SARX055",
    price: 42000,
    currency: "PHP",
    condition: "New",
    status: "Available",
    images: ["https://picsum.photos/seed/seiko2/900/700", "https://picsum.photos/seed/seiko3/900/700"],
    created_at: "2026-08-03T00:00:00Z",
  },
  {
    id: 4,
    title: "Black Bay 58 M79030N",
    brand: "Tudor",
    reference: "M79030N-0001",
    price: 245000,
    currency: "PHP",
    condition: "Pre-owned",
    status: "Available",
    images: ["https://picsum.photos/seed/tudor1/900/700"],
    created_at: "2026-08-04T00:00:00Z",
  },
  {
    id: 5,
    title: "Submariner Date 126610LN",
    brand: "Rolex",
    reference: "126610LN",
    price: 1450000,
    currency: "PHP",
    condition: "Pre-owned",
    status: "Reserved",
    images: ["https://picsum.photos/seed/rolex1/900/700", "https://picsum.photos/seed/rolex2/900/700"],
    created_at: "2026-08-05T00:00:00Z",
  },
  {
    id: 6,
    title: "Speedmaster Professional Moonwatch",
    brand: "Omega",
    reference: "310.30.42.50.01.001",
    price: 690000,
    currency: "PHP",
    condition: "Pre-owned",
    status: "Available",
    images: ["https://picsum.photos/seed/omega1/900/700"],
    created_at: "2026-08-06T00:00:00Z",
  },
  {
    id: 7,
    title: "Promaster Diver NB6021-17L",
    brand: "Citizen",
    reference: "NB6021-17L",
    price: 28000,
    currency: "PHP",
    condition: "New",
    status: "Available",
    images: ["https://picsum.photos/seed/citizen1/900/700"],
    created_at: "2026-08-07T00:00:00Z",
  },
  {
    id: 8,
    title: 'G-Shock "CasiOak" GA-2100',
    brand: "Casio",
    reference: "GA-2100-1A1",
    price: 4500,
    currency: "PHP",
    condition: "New",
    status: "Sold",
    images: ["https://picsum.photos/seed/casio1/900/700", "https://picsum.photos/seed/casio2/900/700"],
    created_at: "2026-08-08T00:00:00Z",
  },
];

export interface JournalPost {
  title: string;
  date: string;
  tag: string;
  excerpt: string;
  image: string;
}

/** Sample journal entries for the demo, mirroring the original site's Dispatches. */
export const JOURNAL_POSTS: JournalPost[] = [
  {
    title: "Why daylight photos matter when buying pre-owned",
    date: "Aug 08, 2025",
    tag: "Collector Notes",
    excerpt:
      "A watch that looks flawless under showroom light can tell a different story at 8am. We photograph everything in daylight, and it changes how you read a dial.",
    image: "https://picsum.photos/seed/journal1/900/600",
  },
  {
    title: "Tracking down a Snowflake in Manila",
    date: "Jul 27, 2025",
    tag: "Sourcing",
    excerpt:
      "The SBGA211 rarely surfaces locally. When one does, the window is measured in hours - here is how we move when a rare find lands on the desk.",
    image: "https://picsum.photos/seed/journal2/900/600",
  },
  {
    title: "What a collector's condition note actually says",
    date: "Jul 11, 2025",
    tag: "Craft",
    excerpt:
      "Between 'unworn' and 'excellent' there is a whole spectrum. Our written notes break down bezel, crystal, bracelet and movement honesty.",
    image: "https://picsum.photos/seed/journal3/900/600",
  },
];
