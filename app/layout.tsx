import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Watch Alley PH — Curated Watches in Manila",
  description:
    "Curated pre-owned and brand-new watches in Manila with daylight photos, written condition notes, and direct collector concierge on Viber.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col bg-walnut-deep font-sans text-cream">
        <header className="sticky top-0 z-40 border-b border-walnut-light/70 bg-walnut-deep/85 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-display text-xl tracking-wide text-cream">
              The Watch <span className="text-amber-300">Alley</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/?status=Available"
                className="micro-label text-cream-60 transition-colors hover:text-amber-200"
              >
                Available
              </Link>
              <Link
                href="/?status=Sold"
                className="micro-label text-cream-60 transition-colors hover:text-amber-200"
              >
                Sold
              </Link>
              <Link
                href="/admin"
                className="micro-label text-cream-60 transition-colors hover:text-amber-200"
              >
                Admin
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-walnut-light/70 py-8 text-center text-xs text-cream-60">
          The Watch Alley PH — curated watches in Manila. Demo build of ChronoVault.
        </footer>
      </body>
    </html>
  );
}
