import { query, toOrderNo, PACKAGES } from "@/lib/db";

// POST /api/orders — anyone on the web can place an ad order.
// There is deliberately no GET here: the public can add orders but never read them.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Send the order as JSON." }, { status: 400 });
  }

  // "website" is a hidden field people never see. Spam bots fill in every field,
  // so if it has anything in it, pretend it worked and save nothing.
  if (body.website) return Response.json({ order: "AD-0000" });

  const clean = (v, max) => String(v ?? "").trim().slice(0, max);
  const robloxUser = clean(body.robloxUser, 40);
  const contact = clean(body.contact, 120);
  const gameLink = clean(body.gameLink, 300);
  const headline = clean(body.headline, 120);
  const details = clean(body.details, 2000);
  const deadline = clean(body.deadline, 40);
  const pkg = PACKAGES.find((p) => p.id === body.package);

  if (!robloxUser || !contact || !headline || !pkg) {
    return Response.json(
      { error: "Fill in your Roblox username, how to reach you, a package and what the ad should say." },
      { status: 400 }
    );
  }

  // Each ? is a placeholder. The database fills them in safely, so typed text
  // can never be run as a database command.
  const [row] = await query(
    `INSERT INTO orders (roblox_user, contact, game_link, package, headline, details, deadline)
     VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id`,
    [robloxUser, contact, gameLink, pkg.name, headline, details, deadline]
  );
  return Response.json({ order: toOrderNo(row.id) }, { status: 201 });
}
