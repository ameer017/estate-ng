import { prisma } from "@/lib/db";
import { StaffForm } from "@/components/forms";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PagedTable } from "@/components/ui/paged-table";
import { Th, Td } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "People" };

export default async function PeoplePage() {
  const [people, agencies] = await Promise.all([
    prisma.user.findMany({
      include: { agentProfile: { include: { agency: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.agency.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl">People</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Issue agent and landlord desks from here.</p>
      </div>
      <Card>
        <CardHeader>
          <h2 className="font-display text-2xl">Create account</h2>
        </CardHeader>
        <CardBody>
          <StaffForm agencies={agencies} />
        </CardBody>
      </Card>
      <PagedTable
        header={
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Desk</Th>
          </tr>
        }
        rows={people.map((person) => (
          <tr key={person.id}>
            <Td className="font-semibold">{person.name}</Td>
            <Td>{person.email}</Td>
            <Td>
              <Badge tone="ink">{person.role}</Badge>
            </Td>
            <Td>{person.agentProfile?.agency.name ?? "—"}</Td>
          </tr>
        ))}
      />
    </div>
  );
}
