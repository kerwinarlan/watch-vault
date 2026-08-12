/** Contact section: "Book a viewing" via the collecting desk - mirrors the original site. */
export default function ContactSection() {
  const channels = [
    {
      label: "WhatsApp",
      href: "https://api.whatsapp.com/send?phone=639206332503&text=Hi%20The%20Watch%20Alley%21%20I%27d%20love%20to%20book%20a%20viewing.",
    },
    {
      label: "Messenger",
      href: "https://m.me/thewatchalley?text=Hi%20The%20Watch%20Alley%21%20I%27d%20love%20to%20book%20a%20viewing.",
    },
    {
      label: "Viber",
      href: "viber://forward?text=Hi%20The%20Watch%20Alley%21%20I%27d%20love%20to%20book%20a%20viewing.",
    },
  ];
  return (
    <section id="contact" className="border-t border-walnut-light py-20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="micro-label text-amber-300/80">Private Collecting Desk</p>
        <h2 className="mt-3 font-display text-5xl uppercase tracking-tight text-cream">
          Book a viewing
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-cream-60">
          Prefer to see a piece in person? Message the collecting desk and we will set
          up a viewing in Manila. Try-on appointments are private and unhurried.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener"
              className="rounded-full border border-amber-300/40 px-6 py-3 micro-label text-amber-200 transition-colors hover:border-amber-300/70 hover:bg-amber-300/10"
            >
              {c.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
