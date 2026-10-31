import { query, toOrderNo } from "@/lib/db";
import { isAdmin, unauthorized } from "@/lib/admin";

// GET /api/admin/orders — every order, newest first. Admin key required.
export async function GET(request) {
  if (!isAdmin(request)) return unauthorized();
  const rows = await query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 500");
  return Response.json({
    orders: rows.map((r) => ({
      id: r.id,
      order: toOrderNo(r.id),
      robloxUser: r.roblox_user,
      contact: r.contact,
      gameLink: r.game_link,
      package: r.package,
      headline: r.headline,
      details: r.details,
      deadline: r.deadline,
      status: r.status,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    })),
  });
}
