import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireTenant } from "@/lib/session";
import { formatDateTime } from "@/lib/datetime";
import { applicationStatusLabel, viewingStatusLabel } from "@/lib/labels";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/states";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

export const metadata = { title: "Enquiries" };

export default async function EnquiriesPage() {
  const session = await requireTenant("/enquiries");

  const [enquiries, viewings, applications] = await Promise.all([
    prisma.enquiry.findMany({
      where: { userId: session.user.id },
      include: { listing: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.viewing.findMany({
      where: { userId: session.user.id },
      include: { listing: true },
      orderBy: { startsAt: "desc" },
    }),
    prisma.application.findMany({
      where: { userId: session.user.id },
      include: { listing: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--teal)]">Pipeline</p>
        <h1 className="mt-2 font-display text-4xl">Your enquiries</h1>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-display text-2xl">Messages</h2>
        </CardHeader>
        <CardBody className="space-y-3">
          {enquiries.length === 0 ? (
            <EmptyState title="No enquiries yet" body="Open a listing and send a note to the agent." />
          ) : (
            enquiries.map((enquiry) => (
              <div key={enquiry.id} className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link href={`/listings/${enquiry.listing.slug}`} className="font-semibold">
                    {enquiry.listing.title}
                  </Link>
                  <Badge tone={enquiry.status === "OPEN" ? "teal" : "muted"}>{enquiry.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-[var(--muted)]">{enquiry.message}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">{formatDateTime(enquiry.createdAt)}</p>
              </div>
            ))
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-display text-2xl">Viewings</h2>
        </CardHeader>
        <CardBody className="space-y-3">
          {viewings.length === 0 ? (
            <EmptyState title="No viewings" body="Book a slot on a live listing." />
          ) : (
            viewings.map((viewing) => (
              <div key={viewing.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[var(--line)] bg-white px-4 py-3">
                <div>
                  <p className="font-semibold">{viewing.listing.title}</p>
                  <p className="text-sm text-[var(--muted)]">{formatDateTime(viewing.startsAt)}</p>
                </div>
                <Badge tone="gold">{viewingStatusLabel[viewing.status]}</Badge>
              </div>
            ))
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-display text-2xl">Applications</h2>
        </CardHeader>
        <CardBody className="space-y-3">
          {applications.length === 0 ? (
            <EmptyState title="No applications" body="Apply on a live rental when you are ready." />
          ) : (
            applications.map((application) => (
              <div key={application.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[var(--line)] bg-white px-4 py-3">
                <div>
                  <p className="font-semibold">{application.listing.title}</p>
                  <p className="text-sm text-[var(--muted)]">{application.note}</p>
                </div>
                <Badge tone={application.status === "APPROVED" ? "teal" : application.status === "DECLINED" ? "danger" : "gold"}>
                  {applicationStatusLabel[application.status]}
                </Badge>
              </div>
            ))
          )}
        </CardBody>
      </Card>
    </div>
  );
}
