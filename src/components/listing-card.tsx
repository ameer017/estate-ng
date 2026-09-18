import Link from "next/link";
import type { Listing } from "@prisma/client";
import { ListingPhoto } from "@/components/listing-photo";
import { Badge } from "@/components/ui/badge";
import { kindLabel, listingStatusLabel, typeLabel } from "@/lib/labels";
import { formatNaira } from "@/lib/money";
import { cn } from "@/lib/utils";

export function ListingCard({
  listing,
  featured = false,
}: {
  listing: Listing;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/listings/${listing.slug}`}
      className={cn(
        "plate group relative flex flex-col overflow-hidden border border-[var(--ink)] bg-[var(--panel)]",
        featured && "md:flex-row",
      )}
    >
      <ListingPhoto listing={listing} className={featured ? "h-72 md:h-auto md:w-[58%]" : "h-56"} />
      <div className={cn("flex flex-1 flex-col justify-between p-5", featured && "md:p-8")}>
        <div className="flex flex-wrap gap-2">
          <Badge tone="teal">{kindLabel[listing.kind]}</Badge>
          <Badge tone={listing.status === "LIVE" ? "gold" : "muted"}>{listingStatusLabel[listing.status]}</Badge>
        </div>
        <div>
          <h3 className={cn("mt-4 font-display leading-[0.95] group-hover:text-[var(--teal)]", featured ? "text-4xl md:text-5xl" : "text-2xl")}>
            {listing.title}
          </h3>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {listing.area}, {listing.city} · {typeLabel[listing.type]}
          </p>
        </div>
        <p className={cn("mt-6 font-display", featured ? "text-4xl" : "text-2xl")}>{formatNaira(listing.priceKobo)}</p>
        {listing.kind === "RENT" ? <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">per year · WAT</p> : null}
      </div>
    </Link>
  );
}
