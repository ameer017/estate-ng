import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { ApplyForm, EnquiryForm, ViewingForm } from "@/components/forms";
import { ListingPhoto } from "@/components/listing-photo";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { kindLabel, listingStatusLabel, typeLabel } from "@/lib/labels";
import { formatNaira } from "@/lib/money";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = await prisma.listing.findUnique({ where: { slug }, select: { title: true } });
  return { title: listing?.title ?? "Listing" };
}

export default async function ListingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  const listing = await prisma.listing.findUnique({
    where: { slug },
    include: {
      agent: { select: { name: true, phone: true, email: true } },
      agency: true,
    },
  });

  if (!listing || listing.status === "ARCHIVED") notFound();

  const canApply = listing.kind === "RENT" && listing.status === "LIVE";
  const canView = listing.status === "LIVE" || listing.status === "UNDER_OFFER";

  return (
    <div>
      <section className="relative bg-[var(--ink)] text-white">
        <ListingPhoto listing={listing} className="h-[62vw] max-h-[32rem] min-h-[18rem] w-full" chrome={false} />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-transparent to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto flex max-w-[1400px] flex-wrap items-end justify-between gap-4 px-4 pb-8 sm:px-6">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="teal">{kindLabel[listing.kind]}</Badge>
              <Badge tone="gold">{listingStatusLabel[listing.status]}</Badge>
              {listing.furnished ? <Badge tone="ink">Furnished</Badge> : null}
            </div>
            <h1 className="mt-3 font-display text-4xl leading-none md:text-6xl">{listing.title}</h1>
            <p className="mt-2 text-sm text-white/65">
              {listing.address} · {listing.area}, {listing.city}
            </p>
          </div>
          <p className="font-display text-4xl md:text-5xl">{formatNaira(listing.priceKobo)}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          {listing.kind === "RENT" ? (
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
              per year
              {listing.serviceKobo ? ` · service ${formatNaira(listing.serviceKobo)}` : ""}
            </p>
          ) : null}
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--ink-2)]">{listing.summary}</p>

          <dl className="mt-8 grid grid-cols-2 gap-px bg-[var(--ink)] sm:grid-cols-4">
            <Stat label="Type" value={typeLabel[listing.type]} />
            <Stat label="Beds" value={String(listing.beds)} />
            <Stat label="Baths" value={String(listing.baths)} />
            <Stat label="Sqm" value={listing.sqm ? String(listing.sqm) : "—"} />
          </dl>

          {listing.amenities.length > 0 ? (
            <div className="mt-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--teal)]">Amenities</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {listing.amenities.map((item) => (
                  <span key={item} className="border border-[var(--ink)] px-3 py-1 text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 border border-[var(--ink)] bg-[var(--panel)] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--teal)]">Agent</p>
            <p className="mt-2 font-display text-3xl">{listing.agent.name}</p>
            <p className="text-sm text-[var(--muted)]">
              {listing.agency.name} · {listing.agent.phone ?? listing.agent.email}
            </p>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="clip-ticket border border-[var(--ink)] bg-[var(--panel)] p-6">
            <h2 className="font-display text-3xl">Enquire</h2>
            <p className="mb-4 mt-1 text-sm text-[var(--muted)]">
              {session ? "The agent sees this on their desk." : "You’ll be asked to log in first."}
            </p>
            <EnquiryForm listingId={listing.id} slug={listing.slug} />
          </div>
          {canView ? (
            <div className="border border-[var(--ink)] bg-[var(--panel)] p-6">
              <h2 className="font-display text-3xl">Viewing</h2>
              <p className="mb-4 mt-1 text-sm text-[var(--muted)]">Pick a slot in WAT.</p>
              <ViewingForm listingId={listing.id} />
            </div>
          ) : null}
          {canApply && session?.user.role === "TENANT" ? (
            <div className="border border-[var(--ink)] bg-[var(--gold-soft)] p-6">
              <h2 className="font-display text-3xl">Apply</h2>
              <p className="mb-4 mt-1 text-sm text-[var(--muted)]">If approved, a one-year lease is cut.</p>
              <ApplyForm listingId={listing.id} />
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--panel)] px-4 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{label}</p>
      <p className="mt-1 font-display text-2xl">{value}</p>
    </div>
  );
}
