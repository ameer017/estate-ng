import { prisma } from "@/lib/db";
import { requireOwner } from "@/lib/session";
import { firstName } from "@/lib/auth-redirect";
import { greetingWAT } from "@/lib/datetime";
import { formatNaira } from "@/lib/money";
import { listingStatusLabel } from "@/lib/labels";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/states";
import Link from "next/link";

export const metadata = { title: "Portfolio" };

export default async function OwnerHomePage() {
  const session = await requireOwner("/owner");
  const listings = await prisma.listing.findMany({
    where: { ownerId: session.user.id },
    include: {
      leases: { where: { status: "ACTIVE" }, include: { invoices: true, tenant: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const collected = listings
    .flatMap((listing) => listing.leases.flatMap((lease) => lease.invoices))
    .filter((invoice) => invoice.status === "PAID")
    .reduce((sum, invoice) => sum + invoice.amountKobo, BigInt(0));

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <section className="bg-[var(--ink)] p-7 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--teal)]">
          {greetingWAT()} · {firstName(session.user.name)}
        </p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">Portfolio</h1>
        <p className="mt-4 text-sm text-white/65">{listings.length} units · collected {formatNaira(collected)}</p>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {listings.length === 0 ? (
          <EmptyState title="No units yet" body="Ask your agent to attach a listing to this landlord account." />
        ) : (
          listings.map((listing) => {
            const lease = listing.leases[0];
            return (
              <div key={listing.id} className="border border-[var(--ink)] bg-[var(--panel)] p-5">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/listings/${listing.slug}`} className="font-display text-2xl">
                    {listing.title}
                  </Link>
                  <Badge tone="teal">{listingStatusLabel[listing.status]}</Badge>
                </div>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {listing.area}, {listing.city} · {formatNaira(listing.priceKobo)}
                </p>
                {lease ? (
                  <p className="mt-4 text-sm">
                    Let to {lease.tenant.name} · {lease.reference}
                  </p>
                ) : (
                  <p className="mt-4 text-sm text-[var(--muted)]">Vacant</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
