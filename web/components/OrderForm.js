"use client";
// The order form. "use client" means this part runs in the visitor's browser,
// so it can react to typing and clicks without reloading the page.
import { useState } from "react";

export default function OrderForm({ packages, initialPackage }) {
  const [pkg, setPkg] = useState(
    packages.some((p) => p.id === initialPackage) ? initialPackage : "billboard"
  );
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null); // the order number once it's saved

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    setError("");
    // FormData collects every <input name="..."> in the form into one object
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, package: pkg }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Something went wrong. Try again.");
      setDone(body.order);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="done">
        <p className="label">Order received</p>
        <p className="order-no">{done}</p>
        <p>Save this number. We'll message you soon to confirm the price and details.</p>
      </div>
    );
  }

  return (
    <form className="order-form" onSubmit={submit}>
      <fieldset className="pick">
        <legend>Package</legend>
        {packages.map((p) => (
          <label key={p.id} className={pkg === p.id ? "on" : ""}>
            <input type="radio" name="pkg" value={p.id} checked={pkg === p.id} onChange={() => setPkg(p.id)} />
            <strong>{p.name}</strong>
            <span>{p.price}</span>
          </label>
        ))}
      </fieldset>

      <div className="grid">
        <div className="field">
          <label htmlFor="robloxUser">Roblox username</label>
          <input id="robloxUser" name="robloxUser" required maxLength={40} autoComplete="username" />
        </div>
        <div className="field">
          <label htmlFor="contact">How do we reach you?</label>
          <input id="contact" name="contact" required maxLength={120} placeholder="Discord name or email" />
        </div>
        <div className="field full">
          <label htmlFor="gameLink">Game link <span className="opt">(optional)</span></label>
          <input id="gameLink" name="gameLink" maxLength={300} placeholder="https://www.roblox.com/games/..." />
        </div>
        <div className="field full">
          <label htmlFor="headline">What should the ad say?</label>
          <input id="headline" name="headline" required maxLength={120} placeholder="e.g. 200 levels. 1 winner." />
        </div>
        <div className="field full">
          <label htmlFor="details">Anything else? <span className="opt">(optional)</span></label>
          <textarea id="details" name="details" rows={5} maxLength={2000} placeholder="Colors, characters to show, ad sizes, examples you like..." />
        </div>
        <div className="field">
          <label htmlFor="deadline">Needed by <span className="opt">(optional)</span></label>
          <input id="deadline" name="deadline" type="date" />
        </div>
      </div>

      {/* Honeypot: hidden from people, but spam bots fill it in */}
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <p className="note">Under 13? Ask a parent before ordering.</p>
      <button className="btn primary" type="submit" disabled={sending}>
        {sending ? "Sending..." : "Place order"}
      </button>
      {error && <p className="msg bad" role="alert">{error}</p>}
    </form>
  );
}
