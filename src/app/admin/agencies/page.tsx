import { prisma } from "@/lib/db";
import { AgencyForm } from "@/components/forms";
import { formatDate } from "@/lib/datetime";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PagedTable } from "@/components/ui/paged-table";
import { Th, Td } from "@/components/ui/table";

export const metadata = { title: "Agencies" };

export default async function AgenciesPage() {
  const agencies = await prisma.agency.findMany({
    include: { _count: { select: { agents: true, listings: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl">Agencies</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Iroko Homes is seeded in Lagos.</p>
      </div>
      <Card>
        <CardHeader>
          <h2 className="font-display text-2xl">Add agency</h2>
        </CardHeader>
        <CardBody>
          <AgencyForm />
        </CardBody>
      </Card>
      <PagedTable
        header={
          <tr>
            <Th>Agency</Th>
            <Th>City</Th>
            <Th>Agents</Th>
            <Th>Listings</Th>
            <Th>Added</Th>
          </tr>
        }
        rows={agencies.map((agency) => (
          <tr key={agency.id}>
            <Td>
              <p className="font-semibold">{agency.name}</p>
              <p className="text-xs text-[var(--muted)]">{agency.code}</p>
            </Td>
            <Td>{agency.city}</Td>
            <Td>{agency._count.agents}</Td>
            <Td>{agency._count.listings}</Td>
            <Td>{formatDate(agency.createdAt)}</Td>
          </tr>
        ))}
      />
    </div>
  );
}
