import { Bungee, Figtree, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

// next/font downloads the fonts when the site is built and serves them from your
// own site, so visitors' browsers never have to fetch them from Google.
const display = Bungee({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const body = Figtree({ subsets: ["latin"], weight: ["400", "600", "800"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-mono" });

export const metadata = {
  title: "BlockBoost Ads · Roblox game advertising",
  description: "Sponsored ads, billboards and thumbnails that get your Roblox game played.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <div className="wrap">
          <header className="top">
            <Link className="brand" href="/" aria-label="BlockBoost Ads home">
              <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
                <rect x="2" y="2" width="24" height="24" rx="3" fill="var(--ink)" transform="rotate(12 14 14)" />
                <path d="M10 18 L14 9 L18 18 Z" fill="var(--hot)" />
              </svg>
              BlockBoost
            </Link>
            <nav aria-label="Main">
              <Link href="/#packages">Packages</Link>
              <Link href="/#how">How it works</Link>
              <Link href="/order" className="pill">Order an ad</Link>
            </nav>
          </header>
          {children}
          <footer>
            <span>© 2026 BlockBoost Ads</span>
            <span>Independent creators. Not made by or affiliated with Roblox Corporation.</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
