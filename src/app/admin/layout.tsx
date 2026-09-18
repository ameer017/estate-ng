import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/session";

const links = [
  { href: "/admin", label: "Desk" },
  { href: "/admin/agencies", label: "Agencies" },
  { href: "/admin/people", label: "People" },
  { href: "/admin/listings", label: "Listings" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin("/admin");

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <div className="no-scrollbar mb-6 flex items-center gap-1 overflow-x-auto border border-[var(--ink)] bg-[var(--ink)] px-2 py-2">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--teal)]">Network</p>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
