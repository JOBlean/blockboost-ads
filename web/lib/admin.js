import { timingSafeEqual } from "node:crypto";

// True when the request carries the admin key: "Authorization: Bearer <ADMIN_TOKEN>".
// Only you (in the browser) and Claude (from the terminal) know the key.
export function isAdmin(request) {
  const key = process.env.ADMIN_TOKEN;
  if (!key) return false;
  const given = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(given);
  const b = Buffer.from(key);
  // timingSafeEqual takes the same time whether the first or last letter is wrong,
  // so nobody can guess the key one letter at a time by timing the replies.
  return a.length === b.length && timingSafeEqual(a, b);
}

export const unauthorized = () =>
  Response.json({ error: "Missing or wrong admin key." }, { status: 401 });
