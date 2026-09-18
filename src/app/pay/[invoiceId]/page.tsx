import { notFound } from "next/navigation";
import { PayForm } from "@/components/forms";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/datetime";
import { formatNaira } from "@/lib/money";
import { requireTenant } from "@/lib/session";

export const metadata = { title: "Pay rent" };

export default async function PayPage({ params }: { params: Promise<{ invoiceId: string }> }) {
  const { invoiceId } = await params;
  const session = await requireTenant(`/pay/${invoiceId}`);
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { lease: { include: { listing: true } } },
  });

  if (!invoice || invoice.lease.tenantId !== session.user.id) notFound();

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <div className="rounded-[2rem] border border-white/80 bg-white/80 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--teal)]">Checkout</p>
        <h1 className="mt-2 font-display text-3xl">Confirm and pay</h1>
        <p className="mt-1 font-mono text-sm text-[var(--muted)]">{invoice.reference}</p>
        <dl className="mt-6 space-y-3 text-sm">
          <Row label="Home" value={invoice.lease.listing.title} />
          <Row label="Period" value={invoice.periodLabel} />
          <Row label="Due" value={formatDate(invoice.dueDate)} />
          <Row label="Amount" value={formatNaira(invoice.amountKobo)} />
        </dl>
        <div className="mt-8">
          {invoice.status === "PAID" ? (
            <p className="rounded-2xl bg-[var(--teal-soft)] px-4 py-3 text-sm text-[var(--teal-dark)]">Already paid.</p>
          ) : (
            <PayForm invoiceId={invoice.id} amount={formatNaira(invoice.amountKobo)} />
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-[var(--muted)]">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
