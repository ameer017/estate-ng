import { prisma } from "@/lib/db";
import { formatNaira } from "@/lib/money";

export const metadata = { title: "Operator desk" };

export default async function AdminHomePage() {
  const [agencies, agents, owners, tenants, live, paid] = await Promise.all([
    prisma.agency.count(),
    prisma.user.count({ where: { role: "AGENT" } }),
    prisma.user.count({ where: { role: "OWNER" } }),
    prisma.user.count({ where: { role: "TENANT" } }),
    prisma.listing.count({ where: { status: "LIVE" } }),
    prisma.invoice.aggregate({ _sum: { amountKobo: true }, where: { status: "PAID" } }),
  ]);

  return (
    <div>
      <h1 className="font-display text-4xl">Network desk</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Agencies, people, and collected rent across EstateNG.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Tile label="Agencies" value={String(agencies)} />
        <Tile label="Agents" value={String(agents)} />
        <Tile label="Landlords" value={String(owners)} />
        <Tile label="Tenants" value={String(tenants)} />
        <Tile label="Live listings" value={String(live)} />
        <Tile label="Rent collected" value={formatNaira(paid._sum.amountKobo ?? BigInt(0))} />
      </div>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[2rem] border border-white/80 bg-white/80 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--teal)]">{label}</p>
      <p className="mt-3 font-display text-4xl">{value}</p>
    </div>
  );
}
