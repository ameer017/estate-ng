import Link from "next/link";
import { LoginForm } from "@/components/forms";
import { redirectIfAuthenticated } from "@/lib/session";

export const metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  await redirectIfAuthenticated();
  const { callbackUrl } = await searchParams;
  const next = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "";

  return (
    <div className="relative min-h-[80vh] overflow-hidden bg-[var(--ink)] text-white">
      <div className="plot-grid absolute inset-0 opacity-30" />
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_26rem]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--teal)]">Four desks</p>
          <p className="mt-4 font-display text-6xl leading-[0.85] md:text-8xl">
            Keys
            <span className="block text-[var(--mint)]">in.</span>
          </p>
          <p className="mt-6 max-w-sm text-sm text-white/55">
            Tenants land on listings and rent. Agents land on the pipeline. Landlords land on occupancy. Operators land on the network.
          </p>
        </div>
        <div className="clip-ticket border border-white/15 bg-[var(--paper)] p-6 text-[var(--ink)] md:p-8">
          <h1 className="font-display text-4xl">Welcome back</h1>
          <p className="mb-6 mt-2 text-sm text-[var(--muted)]">Use a seeded account or your own tenant desk.</p>
          <LoginForm callbackUrl={next} />
          <div className="mt-5 space-y-1 border border-[var(--ink)]/10 bg-[var(--teal-soft)]/50 px-4 py-3 text-xs text-[var(--teal-dark)]">
            <p>Tenant · amina@estateng.ng / tenant123</p>
            <p>Agent · kemi@estateng.ng / agent123</p>
            <p>Landlord · chinedu@estateng.ng / owner123</p>
            <p>Operator · admin@estateng.ng / Estate!admin</p>
          </div>
          <p className="mt-4 text-sm text-[var(--muted)]">
            New here?{" "}
            <Link className="font-semibold text-[var(--teal)]" href="/register">
              Create a tenant account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
