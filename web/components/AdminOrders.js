"use client";
// The private orders page. Without the admin key the API refuses to send any orders,
// so even someone who finds /admin just sees the unlock box.
import { useCallback, useEffect, useState } from "react";

const STATUSES = ["New", "Working on it", "Delivered", "Cancelled"];
const KEY_STORE = "blockboost-admin-key";
const when = (iso) => new Date(iso).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

// localStorage keeps the key on this device only, so you type it once.
// try/catch because some private-browsing modes refuse storage.
const readKey = () => { try { return localStorage.getItem(KEY_STORE) || ""; } catch { return ""; } };
const writeKey = (k) => { try { k ? localStorage.setItem(KEY_STORE, k) : localStorage.removeItem(KEY_STORE); } catch {} };

export default function AdminOrders() {
  const [key, setKey] = useState(null); // null = still reading storage
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("New");
  const [open, setOpen] = useState(null);
  const [error, setError] = useState("");
  const [updated, setUpdated] = useState("");

  useEffect(() => setKey(readKey()), []);

  const api = useCallback(async (path, options = {}) => {
    const res = await fetch(path, {
      ...options,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    });
    if (res.status === 401) {
      writeKey("");
      setKey("");
      throw new Error("That admin key didn't work. Enter it again.");
    }
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || "Something went wrong. Try again.");
    return body;
  }, [key]);

  const load = useCallback(async () => {
    try {
      const { orders } = await api("/api/admin/orders");
      setOrders(orders);
      setError("");
      setUpdated(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
    } catch (e) {
      setError(e.message);
    }
  }, [api]);

  // Load now, then every 20 seconds while the page is open
  useEffect(() => {
    if (!key) return;
    load();
    const timer = setInterval(load, 20_000);
    return () => clearInterval(timer);
  }, [key, load]);

  async function setStatus(o, status) {
    const before = o.status;
    setOrders((all) => all.map((x) => (x.id === o.id ? { ...x, status } : x)));
    try {
      await api(`/api/admin/orders/${o.id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    } catch (e) {
      setOrders((all) => all.map((x) => (x.id === o.id ? { ...x, status: before } : x)));
      setError(e.message);
    }
  }

  async function remove(o) {
    if (!confirm(`Delete ${o.order} from ${o.robloxUser}? This can't be undone.`)) return;
    try {
      await api(`/api/admin/orders/${o.id}`, { method: "DELETE" });
      setOrders((all) => all.filter((x) => x.id !== o.id));
    } catch (e) {
      setError(e.message);
    }
  }

  if (key === null) return null;

  if (!key) {
    return (
      <div className="page-head">
        <p className="label">Private</p>
        <h1>Unlock orders</h1>
        <p>Enter the admin key. This device remembers it, so you only do this once.</p>
        <form
          className="order-form"
          style={{ marginTop: 24, maxWidth: 480 }}
          onSubmit={(e) => {
            e.preventDefault();
            const k = new FormData(e.currentTarget).get("key").trim();
            if (k) { writeKey(k); setKey(k); }
          }}
        >
          <div className="field full">
            <label htmlFor="key">Admin key</label>
            <input id="key" name="key" type="password" autoComplete="current-password" required />
          </div>
          <button className="btn primary" type="submit">Unlock</button>
          {error && <p className="msg bad" role="alert">{error}</p>}
        </form>
      </div>
    );
  }

  const shown = orders.filter((o) => filter === "All" || o.status === filter);

  return (
    <div>
      <div className="page-head">
        <p className="label">Private · orders{updated && ` · updated ${updated}`}</p>
        <h1>Ad orders</h1>
      </div>

      <div className="filters" role="group" aria-label="Filter by status">
        {[...STATUSES, "All"].map((s) => (
          <button key={s} type="button" aria-pressed={filter === s} onClick={() => setFilter(s)}>
            {s} · {s === "All" ? orders.length : orders.filter((o) => o.status === s).length}
          </button>
        ))}
      </div>

      {error && <p className="msg bad" role="alert">{error}</p>}

      <ul className="orders">
        {!shown.length && <li className="empty">Nothing here. New orders from the website show up under New.</li>}
        {shown.map((o) => (
          <li key={o.id} className="order-card">
            <button type="button" className="order-head" aria-expanded={open === o.id} onClick={() => setOpen(open === o.id ? null : o.id)}>
              <span className="who">{o.robloxUser}</span>
              <span className="status" data-s={o.status}>{o.status}</span>
              <span className="meta">{o.order} · {o.package} · {when(o.createdAt)}</span>
              <span className="snip">“{o.headline}”</span>
            </button>
            {open === o.id && (
              <div className="order-body">
                <dl>
                  <dt>Contact</dt><dd>{o.contact}</dd>
                  <dt>Game</dt><dd>{o.gameLink ? <a href={o.gameLink} target="_blank" rel="noreferrer">{o.gameLink}</a> : "—"}</dd>
                  <dt>Ad text</dt><dd>{o.headline}</dd>
                  <dt>Needed by</dt><dd>{o.deadline || "—"}</dd>
                  <dt>Notes</dt><dd className="pre">{o.details || "—"}</dd>
                </dl>
                <div className="filters">
                  {STATUSES.map((s) => (
                    <button key={s} type="button" aria-pressed={o.status === s} onClick={() => setStatus(o, s)}>{s}</button>
                  ))}
                </div>
                <button type="button" className="linkish danger" onClick={() => remove(o)}>Delete order</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <p className="note" style={{ paddingBottom: 48 }}>
        <button type="button" className="linkish" onClick={() => { writeKey(""); setKey(""); }}>Lock this device</button>
      </p>
    </div>
  );
}
