import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Watch Alley PH — Curated Watches in Manila",
  description:
    "Curated pre-owned and brand-new watches in Manila with daylight photos, written condition notes, and direct collector concierge on Viber.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col bg-walnut-deep font-sans text-cream">
        <header className="sticky top-0 z-40 border-b border-walnut-light/70 bg-walnut-deep/85 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-display text-xl tracking-wide text-cream">
              The Watch <span className="text-amber-300">Alley</span>
            </Link>
            <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-2">
              <Link
                href="/"
                className="micro-label text-cream-60 transition-colors hover:text-amber-200"
              >
                Available Pieces
              </Link>
              <Link
                href="/?status=Sold"
                className="micro-label text-cream-60 transition-colors hover:text-amber-200"
              >
                Sold Archive
              </Link>
              <Link
                href="/watch-list"
                className="micro-label text-cream-60 transition-colors hover:text-amber-200"
              >
                Watch List
              </Link>
              <Link
                href="/journal"
                className="micro-label text-cream-60 transition-colors hover:text-amber-200"
              >
                Journal
              </Link>
              <Link
                href="/#contact"
                className="rounded-full border border-amber-300/40 px-4 py-2 micro-label text-amber-200 transition-colors hover:border-amber-300/70 hover:bg-amber-300/10"
              >
                Book a viewing
              </Link>
              <Link
                href="/admin"
                className="micro-label text-cream-60/60 transition-colors hover:text-amber-200"
              >
                Admin
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-walnut-light/70 py-8 text-center text-xs text-cream-60">
          <div className="mb-3 flex items-center justify-center gap-6">
            <a className="micro-label text-cream-60 transition-colors hover:text-amber-200" href="https://www.facebook.com/TheWatchAlley" target="_blank" rel="noopener">
              Facebook
            </a>
            <a className="micro-label text-cream-60 transition-colors hover:text-amber-200" href="https://www.instagram.com/the.watch.alley/" target="_blank" rel="noopener">
              Instagram
            </a>
            <a className="micro-label text-cream-60 transition-colors hover:text-amber-200" href="https://www.tiktok.com/@the.watch.alley.ph" target="_blank" rel="noopener">
              TikTok
            </a>
            <a className="micro-label text-cream-60 transition-colors hover:text-amber-200" href="https://api.whatsapp.com/send?phone=639206332503" target="_blank" rel="noopener">
              WhatsApp
            </a>
            <a className="micro-label text-cream-60 transition-colors hover:text-amber-200" href="https://m.me/thewatchalley" target="_blank" rel="noopener">
              Messenger
            </a>
          </div>
          The Watch Alley PH — curated watches in Manila. Demo project.
        </footer>
      </body>
    </html>
  );
}
