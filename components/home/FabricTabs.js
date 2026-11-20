"use client";

import { useState } from "react";
import RemoteImage from "@/components/ui/RemoteImage";

const FABRICS = [
  {
    key: "cotton", tab: "Organic cotton",
    title: "Heavyweight organic cotton jersey", spec: "100% organic cotton",
    desc: "Dense, soft jersey that keeps its shape wash after wash. We use it for our tees and hoodies.",
    stats: [["Weight", "400gsm"], ["Fit", "Relaxed"], ["Care", "Wash cold"]],
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=85",
  },
  {
    key: "linen", tab: "European linen",
    title: "Lightweight European linen", spec: "100% linen",
    desc: "Crisp at first, softer with every wash. Breathable enough for the warmest days. We use it for our shirts.",
    stats: [["Weight", "180gsm"], ["Feel", "Crisp to soft"], ["Care", "Machine wash"]],
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=85",
  },
  {
    key: "wool", tab: "Wool coating",
    title: "Brushed wool-blend coating", spec: "70% wool, 30% recycled polyester",
    desc: "Warm, structured cloth with a soft brushed finish. We use it for our coat.",
    stats: [["Weight", "520gsm"], ["Warmth", "High"], ["Care", "Dry clean"]],
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85",
  },
];

export default function FabricTabs() {
  const [i, setI] = useState(0);
  const f = FABRICS[i];

  return (
    <section className="border-y border-stone bg-stone/45 py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-4 sm:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-taupe lg:col-span-6">
          <RemoteImage key={f.key} src={f.image} alt={f.title} className="h-full w-full object-cover" />
          <span className="absolute left-5 top-5 rounded-sm bg-alabaster/90 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em]">Our fabrics</span>
        </div>

        <div className="space-y-8 lg:col-span-6">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-terracotta">Material philosophy</p>
            <h2 className="font-serif text-4xl leading-[1.08] tracking-[-0.02em] sm:text-5xl">Natural fabrics, chosen for how they wear.</h2>
          </div>

          <div className="border-y border-taupe py-6">
            <div role="tablist" className="mb-6 flex flex-wrap gap-2">
              {FABRICS.map((x, idx) => (
                <button
                  key={x.key}
                  role="tab"
                  aria-selected={idx === i}
                  onClick={() => setI(idx)}
                  className={`rounded-sm px-4 py-2 text-xs uppercase tracking-[0.15em] transition-all ${idx === i ? "bg-obsidian text-alabaster" : "border border-taupe bg-alabaster hover:border-obsidian"}`}
                >
                  {x.tab}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-serif text-2xl">{f.title}</h3>
                <span className="text-xs text-terracotta">{f.spec}</span>
              </div>
              <p className="max-w-lg text-sm leading-relaxed text-charcoal">{f.desc}</p>
              <dl className="grid grid-cols-3 gap-4 pt-3">
                {f.stats.map(([label, value]) => (
                  <div key={label} className="rounded-sm border border-stone bg-alabaster p-3.5">
                    <dt className="text-[10px] uppercase tracking-widest text-charcoal">{label}</dt>
                    <dd className="mt-0.5 font-serif text-lg font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
