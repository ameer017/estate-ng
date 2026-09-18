import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { homeForRole } from "@/lib/auth-redirect";

export async function requireUser(callbackUrl = "/dashboard") {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  return session;
}

export async function requireTenant(callbackUrl = "/dashboard") {
  const session = await requireUser(callbackUrl);
  if (session.user.role !== "TENANT") {
    redirect(homeForRole(session.user.role));
  }
  return session;
}

export async function requireAgent(callbackUrl = "/agent") {
  const session = await requireUser(callbackUrl);
  if (session.user.role !== "AGENT") {
    redirect(homeForRole(session.user.role));
  }
  return session;
}

export async function requireOwner(callbackUrl = "/owner") {
  const session = await requireUser(callbackUrl);
  if (session.user.role !== "OWNER") {
    redirect(homeForRole(session.user.role));
  }
  return session;
}

export async function requireAdmin(callbackUrl = "/admin") {
  const session = await requireUser(callbackUrl);
  if (session.user.role !== "ADMIN") {
    redirect(homeForRole(session.user.role));
  }
  return session;
}

export async function redirectIfAuthenticated() {
  const session = await auth();
  if (session?.user?.id) {
    redirect(homeForRole(session.user.role));
  }
}
