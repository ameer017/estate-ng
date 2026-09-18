import type { Listing } from "@prisma/client";
import { kindLabel, typeLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";

const washes: Record<string, string> = {
  clay: "listing-wash-clay",
  gold: "listing-wash-gold",
  ink: "listing-wash-ink",
  sand: "listing-wash-sand",
};

export function ListingPhoto({
  listing,
  className,
  chrome = true,
}: {
  listing: Pick<Listing, "area" | "city" | "type" | "accent" | "beds">;
  className?: string;
  chrome?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden", washes[listing.accent] ?? washes.clay, className)}>
      <div className="plot-grid ken absolute inset-0 opacity-40" />
      <Skyline type={listing.type} />
      {chrome ? (
        <div className="relative flex h-full min-h-[11rem] flex-col justify-between p-5 text-white">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
            {listing.city} · {typeLabel[listing.type]}
          </span>
          <div>
            <span className="block font-display text-3xl leading-none">{listing.area}</span>
            <span className="mt-1 block text-sm text-white/75">
              {listing.beds > 0 ? `${listing.beds} bedroom` : kindLabel.LAND}
            </span>
          </div>
        </div>
      ) : (
        <span className="sr-only">
          {listing.area}, {listing.city}
        </span>
      )}
    </div>
  );
}

function Skyline({ type }: { type: Listing["type"] }) {
  const paths: Record<Listing["type"], string> = {
    FLAT: "M20 140 V70 h28 v70 M56 140 V40 h36 v100 M100 140 V85 h24 v55 M132 140 V55 h40 v85",
    DUPLEX: "M24 140 L80 48 L136 140 Z M70 140 V95 h20 v45",
    BUNGALOW: "M18 140 V88 h50 v52 M78 140 V100 h70 v40 M40 88 L43 70 h12 L58 88",
    TERRACE: "M16 140 V78 h28 v62 M48 140 V60 h28 v80 M80 140 V72 h28 v68 M112 140 V52 h36 v88",
    LAND: "M12 118 L70 92 L150 124 L12 124 Z",
    SHOP: "M30 140 V64 h100 v76 M30 78 h100 M55 140 V100 h20 v40 M90 140 V100 h20 v40",
    OFFICE: "M40 140 V28 h80 v112 M52 44 h16 v16 H52 Z M92 44 h16 v16 H92 Z M52 76 h16 v16 H52 Z M92 76 h16 v16 H92 Z",
  };

  return (
    <svg className="pointer-events-none absolute bottom-0 right-0 h-[78%] w-[70%] opacity-25" viewBox="0 0 180 150" aria-hidden>
      <path d={paths[type]} fill="none" stroke="white" strokeWidth="3" />
    </svg>
  );
}
