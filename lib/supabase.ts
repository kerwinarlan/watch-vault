import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Anon client: public catalog reads only (RLS allows SELECT for everyone).
// Admin writes go through app/api/admin/watches/route.ts with the service
// role key, which never reaches the browser.
export const supabase: SupabaseClient | null = url
  ? createClient(url, anonKey)
  : null;
