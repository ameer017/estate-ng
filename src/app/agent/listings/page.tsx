import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAgent } from "@/lib/session";
import { setListingStatusAction } from "@/lib/actions/agent";
import { kindLabel, listingStatusLabel } from "@/lib/labels";
import { formatNaira } from "@/lib/money";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/states";
import { PagedTable } from "@/components/ui/paged-table";
import { Th, Td } from "@/components/ui/table";

export const metadata = { title: "Stock" };

export default async function AgentListingsPage() {
  const session = await requireAgent("/agent/listings");
  const listings = await prisma.listing.findMany({
    where: { agentId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--teal)]">Agency stock</p>
          <h1 className="mt-2 font-display text-4xl">Your listings</h1>
        </div>
        <Link href="/agent/new">
          <Button type="button">New listing</Button>
        </Link>
      </div>

      {listings.length === 0 ? (
        <EmptyState title="No stock yet" body="Publish a let, sale, or plot." />
      ) : (
        <PagedTable
          header={
            <tr>
              <Th>Home</Th>
              <Th>Offer</Th>
              <Th>Price</Th>
              <Th>Status</Th>
              <Th></Th>
            </tr>
          }
          rows={listings.map((listing) => (
            <tr key={listing.id}>
              <Td>
                <Link href={`/listings/${listing.slug}`} className="font-semibold">
                  {listing.title}
                </Link>
                <p className="text-xs text-[var(--muted)]">
                  {listing.area}, {listing.city}
                </p>
              </Td>
              <Td>{kindLabel[listing.kind]}</Td>
              <Td>{formatNaira(listing.priceKobo)}</Td>
              <Td>
                <Badge tone={listing.status === "LIVE" ? "teal" : "muted"}>{listingStatusLabel[listing.status]}</Badge>
              </Td>
              <Td>
                <form action={setListingStatusAction} className="flex flex-wrap gap-1">
                  <input type="hidden" name="id" value={listing.id} />
                  <Button size="sm" variant="outline" name="status" value="UNDER_OFFER" type="submit">
                    Offer
                  </Button>
                  <Button size="sm" variant="outline" name="status" value="ARCHIVED" type="submit">
                    Archive
                  </Button>
                </form>
              </Td>
            </tr>
          ))}
        />
      )}
    </div>
  );
}
