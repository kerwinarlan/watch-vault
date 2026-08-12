import JournalSection from "@/components/journal";

export default function JournalPage() {
  return (
    <div className="py-10">
      <div className="mx-auto max-w-6xl px-6">
        <p className="micro-label text-amber-300/80">The Watch Alley — Manila</p>
        <h1 className="mt-4 font-display text-6xl uppercase tracking-tight text-cream">
          Journal
        </h1>
      </div>
      <JournalSection />
    </div>
  );
}
