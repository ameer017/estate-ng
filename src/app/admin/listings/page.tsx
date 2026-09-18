import Link from "next/link";
import { prisma } from "@/lib/db";
import { archiveListingAction } from "@/lib/actions/admin";
import { kindLabel, listingStatusLabel } from "@/lib/labels";
import { formatNaira } from "@/lib/money";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PagedTable } from "@/components/ui/paged-table";
import { Th, Td } from "@/components/ui/table";

export const metadata = { title: "All listings" };

export default async function AdminListingsPage() {
  const listings = await prisma.listing.findMany({
    include: { agency: true, agent: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl">Listings</h1>
      <PagedTable
        header={
          <tr>
            <Th>Home</Th>
            <Th>Agency</Th>
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
              <p className="text-xs text-[var(--muted)]">{listing.agent.name}</p>
            </Td>
            <Td>{listing.agency.code}</Td>
            <Td>{kindLabel[listing.kind]}</Td>
            <Td>{formatNaira(listing.priceKobo)}</Td>
            <Td>
              <Badge tone={listing.status === "LIVE" ? "teal" : "muted"}>{listingStatusLabel[listing.status]}</Badge>
            </Td>
            <Td>
              {listing.status !== "ARCHIVED" ? (
                <form action={archiveListingAction}>
                  <input type="hidden" name="id" value={listing.id} />
                  <Button size="sm" variant="outline" type="submit">
                    Archive
                  </Button>
                </form>
              ) : null}
            </Td>
          </tr>
        ))}
      />
    </div>
  );
}
