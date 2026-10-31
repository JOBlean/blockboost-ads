// The one place the website talks to the database.
//
// The database is Cloudflare D1 (SQLite). Online it's the real D1 database;
// with `npm run dev` it's a local copy kept in .wrangler/ on your PC.
// The table itself is created by migrations/0001_create_orders.sql.
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const STATUSES = ["New", "Working on it", "Delivered", "Cancelled"];

// The packages the order form offers. The home page reads this same list,
// so a price changed here changes everywhere.
export const PACKAGES = [
  {
    id: "banner",
    name: "Banner Ad",
    price: "400 R$",
    blurb: "One sharp sponsored-ad image for your game, in the sizes you need.",
    includes: ["1 design, all common sizes", "2 rounds of changes", "Ready in 3 days"],
  },
  {
    id: "billboard",
    name: "Billboard Pack",
    price: "900 R$",
    blurb: "Three in-game billboard and thumbnail designs that match each other.",
    includes: ["3 matching designs", "Thumbnail + icon refresh", "Ready in 5 days"],
    popular: true,
  },
  {
    id: "launch",
    name: "Launch Kit",
    price: "2,000 R$",
    blurb: "Everything for a game launch or big update: ads, thumbnails, icon and a short promo clip.",
    includes: ["5 designs + game icon", "15-second promo clip", "Unlimited small changes"],
  },
];

// Order numbers are just the row id plus 1000, shown as AD-1001, AD-1002...
export const toOrderNo = (id) => `AD-${1000 + id}`;

// Run one SQL command and get the rows back as a list.
// Each ? in the text is filled in safely from params, in order.
export async function query(text, params = []) {
  const { env } = await getCloudflareContext({ async: true });
  const { results } = await env.DB.prepare(text).bind(...params).all();
  return results;
}
