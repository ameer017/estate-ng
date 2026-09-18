import { ListingForm } from "@/components/forms";
import { requireAgent } from "@/lib/session";

export const metadata = { title: "New listing" };

export default async function NewListingPage() {
  await requireAgent("/agent/new");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--teal)]">Publish</p>
      <h1 className="mt-2 font-display text-4xl">New listing</h1>
      <p className="mb-6 mt-2 text-sm text-[var(--muted)]">Goes live immediately on the public stock.</p>
      <div className="rounded-[2rem] border border-white/80 bg-white/80 p-6">
        <ListingForm />
      </div>
    </div>
  );
}
