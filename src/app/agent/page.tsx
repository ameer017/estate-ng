import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAgent } from "@/lib/session";
import { firstName } from "@/lib/auth-redirect";
import { formatDateTime, greetingWAT } from "@/lib/datetime";
import { decideApplicationAction, setTicketStatusAction } from "@/lib/actions/agent";
import { applicationStatusLabel, ticketStatusLabel } from "@/lib/labels";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/states";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

export const metadata = { title: "Agent pipeline" };

export default async function AgentHomePage() {
  const session = await requireAgent("/agent");

  const [live, enquiries, viewings, applications, tickets] = await Promise.all([
    prisma.listing.count({ where: { agentId: session.user.id, status: "LIVE" } }),
    prisma.enquiry.count({ where: { listing: { agentId: session.user.id }, status: "OPEN" } }),
    prisma.viewing.count({
      where: { listing: { agentId: session.user.id }, status: "SCHEDULED", startsAt: { gte: new Date() } },
    }),
    prisma.application.findMany({
      where: { listing: { agentId: session.user.id }, status: "PENDING" },
      include: { listing: true, user: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.maintenanceTicket.findMany({
      where: { listing: { agentId: session.user.id }, status: { not: "RESOLVED" } },
      include: { listing: true, reporter: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-8 sm:px-6">
      <section className="bg-[var(--ink)] p-7 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--teal)]">
          {greetingWAT()} · {firstName(session.user.name)}
        </p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">Pipeline</h1>
        <div className="mt-8 grid gap-px bg-white/10 sm:grid-cols-3">
          <Stat label="Live stock" value={String(live)} />
          <Stat label="Open enquiries" value={String(enquiries)} />
          <Stat label="Upcoming viewings" value={String(viewings)} />
        </div>
        <Link href="/agent/new" className="mt-6 inline-block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--mint)]">
          Publish a listing →
        </Link>
      </section>

      <Card>
        <CardHeader>
          <h2 className="font-display text-2xl">Applications</h2>
        </CardHeader>
        <CardBody className="space-y-3">
          {applications.length === 0 ? (
            <EmptyState title="No pending applications" body="When a tenant applies, it lands here." />
          ) : (
            applications.map((application) => (
              <div key={application.id} className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{application.user.name}</p>
                    <p className="text-sm text-[var(--muted)]">
                      {application.listing.title} · {application.note}
                    </p>
                  </div>
                  <Badge tone="gold">{applicationStatusLabel[application.status]}</Badge>
                </div>
                <div className="mt-3 flex gap-2">
                  <form action={decideApplicationAction}>
                    <input type="hidden" name="id" value={application.id} />
                    <input type="hidden" name="status" value="APPROVED" />
                    <Button size="sm" type="submit">
                      Approve & cut lease
                    </Button>
                  </form>
                  <form action={decideApplicationAction}>
                    <input type="hidden" name="id" value={application.id} />
                    <input type="hidden" name="status" value="DECLINED" />
                    <Button size="sm" variant="outline" type="submit">
                      Decline
                    </Button>
                  </form>
                </div>
              </div>
            ))
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-display text-2xl">Maintenance</h2>
        </CardHeader>
        <CardBody className="space-y-3">
          {tickets.length === 0 ? (
            <EmptyState title="All quiet" body="Open tickets from tenants show up here." />
          ) : (
            tickets.map((ticket) => (
              <div key={ticket.id} className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{ticket.title}</p>
                    <p className="text-sm text-[var(--muted)]">
                      {ticket.listing.title} · {ticket.reporter.name} · {formatDateTime(ticket.createdAt)}
                    </p>
                  </div>
                  <Badge tone="gold">{ticketStatusLabel[ticket.status]}</Badge>
                </div>
                <form action={setTicketStatusAction} className="mt-3 flex flex-wrap gap-2">
                  <input type="hidden" name="id" value={ticket.id} />
                  <Button size="sm" variant="outline" name="status" value="IN_PROGRESS" type="submit">
                    In progress
                  </Button>
                  <Button size="sm" variant="navy" name="status" value="RESOLVED" type="submit">
                    Resolve
                  </Button>
                </form>
              </div>
            ))
          )}
        </CardBody>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--ink-2)] px-4 py-3">
      <p className="text-[11px] uppercase tracking-wide text-white/50">{label}</p>
      <p className="mt-1 font-display text-3xl">{value}</p>
    </div>
  );
}
