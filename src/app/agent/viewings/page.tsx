import { prisma } from "@/lib/db";
import { requireAgent } from "@/lib/session";
import { setViewingStatusAction } from "@/lib/actions/agent";
import { formatDateTime } from "@/lib/datetime";
import { viewingStatusLabel } from "@/lib/labels";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/states";

export const metadata = { title: "Viewings" };

export default async function AgentViewingsPage() {
  const session = await requireAgent("/agent/viewings");
  const viewings = await prisma.viewing.findMany({
    where: { listing: { agentId: session.user.id } },
    include: { listing: true, user: true },
    orderBy: { startsAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-4xl">Viewings</h1>
      <div className="mt-6 space-y-3">
        {viewings.length === 0 ? (
          <EmptyState title="No viewings booked" body="Slots appear when a seeker books from a listing." />
        ) : (
          viewings.map((viewing) => (
            <div key={viewing.id} className="rounded-[1.5rem] border border-white/80 bg-white/80 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{viewing.user.name}</p>
                  <p className="text-sm text-[var(--muted)]">
                    {viewing.listing.title} · {formatDateTime(viewing.startsAt)}
                  </p>
                  {viewing.notes ? <p className="mt-1 text-sm">{viewing.notes}</p> : null}
                </div>
                <Badge tone={viewing.status === "SCHEDULED" ? "gold" : "muted"}>
                  {viewingStatusLabel[viewing.status]}
                </Badge>
              </div>
              {viewing.status === "SCHEDULED" ? (
                <form action={setViewingStatusAction} className="mt-3 flex flex-wrap gap-2">
                  <input type="hidden" name="id" value={viewing.id} />
                  <Button size="sm" name="status" value="DONE" type="submit">
                    Mark done
                  </Button>
                  <Button size="sm" variant="outline" name="status" value="NO_SHOW" type="submit">
                    No-show
                  </Button>
                  <Button size="sm" variant="outline" name="status" value="CANCELLED" type="submit">
                    Cancel
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
