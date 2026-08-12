import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChronoVault — Luxury Watch Resale",
  description:
    "A high-end luxury watch reseller inventory platform with an admin broadcast suite for Viber and socials.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col bg-ink-950 font-sans text-ivory">
        <header className="sticky top-0 z-40 border-b border-ink-700/60 bg-ink-950/80 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-display text-xl tracking-wide text-gold-400">
              ChronoVault
            </Link>
            <div className="flex items-center gap-6 text-sm text-faint">
              <Link href="/" className="transition-colors hover:text-ivory">
                Catalog
              </Link>
              <Link href="/admin" className="transition-colors hover:text-ivory">
                Admin
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-ink-700/60 py-8 text-center text-xs text-faint">
          ChronoVault — luxury watch resale &amp; broadcast suite. Demo project.
        </footer>
      </body>
    </html>
  );
}
