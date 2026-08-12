// Viber broadcast for the owner: auto-posts a new listing to the Viber
// channel / group chat when a watch is added via the admin API.
// Mirrors the proven web-viber bridge (chatapi.viber.com/pa/post with
// auth_token in the body, superadmin sender auto-discovery).
//
// Env:
//   VIBER_AUTH_TOKEN  required - token from Channel info -> Developer Tools
//   VIBER_FROM        optional - sender id override (auto-discovered otherwise)
//   VIBER_TARGET_ID   optional - receiver for group/community posts
const PA_BASE = "https://chatapi.viber.com/pa";

let cachedSender: string | null = null;

async function resolveSender(): Promise<string> {
  if (cachedSender) return cachedSender;
  const from = process.env.VIBER_FROM;
  if (from) {
    cachedSender = from;
    return from;
  }
  const res = await fetch(`${PA_BASE}/get_account_info`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ auth_token: process.env.VIBER_AUTH_TOKEN ?? "" }),
  });
  const data = await res.json();
  if (data.status !== 0) {
    throw new Error(`get_account_info failed: ${data.status_message}`);
  }
  const superadmin = (data.members ?? []).find(
    (m: { role?: string; id?: string }) => m.role === "superadmin"
  );
  if (!superadmin?.id) throw new Error("no superadmin found in channel members");
  cachedSender = superadmin.id;
  return superadmin.id;
}

/** Post a text message to the owner's Viber. Never throws - returns a result. */
export async function postToViber(text: string): Promise<{ sent: boolean; error?: string }> {
  const token = process.env.VIBER_AUTH_TOKEN;
  if (!token) return { sent: false, error: "VIBER_AUTH_TOKEN is not set" };
  try {
    const body: Record<string, unknown> = {
      auth_token: token,
      from: await resolveSender(),
      type: "text",
      text: text.slice(0, 7000),
    };
    const target = process.env.VIBER_TARGET_ID;
    if (target) body.receiver = target;
    const res = await fetch(`${PA_BASE}/post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json();
    if (data.status !== 0) {
      return { sent: false, error: `viber post failed: ${data.status_message}` };
    }
    return { sent: true };
  } catch (err) {
    return {
      sent: false,
      error: err instanceof Error ? err.message : "viber post failed",
    };
  }
}
