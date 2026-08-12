"use client";

/* eslint-disable @next/next/no-img-element -- Admin-entered external image URLs: next/image requires per-host remotePatterns config and hard-fails on unknown hosts, while <img> with onError degrades gracefully. */

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CURRENCIES, CONDITIONS, STATUSES, formatPrice, type Watch } from "@/lib/types";
import {
  buildPromoText,
  listingUrl,
  shareLinks,
  viberForwardLink,
} from "@/lib/broadcast";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";
const inputCls =
  "w-full rounded-xl border border-walnut-light bg-walnut-deep/60 px-3.5 py-2.5 text-sm text-cream outline-none transition-colors placeholder:text-cream-60/60 focus:border-amber-300";

interface FormState {
  id: number | null;
  title: string;
  brand: string;
  reference: string;
  price: string;
  currency: Watch["currency"];
  condition: Watch["condition"];
  status: Watch["status"];
  images: string;
}

const EMPTY_FORM: FormState = {
  id: null,
  title: "",
  brand: "",
  reference: "",
  price: "",
  currency: "USD",
  condition: "New",
  status: "Available",
  images: "",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-widest text-faint">{label}</span>
      {children}
    </label>
  );
}

export default function Admin() {
  const [watches, setWatches] = useState<Watch[] | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [notice, setNotice] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [target, setTarget] = useState<Watch | null>(null);
  const [copied, setCopied] = useState(false);

  const load = () => {
    if (!supabase) return;
    supabase
      .from("watches")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setNotice({ kind: "err", text: error.message });
        else setWatches((data as Watch[]) ?? []);
      });
  };

  useEffect(load, []);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function save() {
    const price = Number(form.price);
    if (
      !form.title.trim() ||
      !form.brand.trim() ||
      form.price.trim() === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      setNotice({ kind: "err", text: "Title, brand and a valid price are required." });
      return;
    }
    const body = {
      id: form.id,
      title: form.title.trim(),
      brand: form.brand.trim(),
      reference: form.reference.trim() || null,
      price,
      currency: form.currency,
      condition: form.condition,
      status: form.status,
      images: form.images
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    try {
      const res = await fetch("/api/admin/watches", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setNotice({ kind: "ok", text: form.id ? "Watch updated." : "Watch added to the collection." });
      setTarget(data as Watch);
      setForm({ ...EMPTY_FORM });
      load();
    } catch (err) {
      setNotice({
        kind: "err",
        text: err instanceof Error ? err.message : "Save failed.",
      });
    }
  }

  async function copyPromo() {
    if (!target) return;
    try {
      await navigator.clipboard.writeText(buildPromoText(target, SITE_URL));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setNotice({ kind: "err", text: "Copy failed - clipboard is unavailable on this connection." });
    }
  }

  const promo = target ? buildPromoText(target, SITE_URL) : null;
  const links = target
    ? shareLinks(promo ?? "", SITE_URL ? listingUrl(target, SITE_URL) : null)
    : null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Command Deck</p>
      <h1 className="mt-3 font-display text-4xl">Admin &amp; Broadcast Suite</h1>

      {notice && (
        <p
          className={`mt-6 rounded-xl border px-4 py-3 text-sm ${
            notice.kind === "ok"
              ? "border-emerald-400/40 text-emerald-300"
              : "border-amber-400/40 text-amber-300"
          }`}
        >
          {notice.text}
        </p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="panel p-6">
          <h2 className="mb-5 font-display text-xl">
            {form.id ? "Edit Watch" : "Add Watch"}
          </h2>
          <div className="grid gap-4">
            <Field label="Name">
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Submariner Date 126610LN"
                className={inputCls}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Brand">
                <input
                  value={form.brand}
                  onChange={(e) => set("brand", e.target.value)}
                  placeholder="Rolex"
                  className={inputCls}
                />
              </Field>
              <Field label="Reference #">
                <input
                  value={form.reference}
                  onChange={(e) => set("reference", e.target.value)}
                  placeholder="126610LN"
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Price">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="12500"
                  className={inputCls}
                />
              </Field>
              <Field label="Currency">
                <select
                  value={form.currency}
                  onChange={(e) => set("currency", e.target.value as Watch["currency"])}
                  className={inputCls}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Condition">
                <select
                  value={form.condition}
                  onChange={(e) => set("condition", e.target.value as Watch["condition"])}
                  className={inputCls}
                >
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value as Watch["status"])}
                className={inputCls}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Image URLs (one per line)">
              <textarea
                rows={4}
                value={form.images}
                onChange={(e) => set("images", e.target.value)}
                placeholder={"https://…/front.jpg\nhttps://…/back.jpg"}
                className={inputCls}
              />
            </Field>
            <div className="flex gap-3">
              <button
                onClick={save}
                className="rounded-full bg-amber-300 px-6 py-2.5 text-sm font-medium text-walnut-deep transition-colors hover:bg-amber-200"
              >
                Save Watch
              </button>
              {form.id && (
                <button
                  onClick={() => setForm(EMPTY_FORM)}
                  className="rounded-full border border-walnut-light px-4 py-2.5 text-sm text-cream-60 hover:border-amber-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="panel p-6">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="font-display text-xl">Broadcast Hub</h2>
            <span className="text-xs text-faint">Web-native deep links - no Viber bot fee</span>
          </div>
          {!target ? (
            <p className="text-sm text-faint">
              Save a watch, or pick one from the inventory below, then broadcast it here.
            </p>
          ) : (
            <>
              <div className="mb-4 text-sm text-faint">
                {target.title} · {formatPrice(target)}
              </div>
              <pre className="mb-4 whitespace-pre-wrap rounded-xl border border-walnut-light bg-walnut-deep/60 p-4 font-sans text-sm leading-relaxed text-cream">
                {promo}
              </pre>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={copyPromo}
                  className="rounded-full border border-amber-300/40 px-4 py-2 text-sm text-amber-200 transition-colors hover:bg-amber-300/10"
                >
                  {copied ? "Copied ✓" : "Copy Text"}
                </button>
                <a
                  href={viberForwardLink(promo ?? "")}
                  target="_blank"
                  rel="noopener"
                  className="rounded-full border border-walnut-light px-4 py-2 text-sm text-cream transition-colors hover:border-amber-300"
                >
                  Open Viber (pre-filled)
                </a>
                <a
                  href={links?.facebook}
                  target="_blank"
                  rel="noopener"
                  className="rounded-full border border-walnut-light px-4 py-2 text-sm text-cream transition-colors hover:border-amber-300"
                >
                  Share Facebook
                </a>
                <a
                  href={links?.x}
                  target="_blank"
                  rel="noopener"
                  className="rounded-full border border-walnut-light px-4 py-2 text-sm text-cream transition-colors hover:border-amber-300"
                >
                  Share X
                </a>
                <a
                  href={links?.whatsapp}
                  target="_blank"
                  rel="noopener"
                  className="rounded-full border border-walnut-light px-4 py-2 text-sm text-cream transition-colors hover:border-amber-300"
                >
                  Share WhatsApp
                </a>
              </div>
              <p className="mt-4 text-xs text-faint">
                viber://forward opens the Viber app with this post pre-filled. Copy Text is the
                desktop fallback.
              </p>
            </>
          )}
        </section>
      </div>

      <section className="panel mt-8 p-6">
        <h2 className="mb-5 font-display text-xl">Inventory ({watches?.length ?? 0})</h2>
        {!supabase && <p className="text-sm text-amber-300">Supabase not configured.</p>}
        {watches === null ? (
          <p className="text-sm text-faint">Loading…</p>
        ) : watches.length === 0 ? (
          <p className="text-sm text-cream-60">The collection is empty. Add your first watch.</p>
        ) : (
          <ul className="divide-y divide-ink-700">
            {watches.map((w) => (
              <li key={w.id} className="flex flex-wrap items-center gap-3 py-3">
                {w.images[0] && (
                  <img
                    src={w.images[0]}
                    alt=""
                    className="h-12 w-14 rounded-lg object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm">{w.title}</div>
                  <div className="text-xs text-faint">
                    {w.brand} · {w.condition} · {w.status}
                  </div>
                </div>
                <span className="text-sm text-gold-300">{formatPrice(w)}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setForm({
                        id: w.id,
                        title: w.title,
                        brand: w.brand,
                        reference: w.reference ?? "",
                        price: String(w.price),
                        currency: w.currency,
                        condition: w.condition,
                        status: w.status,
                        images: w.images.join("\n"),
                      });
                      setNotice(null);
                    }}
                    className="rounded-full border border-ink-700 px-3 py-1.5 text-xs hover:border-gold-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setTarget(w)}
                    className="rounded-full border border-gold-500 px-3 py-1.5 text-xs text-gold-300 hover:bg-gold-500/10"
                  >
                    Broadcast
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
