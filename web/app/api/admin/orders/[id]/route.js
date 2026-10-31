import { query, STATUSES } from "@/lib/db";
import { isAdmin, unauthorized } from "@/lib/admin";

// PATCH /api/admin/orders/12  with  {"status": "Delivered"} — change one order's status.
export async function PATCH(request, { params }) {
  if (!isAdmin(request)) return unauthorized();
  const { id } = await params;
  const { status } = await request.json().catch(() => ({}));
  if (!STATUSES.includes(status)) {
    return Response.json({ error: `Status must be one of: ${STATUSES.join(", ")}.` }, { status: 400 });
  }
  const rows = await query(
    "UPDATE orders SET status = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ? RETURNING id",
    [status, Number(id)]
  );
  if (!rows.length) return Response.json({ error: "No order with that id." }, { status: 404 });
  return Response.json({ ok: true });
}

// DELETE /api/admin/orders/12 — remove spam or test orders.
export async function DELETE(request, { params }) {
  if (!isAdmin(request)) return unauthorized();
  const { id } = await params;
  await query("DELETE FROM orders WHERE id = ?", [Number(id)]);
  return Response.json({ ok: true });
}
