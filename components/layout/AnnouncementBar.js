const messages = [
  "Free delivery on orders over Rs 7,000",
  "Autumn–Winter ’26 collection is here",
  "Heavyweight, natural fabrics cut to last",
];

export default function AnnouncementBar() {
  const group = (
    <div className="flex shrink-0 items-center">
      {messages.map((m) => (
        <span key={m} className="flex items-center">
          <span className="mx-8">{m}</span>
          <span className="text-white/60" aria-hidden="true">•</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="overflow-hidden bg-pop py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white">
      <div className="animate-marquee whitespace-nowrap">
        {group}
        <div aria-hidden="true" className="flex shrink-0 items-center">{group}</div>
      </div>
    </div>
  );
}