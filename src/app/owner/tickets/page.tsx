import { prisma } from "@/lib/db";
import { requireOwner } from "@/lib/session";
import { formatDateTime } from "@/lib/datetime";
import { ticketStatusLabel } from "@/lib/labels";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/states";

export const metadata = { title: "Tickets" };

export default async function OwnerTicketsPage() {
  const session = await requireOwner("/owner/tickets");
  const tickets = await prisma.maintenanceTicket.findMany({
    where: { listing: { ownerId: session.user.id } },
    include: { listing: true, reporter: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-4xl">Maintenance</h1>
      <div className="mt-6 space-y-3">
        {tickets.length === 0 ? (
          <EmptyState title="No tickets" body="Tenant issues on your units appear here." />
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className="rounded-[1.5rem] border border-white/80 bg-white/80 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{ticket.title}</p>
                  <p className="text-sm text-[var(--muted)]">
                    {ticket.listing.title} · {ticket.reporter.name} · {formatDateTime(ticket.createdAt)}
                  </p>
                </div>
                <Badge tone={ticket.status === "RESOLVED" ? "teal" : "gold"}>{ticketStatusLabel[ticket.status]}</Badge>
              </div>
              <p className="mt-2 text-sm">{ticket.detail}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
