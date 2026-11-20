export function Section({ title, children }) {
  return (
    <section>
      <h2 className="mb-4 font-serif text-3xl tracking-[-0.01em]">{title}</h2>
      <div className="space-y-4 text-base leading-relaxed text-charcoal">{children}</div>
    </section>
  );
}

export default function PageShell({ eyebrow, title, intro, children }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8 sm:py-24">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-terracotta">{eyebrow}</p>
      <h1 className="font-serif text-4xl leading-[1.05] tracking-[-0.02em] sm:text-6xl">{title}</h1>
      {intro && <p className="mt-6 max-w-2xl text-base leading-relaxed text-charcoal sm:text-lg">{intro}</p>}
      <div className="mt-12 space-y-12">{children}</div>
    </div>
  );
}
