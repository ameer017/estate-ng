import Link from "next/link";
import { RegisterForm } from "@/components/forms";
import { redirectIfAuthenticated } from "@/lib/session";

export const metadata = { title: "Register" };

export default async function RegisterPage() {
  await redirectIfAuthenticated();

  return (
    <div className="relative min-h-[80vh] overflow-hidden bg-[var(--ink)] text-white">
      <div className="plot-grid absolute inset-0 opacity-30" />
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_26rem]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--teal)]">Tenant desk</p>
          <p className="mt-4 font-display text-6xl leading-[0.85] md:text-8xl">
            Open the
            <span className="block text-[var(--mint)]">gate.</span>
          </p>
          <p className="mt-6 max-w-sm text-sm text-white/55">
            Registration creates a tenant account. Agent and landlord desks are issued from the operator console.
          </p>
        </div>
        <div className="clip-ticket border border-white/15 bg-[var(--paper)] p-6 text-[var(--ink)] md:p-8">
          <h1 className="font-display text-4xl">Find a home</h1>
          <p className="mb-6 mt-2 text-sm text-[var(--muted)]">Takes a name, email, and a password of 8+ characters.</p>
          <RegisterForm />
          <p className="mt-4 text-sm text-[var(--muted)]">
            Already have keys?{" "}
            <Link className="font-semibold text-[var(--teal)]" href="/login">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
