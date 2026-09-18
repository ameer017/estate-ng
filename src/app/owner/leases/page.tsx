import { prisma } from "@/lib/db";
import { requireOwner } from "@/lib/session";
import { formatDate } from "@/lib/datetime";
import { formatNaira } from "@/lib/money";
import { invoiceStatusLabel, leaseStatusLabel } from "@/lib/labels";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/states";

export const metadata = { title: "Leases" };

export default async function OwnerLeasesPage() {
  const session = await requireOwner("/owner/leases");
  const leases = await prisma.lease.findMany({
    where: { listing: { ownerId: session.user.id } },
    include: { listing: true, tenant: true, invoices: { orderBy: { dueDate: "desc" } } },
    orderBy: { startDate: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-4xl">Leases</h1>
      <div className="mt-6 space-y-4">
        {leases.length === 0 ? (
          <EmptyState title="No leases" body="Approved applications become leases on units you own." />
        ) : (
          leases.map((lease) => (
            <div key={lease.id} className="rounded-[1.5rem] border border-white/80 bg-white/80 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-display text-2xl">{lease.listing.title}</p>
                  <p className="text-sm text-[var(--muted)]">
                    {lease.tenant.name} · {lease.reference} · {formatDate(lease.startDate)} → {formatDate(lease.endDate)}
                  </p>
                </div>
                <Badge tone="teal">{leaseStatusLabel[lease.status]}</Badge>
              </div>
              <div className="mt-4 space-y-2">
                {lease.invoices.map((invoice) => (
                  <div key={invoice.id} className="flex flex-wrap justify-between gap-2 text-sm">
                    <span>
                      {invoice.periodLabel} · {formatNaira(invoice.amountKobo)}
                    </span>
                    <Badge tone={invoice.status === "PAID" ? "teal" : "gold"}>{invoiceStatusLabel[invoice.status]}</Badge>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
