import Link from "next/link";
import { PACKAGES } from "@/lib/db";

// Page 1: the advertisement page. It explains the service and sends people to /order.
export default function Home() {
  return (
    <main>
      <section className="hero">
        <div>
          <p className="label">Roblox game advertising</p>
          <h1>
            Ads that get your game <span className="hl">played.</span>
          </h1>
          <p className="lede">
            We design sponsored ads, in-game billboards and thumbnails that make players stop
            scrolling and hit Play. You tell us about your game, we make the ad.
          </p>
          <div className="ctas">
            <Link className="btn primary" href="/order">Order an ad</Link>
            <Link className="btn" href="#packages">See packages</Link>
          </div>
        </div>

        {/* A pretend ad built from plain HTML/CSS, to show the style */}
        <div className="mock" aria-hidden="true">
          <div className="mock-ad a">
            <span className="tag">Sponsored</span>
            <strong>OBBY RUSH</strong>
            <em>200 levels. 1 winner.</em>
            <span className="play">PLAY ▶</span>
          </div>
          <div className="mock-ad b">
            <span className="tag">New update</span>
            <strong>PET CAFÉ</strong>
            <em>Hatch. Serve. Repeat.</em>
          </div>
        </div>
      </section>

      <section id="packages" className="section">
        <p className="label">Packages</p>
        <h2>Pick your size</h2>
        <div className="packages">
          {PACKAGES.map((p) => (
            <article key={p.id} className={`pkg${p.popular ? " popular" : ""}`}>
              {p.popular && <span className="badge">Most picked</span>}
              <h3>{p.name}</h3>
              <p className="price">{p.price}</p>
              <p>{p.blurb}</p>
              <ul>
                {p.includes.map((line) => <li key={line}>{line}</li>)}
              </ul>
              <Link className="btn" href={`/order?package=${p.id}`}>Choose {p.name}</Link>
            </article>
          ))}
        </div>
      </section>

      <section id="how" className="section">
        <p className="label">How it works</p>
        <h2>Three steps</h2>
        <ol className="steps">
          <li><strong>Order</strong> Fill in the order form with your game and what the ad should say.</li>
          <li><strong>We message you</strong> We confirm the price and details before any work starts.</li>
          <li><strong>Get your ad</strong> We send the finished files, ready to upload to Roblox.</li>
        </ol>
      </section>

      <section className="section cta-band">
        <h2>Ready to fill your servers?</h2>
        <Link className="btn primary" href="/order">Order an ad</Link>
      </section>
    </main>
  );
}
