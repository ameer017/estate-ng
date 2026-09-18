import Link from "next/link";
import { auth } from "@/auth";
import { firstName, homeForRole } from "@/lib/auth-redirect";
import { prisma } from "@/lib/db";
import { formatNaira } from "@/lib/money";
import { kindLabel } from "@/lib/labels";
import { ListingPhoto } from "@/components/listing-photo";
import { Marquee } from "@/components/marquee";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await auth();
  const listings = await prisma.listing.findMany({
    where: { status: { in: ["LIVE", "UNDER_OFFER", "LET"] } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
  const [hero, ...rest] = listings;

  return (
    <div className="bg-[var(--ink)] text-[var(--paper)]">
      <section className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 md:pt-14">
        <div className="plot-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto grid max-w-[1400px] items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--teal)]">
              Lagos · Abuja · Ibadan · Port Harcourt
            </p>
            <h1 className="mt-5 font-display text-[14vw] font-extrabold leading-[0.78] sm:text-8xl lg:text-[7.5rem]">
              Plot.
              <span className="block text-[var(--teal)]">Let.</span>
              <span className="block">Title.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/60">
              A courtyard for Nigerian stock — terraces in Lekki, plots in Epe, rent on a mock wallet.
              Agents run the pipe. Landlords watch occupancy.
            </p>
            {session ? (
              <Link
                className="mt-8 inline-flex text-sm font-semibold uppercase tracking-[0.16em] text-[var(--mint)]"
                href={homeForRole(session.user.role)}
              >
                Back to your desk, {firstName(session.user.name)} →
              </Link>
            ) : (
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/listings">
                  <Button size="lg" type="button">
                    Walk the stock
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" type="button" className="border-white/40 text-white hover:bg-white hover:text-[var(--ink)]">
                    Enter demo
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {hero ? (
            <Link href={`/listings/${hero.slug}`} className="plate relative block border border-white/15">
              <ListingPhoto listing={hero} className="h-[28rem]" chrome={false} />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--mint)]">{kindLabel[hero.kind]}</p>
                <p className="mt-1 font-display text-3xl">{hero.title}</p>
                <p className="mt-2 font-display text-2xl text-[var(--gold)]">{formatNaira(hero.priceKobo)}</p>
              </div>
            </Link>
          ) : null}
        </div>

        {rest.length > 0 ? (
          <div className="relative mx-auto mt-10 flex max-w-[1400px] gap-4 overflow-x-auto pb-2 no-scrollbar">
            {rest.map((listing, index) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.slug}`}
                className="plate w-64 shrink-0 border border-white/10"
                style={{ transform: `rotate(${index % 2 === 0 ? -1.5 : 1.8}deg)` }}
              >
                <ListingPhoto listing={listing} className="h-40" chrome={false} />
                <div className="bg-[var(--ink-2)] p-3">
                  <p className="truncate text-sm font-semibold">{listing.area}</p>
                  <p className="text-[11px] text-white/50">{formatNaira(listing.priceKobo)}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      <Marquee
        items={[
          "Lekki terrace ₦12m / yr",
          "Ikoyi sale ₦185m",
          "Yaba 2-bed let",
          "Epe 500 sqm dry land",
          "Maitama duplex ₦25m",
          "Bodija mini-flat ₦850k",
        ]}
      />

      <section id="desks" className="mx-auto grid max-w-[1400px] gap-px bg-white/10 px-4 py-16 sm:px-6 md:grid-cols-4">
        <Desk n="01" title="Seeker" body="Filter stock, enquire, book a viewing, apply to rent." />
        <Desk n="02" title="Agent" body="Publish listings. Close enquiries. Cut a lease on approve." />
        <Desk n="03" title="Landlord" body="Occupancy, invoices, tickets — the compound ledger." />
        <Desk n="04" title="Operator" body="Agencies and people. Archive anything that should not sit live." />
      </section>
    </div>
  );
}

function Desk({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="clip-ticket bg-[var(--ink-2)] p-6 md:min-h-[16rem]">
      <p className="font-display text-4xl text-[var(--teal)]">{n}</p>
      <h2 className="mt-6 font-display text-3xl">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-white/55">{body}</p>
    </div>
  );
}
