import { prisma } from "@/lib/db";
import { ListingCard } from "@/components/listing-card";
import { EmptyState } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { cities } from "@/lib/labels";
import type { ListingKind } from "@prisma/client";

export const metadata = { title: "Listings" };

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; kind?: string; q?: string }>;
}) {
  const { city, kind, q } = await searchParams;
  const kindFilter = kind === "RENT" || kind === "SALE" || kind === "LAND" ? (kind as ListingKind) : undefined;

  const listings = await prisma.listing.findMany({
    where: {
      status: { in: ["LIVE", "UNDER_OFFER", "LET"] },
      city: city || undefined,
      kind: kindFilter,
      OR: q
        ? [
            { title: { contains: q, mode: "insensitive" } },
            { area: { contains: q, mode: "insensitive" } },
            { city: { contains: q, mode: "insensitive" } },
          ]
        : undefined,
    },
    orderBy: { createdAt: "desc" },
  });

  const [featured, ...rest] = listings;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--teal)]">The board</p>
          <h1 className="mt-2 font-display text-5xl md:text-7xl">Homes & plots</h1>
        </div>
        <p className="max-w-xs text-sm text-[var(--muted)]">Annual rents in naira. Filter by city and offer type.</p>
      </div>

      <form className="mt-8 grid gap-3 border border-[var(--ink)] bg-[var(--panel)] p-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
        <div>
          <Label htmlFor="q">Search</Label>
          <Input id="q" name="q" defaultValue={q} placeholder="Yaba, Lekki, Epe…" />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Select id="city" name="city" defaultValue={city ?? ""}>
            <option value="">All cities</option>
            {cities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="kind">Offer</Label>
          <Select id="kind" name="kind" defaultValue={kind ?? ""}>
            <option value="">All offers</option>
            <option value="RENT">To let</option>
            <option value="SALE">For sale</option>
            <option value="LAND">Land</option>
          </Select>
        </div>
        <Button type="submit">Filter</Button>
      </form>

      {listings.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No matches" body="Try another city or clear the filters." />
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {featured ? <ListingCard listing={featured} featured /> : null}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {rest.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
