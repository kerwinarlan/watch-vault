import Link from "next/link";
import { JOURNAL_POSTS } from "@/lib/demo-data";

/** Journal section: "Dispatches on Sourcing and Craft." - mirrors the original site. */
export default function JournalSection() {
  return (
    <section id="journal" className="border-t border-walnut-light py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="micro-label text-amber-300/80">Journal</p>
            <h2 className="mt-3 font-display text-4xl uppercase tracking-tight text-cream">
              Dispatches on Sourcing and Craft.
            </h2>
          </div>
          <Link
            href="/journal"
            className="micro-label shrink-0 text-amber-200 transition-colors hover:text-cream"
          >
            Read the journal →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {JOURNAL_POSTS.map((post) => (
            <Link
              key={post.title}
              href="/journal"
              className="group block overflow-hidden rounded-[2.25rem] border border-walnut-light bg-walnut/70 transition-transform hover:-translate-y-1"
            >
              <div className="aspect-[3/2] overflow-hidden bg-walnut">
                {/* eslint-disable-next-line @next/next/no-img-element -- static demo images */}
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className="micro-label text-amber-200/80">{post.tag}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-60">
                    {post.date}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl leading-snug">{post.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-60">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
