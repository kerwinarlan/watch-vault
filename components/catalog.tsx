"use client";

/* eslint-disable @next/next/no-img-element -- Admin-entered external image URLs: next/image requires per-host remotePatterns config and hard-fails on unknown hosts, while <img> with onError degrades gracefully. */

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CONDITIONS, STATUSES, formatPrice, priceInUsd, type Status, type Watch } from "@/lib/types";
import { inquireMessengerLink, inquireOnViberText, inquireWhatsAppLink, viberForwardLink } from "@/lib/broadcast";

type PriceFilter = "all" | "lt10" | "10to25" | "gt25";

interface Filters {
  brand: string | null;
  price: PriceFilter;
  condition: string | null;
  status: string | null;
}

interface ChipOption {
  label: string;
  value: string;
}

const PRICE_CHIPS: ChipOption[] = [
  { label: "All prices", value: "all" },
  { label: "Under $10k", value: "lt10" },
  { label: "$10k–$25k", value: "10to25" },
  { label: "$25k+", value: "gt25" },
];

const STATUS_STYLE: Record<Watch["status"], string> = {
  Available: "border-amber-300/60 text-amber-200",
  Reserved: "border-amber-200/40 text-amber-200/80",
  Sold: "border-cream-60/40 text-cream-60",
};

const CONFIG_ERROR = supabase
  ? null
  : "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then run supabase/schema.sql.";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP ?? "";
const MESSENGER = process.env.NEXT_PUBLIC_MESSENGER ?? "";

function InquiryRow({ watch }: { watch: Watch }) {
  const channels = [
    { href: viberForwardLink(inquireOnViberText(watch)), label: "Viber" },
    ...(WHATSAPP
      ? [{ href: inquireWhatsAppLink(watch, WHATSAPP), label: "WhatsApp" }]
      : []),
    ...(MESSENGER
      ? [{ href: inquireMessengerLink(watch, MESSENGER), label: "Messenger" }]
      : []),
  ];
  return (
    <div className="mt-4 grid grid-cols-3 gap-2">
      {channels.map((c) => (
        <a
          key={c.label}
          href={c.href}
          target="_blank"
          rel="noopener"
          className="rounded-full border border-amber-300/30 py-2 text-center text-[10px] uppercase tracking-[0.2em] text-amber-200 transition-colors hover:border-amber-300/60 hover:bg-amber-300/10"
        >
          {c.label}
        </a>
      ))}
    </div>
  );
}

function matches(filters: Filters, watch: Watch): boolean {
  if (filters.brand && watch.brand !== filters.brand) return false;
  if (filters.condition && watch.condition !== filters.condition) return false;
  if (filters.status && watch.status !== filters.status) return false;
  const usd = priceInUsd(watch);
  if (filters.price === "lt10" && usd >= 10_000) return false;
  if (filters.price === "10to25" && (usd < 10_000 || usd > 25_000)) return false;
  if (filters.price === "gt25" && usd <= 25_000) return false;
  return true;
}

function FilterRow({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: ChipOption[];
  value: string | null;
  onSelect: (value: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-28 text-xs uppercase tracking-widest text-faint">{label}</span>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(value === opt.value ? null : opt.value)}
          className={value === opt.value ? "chip chip-active" : "chip"}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function GalleryModal({
  watch,
  index,
  setIndex,
  onClose,
}: {
  watch: Watch;
  index: number;
  setIndex: (index: number) => void;
  onClose: () => void;
}) {
  const count = watch.images.length;
  const image = count > 0 ? watch.images[Math.min(index, count - 1)] : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && count > 1) setIndex((index + 1) % count);
      if (e.key === "ArrowLeft" && count > 1) setIndex((index - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, index, count, setIndex]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={watch.title}
    >
      <div className="panel w-full max-w-3xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="relative aspect-[16/10] bg-walnut">
          {image ? (
            <img
              src={image}
              alt={watch.title}
              className="h-full w-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <div className="flex h-full items-center justify-center font-display text-6xl text-amber-300">
              ⌚
            </div>
          )}
          {count > 1 && (
            <>
              <button
                onClick={() => setIndex((index - 1 + count) % count)}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-walnut-light bg-walnut-deep/70 px-3 py-1.5 text-amber-200 hover:border-amber-300"
                aria-label="Previous image"
              >
                ←
              </button>
              <button
                onClick={() => setIndex((index + 1) % count)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-walnut-light bg-walnut-deep/70 px-3 py-1.5 text-amber-200 hover:border-amber-300"
                aria-label="Next image"
              >
                →
              </button>
              <span className="absolute bottom-3 right-3 rounded-full bg-walnut-deep/70 px-2 py-0.5 text-xs text-cream-60">
                {index + 1} / {count}
              </span>
            </>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-200/80">{watch.brand}</div>
            <h3 className="mt-1 font-display text-2xl">{watch.title}</h3>
            <div className="mt-1 text-sm text-cream-60">
              {watch.reference ? `Ref ${watch.reference} · ` : ""}Condition: {watch.condition}
            </div>
            <div className="mt-2 font-display text-xl gold-text">{formatPrice(watch)}</div>
          </div>
          <a
            href={viberForwardLink(inquireOnViberText(watch))}
            target="_blank"
            rel="noopener"
            className="rounded-full border border-amber-300/30 px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-amber-200 transition-colors hover:border-amber-300/60 hover:bg-amber-300/10"
          >
            Inquire on Viber
          </a>
        </div>
        {count > 1 && (
          <div className="flex gap-2 px-6 pb-6">
            {watch.images.map((img, i) => (
              <button
                key={img}
                onClick={() => setIndex(i)}
                className={`h-16 w-20 overflow-hidden rounded-lg border ${
                  i === index ? "border-amber-300" : "border-walnut-light opacity-60"
                }`}
                aria-label={`Image ${i + 1}`}
              >
                <img
                  src={img}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Catalog({
  initialWatchId,
  initialStatus,
}: {
  initialWatchId: number | null;
  initialStatus: Status | null;
}) {
  const [watches, setWatches] = useState<Watch[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    brand: null,
    price: "all",
    condition: null,
    status: initialStatus,
  });
  const [modalId, setModalId] = useState<number | null>(initialWatchId);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("watches")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError(fetchError.message);
        else setWatches((data as Watch[]) ?? []);
      });
  }, []);

  const brands = useMemo(
    () => [...new Set((watches ?? []).map((w) => w.brand))].sort(),
    [watches]
  );
  const filtered = useMemo(
    () => (watches ?? []).filter((w) => matches(filters, w)),
    [watches, filters]
  );
  const modalWatch = watches?.find((w) => w.id === modalId) ?? null;

  const clearFilters = () =>
    setFilters({ brand: null, price: "all", condition: null, status: null });
  const anyFilter =
    filters.brand !== null ||
    filters.condition !== null ||
    filters.status !== null ||
    filters.price !== "all";

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <section className="mb-12 max-w-3xl">
        <p className="micro-label text-amber-300/80">The Watch Alley — Manila</p>
        <h1 className="mt-4 font-display text-[clamp(40px,7vw,86px)] font-light leading-[0.96] tracking-tight">
          First access, chosen with a{" "}
          <span className="gold-text">collector's eye</span>.
        </h1>
        <p className="mt-5 text-sm text-cream-60">
          Curated pre-owned and brand-new watches in Manila — daylight photos, written condition
          notes, and direct concierge on Viber. No bots, no monthly fees.
        </p>
      </section>

      <div className="mb-8 flex items-center gap-3">
        <span className="h-px w-8 bg-amber-500/60" aria-hidden="true" />
        <h2 className="font-display text-3xl uppercase tracking-tight text-cream">
          Available Pieces
        </h2>
      </div>

      <div className="mb-10 space-y-5">
        <FilterRow
          label="Brand"
          options={brands.map((b) => ({ label: b, value: b }))}
          value={filters.brand}
          onSelect={(v) => setFilters({ ...filters, brand: v })}
        />
        <FilterRow
          label="Price"
          options={PRICE_CHIPS}
          value={filters.price}
          onSelect={(v) => setFilters({ ...filters, price: (v ?? "all") as PriceFilter })}
        />
        <FilterRow
          label="Condition"
          options={CONDITIONS.map((c) => ({ label: c, value: c }))}
          value={filters.condition}
          onSelect={(v) => setFilters({ ...filters, condition: v })}
        />
        <FilterRow
          label="Availability"
          options={STATUSES.map((s) => ({ label: s, value: s }))}
          value={filters.status}
          onSelect={(v) => setFilters({ ...filters, status: v })}
        />
        {anyFilter && (
          <button
            onClick={clearFilters}
            className="text-xs text-amber-300 underline-offset-4 hover:underline"
          >
            Reset filters
          </button>
        )}
      </div>

      {CONFIG_ERROR ? (
        <p className="panel mb-8 p-4 text-sm text-amber-300">{CONFIG_ERROR}</p>
      ) : error ? (
        <p className="panel mb-8 p-4 text-sm text-amber-300">{error}</p>
      ) : watches === null ? (
        <p className="py-16 text-center text-cream-60">Opening the display case…</p>
      ) : filtered.length === 0 ? (
        <p className="py-16 text-center text-cream-60">No timepieces match these filters.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((w) => (
            <article
              key={w.id}
              className="panel group overflow-hidden transition-transform hover:-translate-y-1"
            >
              <button
                onClick={() => {
                  setImageIndex(0);
                  setModalId(w.id);
                }}
                className="block w-full"
                aria-label={`View ${w.title}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-walnut">
                  {w.images[0] ? (
                    <img
                      src={w.images[0]}
                      alt={w.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-display text-5xl text-amber-300">
                      ⌚
                    </div>
                  )}
                  <span
                    className={`absolute left-3 top-3 rounded-full border bg-walnut-deep/70 px-2.5 py-1 text-xs ${STATUS_STYLE[w.status]}`}
                  >
                    {w.status}
                  </span>
                </div>
              </button>
              <div className="p-5">
                <div className="micro-label text-amber-200/80">{w.brand}</div>
                <h3 className="mt-1 font-display text-lg leading-snug">{w.title}</h3>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-cream-60">
                  {w.reference ? `Ref ${w.reference}` : "No reference"}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-display text-xl gold-text">{formatPrice(w)}</span>
                  <span className="text-xs text-cream-60">{w.condition}</span>
                </div>
                <InquiryRow watch={w} />
              </div>
            </article>
          ))}
        </div>
      )}

      {modalWatch && (
        <GalleryModal
          watch={modalWatch}
          index={imageIndex}
          setIndex={setImageIndex}
          onClose={() => setModalId(null)}
        />
      )}
    </div>
  );
}
