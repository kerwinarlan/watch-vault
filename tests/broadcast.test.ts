// Behavior check for the Deep-Link Engine (lib/broadcast.ts).
// Run with: npm test  (node --experimental-strip-types --test)
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildPromoText,
  inquireOnViberText,
  listingUrl,
  shareLinks,
  viberForwardLink,
} from "../lib/broadcast.ts";

const watch = {
  id: 7,
  title: "Submariner Date 126610LN",
  brand: "Rolex",
  reference: "126610LN",
  price: 12500,
  currency: "USD" as const,
  condition: "New" as const,
  status: "Available" as const,
};

test("buildPromoText includes name, formatted price, condition and listing link", () => {
  const text = buildPromoText(watch, "https://chronovault.example/");
  assert.match(text, /Submariner Date 126610LN/);
  assert.match(text, /\$12,500/);
  assert.match(text, /New \| Price/);
  assert.match(text, /https:\/\/chronovault\.example\/\?watch=7/);
  assert.ok(!text.includes("undefined"));
});

test("PHP prices keep the peso sign", () => {
  const ph = { ...watch, price: 390000, currency: "PHP" as const };
  assert.match(buildPromoText(ph, "https://x.example"), /₱390,000/);
});

test("listingUrl strips trailing slashes", () => {
  assert.equal(
    listingUrl(watch, "https://chronovault.example///"),
    "https://chronovault.example/?watch=7"
  );
});

test("viberForwardLink pre-fills encoded text", () => {
  assert.equal(
    viberForwardLink("Hi! Price $12,500 & more"),
    "viber://forward?text=Hi!%20Price%20%2412%2C500%20%26%20more"
  );
});

test("inquireOnViberText mentions the watch and price", () => {
  const text = inquireOnViberText(watch);
  assert.match(text, /Submariner/);
  assert.match(text, /\$12,500/);
});

test("shareLinks build facebook, x and whatsapp targets", () => {
  const links = shareLinks("promo", "https://x.example/?watch=7");
  assert.equal(
    links.facebook,
    "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fx.example%2F%3Fwatch%3D7&quote=promo"
  );
  assert.match(links.x, /twitter\.com\/intent\/tweet/);
  assert.match(links.whatsapp, /wa\.me\/\?text=/);
});
