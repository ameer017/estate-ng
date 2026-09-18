import Link from "next/link";
import { prisma } from "@/lib/db";
import { firstName } from "@/lib/auth-redirect";
import { greetingWAT } from "@/lib/datetime";
import { formatNaira } from "@/lib/money";
import { requireTenant } from "@/lib/session";
import { invoiceStatusLabel } from "@/lib/labels";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/states";

export const metadata = { title: "Your desk" };

export default async function TenantDashboardPage() {
  const session = await requireTenant("/dashboard");

  const [lease, applications, enquiries] = await Promise.all([
    prisma.lease.findFirst({
      where: { tenantId: session.user.id, status: { in: ["ACTIVE", "NOTICE"] } },
      include: {
        listing: true,
        invoices: { orderBy: { dueDate: "desc" }, take: 3 },
      },
    }),
    prisma.application.count({ where: { userId: session.user.id, status: "PENDING" } }),
    prisma.enquiry.count({ where: { userId: session.user.id, status: "OPEN" } }),
  ]);

  const due = lease?.invoices.find((invoice) => invoice.status !== "PAID");

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--teal)]">
        {greetingWAT()} · {firstName(session.user.name)}
      </p>
      <div className="mt-4 grid gap-px bg-[var(--ink)] lg:grid-cols-12">
        <section className="bg-[var(--ink)] p-7 text-white lg:col-span-7">
          {lease ? (
            <>
              <p className="font-display text-6xl leading-none md:text-7xl">{lease.listing.area}</p>
              <p className="mt-3 text-sm text-white/65">
                {lease.listing.title} · {lease.reference}
              </p>
              <p className="mt-8 font-display text-3xl">{formatNaira(lease.rentKobo)} / year</p>
            </>
          ) : (
            <>
              <p className="font-display text-5xl leading-none">No keys yet</p>
              <p className="mt-3 text-sm text-white/65">Browse listings, enquire, then apply to rent.</p>
              <Link href="/listings" className="mt-8 inline-block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--mint)]">
                Open the stock →
              </Link>
            </>
          )}
        </section>

        <section className="bg-[var(--gold-soft)] p-6 text-[var(--ink)] lg:col-span-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-800">Next rent</p>
          {due ? (
            <>
              <h2 className="mt-2 font-display text-4xl">{formatNaira(due.amountKobo)}</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                {due.periodLabel} · {invoiceStatusLabel[due.status]}
              </p>
              <Link href={`/pay/${due.id}`} className="mt-4 inline-block text-sm font-semibold uppercase tracking-[0.14em] text-[var(--teal)]">
                Pay with mock wallet →
              </Link>
            </>
          ) : (
            <p className="mt-4 text-sm text-[var(--muted)]">Nothing outstanding.</p>
          )}
        </section>

        <section className="bg-[var(--panel)] p-6 lg:col-span-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--teal)]">Open enquiries</p>
          <p className="mt-3 font-display text-6xl">{enquiries}</p>
          <Link href="/enquiries" className="mt-3 inline-block text-sm font-semibold text-[var(--teal)]">
            View thread →
          </Link>
        </section>
        <section className="bg-[var(--panel)] p-6 lg:col-span-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--teal)]">Applications</p>
          <p className="mt-3 font-display text-6xl">{applications}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">waiting on an agent</p>
        </section>
        <section className="bg-[var(--panel)] p-6 lg:col-span-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--teal)]">Tenancy</p>
          {lease ? (
            <div className="mt-3">
              <Badge tone="teal">{lease.status}</Badge>
              <Link href="/tenancy" className="mt-4 block text-sm font-semibold text-[var(--teal)]">
                Invoices & tickets →
              </Link>
            </div>
          ) : (
            <EmptyState title="No lease" body="Apply on a live rental to start a tenancy." />
          )}
        </section>
      </div>
    </div>
  );
}
