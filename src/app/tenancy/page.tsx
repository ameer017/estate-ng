import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireTenant } from "@/lib/session";
import { formatDate } from "@/lib/datetime";
import { formatNaira } from "@/lib/money";
import { invoiceStatusLabel, ticketStatusLabel } from "@/lib/labels";
import { TicketForm } from "@/components/forms";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/states";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

export const metadata = { title: "Tenancy" };

export default async function TenancyPage() {
  const session = await requireTenant("/tenancy");
  const lease = await prisma.lease.findFirst({
    where: { tenantId: session.user.id, status: { in: ["ACTIVE", "NOTICE"] } },
    include: {
      listing: true,
      invoices: { orderBy: { dueDate: "desc" } },
      tickets: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!lease) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <EmptyState title="No active lease" body="When an agent approves your application, the tenancy lands here." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="rounded-[2rem] bg-[var(--ink)] p-7 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">{lease.reference}</p>
        <h1 className="mt-2 font-display text-4xl">{lease.listing.title}</h1>
        <p className="mt-2 text-sm text-white/65">
          {formatDate(lease.startDate)} → {formatDate(lease.endDate)} · {formatNaira(lease.rentKobo)} / year
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-display text-2xl">Invoices</h2>
        </CardHeader>
        <CardBody className="space-y-3">
          {lease.invoices.map((invoice) => (
            <div key={invoice.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-white px-4 py-3">
              <div>
                <p className="font-semibold">{invoice.periodLabel}</p>
                <p className="text-sm text-[var(--muted)]">
                  {invoice.reference} · due {formatDate(invoice.dueDate)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-display text-xl">{formatNaira(invoice.amountKobo)}</p>
                <Badge tone={invoice.status === "PAID" ? "teal" : invoice.status === "OVERDUE" ? "danger" : "gold"}>
                  {invoiceStatusLabel[invoice.status]}
                </Badge>
                {invoice.status !== "PAID" ? (
                  <Link href={`/pay/${invoice.id}`} className="text-sm font-semibold text-[var(--teal)]">
                    Pay
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="font-display text-2xl">Tickets</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            {lease.tickets.length === 0 ? (
              <EmptyState title="No tickets" body="Raise a maintenance issue when something breaks." />
            ) : (
              lease.tickets.map((ticket) => (
                <div key={ticket.id} className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{ticket.title}</p>
                    <Badge tone={ticket.status === "RESOLVED" ? "teal" : "gold"}>{ticketStatusLabel[ticket.status]}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-[var(--muted)]">{ticket.detail}</p>
                </div>
              ))
            )}
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="font-display text-2xl">Raise an issue</h2>
          </CardHeader>
          <CardBody>
            <TicketForm />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
