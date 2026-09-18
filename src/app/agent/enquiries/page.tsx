import { prisma } from "@/lib/db";
import { requireAgent } from "@/lib/session";
import { closeEnquiryAction } from "@/lib/actions/agent";
import { formatDateTime } from "@/lib/datetime";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/states";

export const metadata = { title: "Enquiries" };

export default async function AgentEnquiriesPage() {
  const session = await requireAgent("/agent/enquiries");
  const enquiries = await prisma.enquiry.findMany({
    where: { listing: { agentId: session.user.id } },
    include: { listing: true, user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-4xl">Enquiries</h1>
      <div className="mt-6 space-y-3">
        {enquiries.length === 0 ? (
          <EmptyState title="Inbox is empty" body="Tenant messages from listings land here." />
        ) : (
          enquiries.map((enquiry) => (
            <div key={enquiry.id} className="rounded-[1.5rem] border border-white/80 bg-white/80 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{enquiry.user.name}</p>
                  <p className="text-sm text-[var(--muted)]">
                    {enquiry.listing.title} · {formatDateTime(enquiry.createdAt)}
                  </p>
                </div>
                <Badge tone={enquiry.status === "OPEN" ? "teal" : "muted"}>{enquiry.status}</Badge>
              </div>
              <p className="mt-3 text-sm">{enquiry.message}</p>
              {enquiry.status === "OPEN" ? (
                <form action={closeEnquiryAction} className="mt-3">
                  <input type="hidden" name="id" value={enquiry.id} />
                  <Button size="sm" variant="outline" type="submit">
                    Close
                  </Button>
                </form>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
