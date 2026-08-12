import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { DEMO_WATCHES } from "./demo-data.ts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// ponytail: read-only demo client. Single table, ignores filters/ordering;
// covers only the anon read path both pages use. Replace by setting the
// Supabase env vars - admin writes already refuse loudly (route returns 503).
function demoClient(): SupabaseClient {
  const from = (table: string) => ({
    select: () => ({
      order: () =>
        Promise.resolve({
          data: table === "watches" ? DEMO_WATCHES : [],
          error: null,
        }),
    }),
  });
  return { from } as unknown as SupabaseClient;
}

// Anon client: public catalog reads only (RLS allows SELECT for everyone).
// Admin writes go through app/api/admin/watches/route.ts with the service
// role key, which never reaches the browser.
export const supabase: SupabaseClient = url
  ? createClient(url, anonKey)
  : demoClient();
