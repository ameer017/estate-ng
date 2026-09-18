import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-3xl">
            Estate<span className="text-[var(--teal)]">NG</span>
          </p>
          <p className="mt-3 max-w-sm text-sm text-white/55">
            Listings, leases and keys for Nigeria. Demo data only — not a live agency.
          </p>
        </div>
        <div className="text-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--teal)]">On the board</p>
          <p className="mt-3 text-white/65">Lekki · Ikoyi · Yaba · Maitama · Bodija · PH GRA</p>
        </div>
        <div className="md:text-right">
          <Link href="/login" className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--mint)]">
            Enter a seeded desk →
          </Link>
          <p className="mt-3 text-xs text-white/45">NGN rents · WAT clocks · mock checkout</p>
        </div>
      </div>
    </footer>
  );
}
