import { test } from "node:test";
import assert from "node:assert/strict";
import { postToViber } from "../lib/viber.ts";

const realFetch = globalThis.fetch;

test("postToViber skips when token is missing", async () => {
  const prev = process.env.VIBER_AUTH_TOKEN;
  delete process.env.VIBER_AUTH_TOKEN;
  try {
    const r = await postToViber("hello");
    assert.equal(r.sent, false);
    assert.match(r.error ?? "", /VIBER_AUTH_TOKEN/);
  } finally {
    if (prev !== undefined) process.env.VIBER_AUTH_TOKEN = prev;
  }
});

test("postToViber resolves superadmin sender and posts to pa/post", async () => {
  const prevToken = process.env.VIBER_AUTH_TOKEN;
  const prevFrom = process.env.VIBER_FROM;
  process.env.VIBER_AUTH_TOKEN = "test-token";
  delete process.env.VIBER_FROM;
  const calls: string[] = [];
  globalThis.fetch = async (url: string | URL | Request, init?: RequestInit) => {
    calls.push(String(url));
    const body = JSON.parse(String(init?.body ?? "{}"));
    if (String(url).includes("get_account_info")) {
      assert.equal(body.auth_token, "test-token");
      return new Response(
        JSON.stringify({
          status: 0,
          status_message: "ok",
          members: [
            { role: "member", id: "pa:111" },
            { role: "superadmin", id: "pa:222" },
          ],
        })
      );
    }
    assert.equal(body.from, "pa:222");
    assert.equal(body.type, "text");
    assert.equal(body.text, "hello");
    return new Response(JSON.stringify({ status: 0, status_message: "ok" }));
  };
  try {
    const r = await postToViber("hello");
    assert.equal(r.sent, true);
    assert.deepEqual(calls, [
      "https://chatapi.viber.com/pa/get_account_info",
      "https://chatapi.viber.com/pa/post",
    ]);
  } finally {
    globalThis.fetch = realFetch;
    process.env.VIBER_AUTH_TOKEN = prevToken;
    if (prevFrom !== undefined) process.env.VIBER_FROM = prevFrom;
    else delete process.env.VIBER_FROM;
  }
});
