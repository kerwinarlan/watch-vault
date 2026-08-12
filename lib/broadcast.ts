// Deep-Link Engine: formats a high-converting promo post and builds
// web-native deep links (Viber forward, Facebook, X, WhatsApp) so the
// €100/mo Viber bot fee is never needed.
import type { Watch } from "./types.ts";
import { formatPrice } from "./types.ts";

export interface Listing {
  id?: number;
  title: string;
  brand: string;
  reference: string | null;
  price: number;
  currency: Watch["currency"];
  condition: Watch["condition"];
  status: Watch["status"];
}

export function listingUrl(watch: Listing, siteUrl: string): string {
  return `${siteUrl.replace(/\/+$/, "")}/?watch=${watch.id ?? ""}`;
}

export function buildPromoText(watch: Listing, siteUrl: string): string {
  const url = watch.id && siteUrl ? listingUrl(watch, siteUrl) : null;
  const lines: (string | null)[] = [
    `⌚ NEW ARRIVAL — ${watch.title}`,
    watch.reference ? `Ref ${watch.reference}` : null,
    "",
    `Condition: ${watch.condition} | Price: ${formatPrice(watch)}`,
    `Status: ${watch.status}`,
    "",
    "A grail piece, freshly listed. Serious inquiries only.",
    url ? `View listing: ${url}` : null,
  ];
  return lines.filter((line) => line !== null).join("\n");
}

export function inquireOnViberText(watch: Listing): string {
  return `Hi The Watch Alley! I'm interested in the ${watch.title} (${formatPrice(watch)}). Is it still available?`;
}

export function inquireWhatsAppLink(watch: Listing, phone: string): string {
  return `https://api.whatsapp.com/send?phone=${phone.replace(/[^0-9]/g, "")}&text=${encodeURIComponent(
    inquireOnViberText(watch)
  )}`;
}

export function inquireMessengerLink(watch: Listing, handle: string): string {
  return `https://m.me/${handle.replace(/^@/, "")}?text=${encodeURIComponent(
    inquireOnViberText(watch)
  )}`;
}

export function viberForwardLink(text: string): string {
  return `viber://forward?text=${encodeURIComponent(text)}`;
}

export interface ShareLinks {
  facebook: string;
  x: string;
  whatsapp: string;
}

export function shareLinks(text: string, url: string | null): ShareLinks {
  const quote = encodeURIComponent(text);
  const u = url ? `&u=${encodeURIComponent(url)}` : "";
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url ?? "")}&quote=${quote}`,
    x: `https://twitter.com/intent/tweet?text=${quote}${u}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(url ? `${text} ${url}` : text)}`,
  };
}
