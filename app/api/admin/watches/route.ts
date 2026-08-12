import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { CURRENCIES, CONDITIONS, STATUSES } from "@/lib/types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

// NOTE: unauthenticated by design for this portfolio demo. Gate behind
// Supabase Auth or Vercel protection before production use.
function adminClient() {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey);
}

function validate(body: Record<string, unknown>) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const brand = typeof body.brand === "string" ? body.brand.trim() : "";
  const price = typeof body.price === "number" ? body.price : NaN;
  if (!title || !brand || !Number.isFinite(price) || price < 0) {
    return { error: "title, brand and a non-negative price are required" };
  }
  if (
    typeof body.currency !== "string" ||
    !(CURRENCIES as readonly string[]).includes(body.currency)
  ) {
    return { error: "currency must be USD or PHP" };
  }
  if (
    typeof body.condition !== "string" ||
    !(CONDITIONS as readonly string[]).includes(body.condition)
  ) {
    return { error: "invalid condition" };
  }
  if (
    typeof body.status !== "string" ||
    !(STATUSES as readonly string[]).includes(body.status)
  ) {
    return { error: "invalid status" };
  }
  const images = Array.isArray(body.images)
    ? body.images
        .filter((i): i is string => typeof i === "string")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  return {
    title,
    brand,
    reference:
      typeof body.reference === "string" && body.reference.trim()
        ? body.reference.trim()
        : null,
    price,
    currency: body.currency,
    condition: body.condition,
    status: body.status,
    images,
  };
}

export async function POST(req: Request) {
  const admin = adminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Supabase env vars are not configured" },
      { status: 503 }
    );
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }
  const watch = validate(body);
  if ("error" in watch) return NextResponse.json(watch, { status: 400 });
  const { data, error } = await admin.from("watches").insert(watch).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(req: Request) {
  const admin = adminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Supabase env vars are not configured" },
      { status: 503 }
    );
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }
  const id = Number(body.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "a valid id is required" }, { status: 400 });
  }
  const watch = validate(body);
  if ("error" in watch) return NextResponse.json(watch, { status: 400 });
  const { data, error } = await admin
    .from("watches")
    .update(watch)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json({ error: "watch not found" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
