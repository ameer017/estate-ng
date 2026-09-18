export function Marquee({ items }: { items: string[] }) {
  const loop = [...items, ...items];
  return (
    <div className="marquee border-y border-white/10 bg-[var(--ink)] py-3 text-[var(--paper)]">
      <div className="marquee-track gap-10 pr-10 text-[11px] font-semibold uppercase tracking-[0.28em]">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="whitespace-nowrap">
            {item}
            <span className="ml-10 text-[var(--teal)]">■</span>
          </span>
        ))}
      </div>
    </div>
  );
}
