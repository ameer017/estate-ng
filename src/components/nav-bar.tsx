"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

type Role = "ADMIN" | "AGENT" | "OWNER" | "TENANT" | string | undefined;

export function NavBar({
  home,
  name,
  role,
  signedIn,
}: {
  home: string;
  name?: string | null;
  role?: Role;
  signedIn: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = navLinks(role, signedIn);
  const overDark = pathname === "/";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 border-b ${
        overDark
          ? "border-white/10 bg-[var(--ink)] text-[var(--paper)]"
          : "border-[var(--ink)]/15 bg-[var(--paper)]/90 text-[var(--ink)] backdrop-blur"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href={home} aria-label="EstateNG home" className="min-w-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-0 text-[11px] font-semibold uppercase tracking-[0.18em] md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={tabClass(pathname, link.href, overDark)}>
              {link.label}
            </Link>
          ))}
          <div className="ml-4">
            <AuthControls signedIn={signedIn} name={name} overDark={overDark} />
          </div>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center border border-current/30 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-current/15 px-4 py-4 md:hidden">
          <nav className="flex flex-col text-sm font-semibold uppercase tracking-[0.16em]">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="border-b border-current/10 py-3" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4">
            <AuthControls signedIn={signedIn} name={name} stacked overDark={overDark} />
          </div>
        </div>
      ) : null}
    </header>
  );
}

function AuthControls({
  signedIn,
  name,
  stacked = false,
  overDark,
}: {
  signedIn: boolean;
  name?: string | null;
  stacked?: boolean;
  overDark: boolean;
}) {
  if (signedIn) {
    return (
      <div className={stacked ? "flex flex-col gap-2" : "flex items-center gap-3"}>
        {name ? <span className="text-[11px] uppercase tracking-[0.16em] opacity-70">{name}</span> : null}
        <form action={signOutAction} className={stacked ? "w-full" : undefined}>
          <Button variant={overDark ? "outline" : "navy"} size="sm" type="submit" className={`${stacked ? "w-full" : ""} ${overDark ? "border-white/40 text-white hover:bg-white hover:text-[var(--ink)]" : ""}`}>
            Sign out
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className={stacked ? "grid grid-cols-2 gap-2" : "flex items-center gap-2"}>
      <Link href="/login">
        <Button variant="ghost" size="sm" type="button" className={stacked ? "w-full" : ""}>
          Log in
        </Button>
      </Link>
      <Link href="/register">
        <Button size="sm" type="button" className={stacked ? "w-full" : ""}>
          Find a home
        </Button>
      </Link>
    </div>
  );
}

function navLinks(role: Role, signedIn: boolean) {
  if (role === "ADMIN") {
    return [
      { href: "/admin", label: "Desk" },
      { href: "/admin/agencies", label: "Agencies" },
      { href: "/admin/people", label: "People" },
      { href: "/admin/listings", label: "Listings" },
    ];
  }
  if (role === "AGENT") {
    return [
      { href: "/agent", label: "Pipeline" },
      { href: "/agent/listings", label: "Stock" },
      { href: "/agent/enquiries", label: "Enquiries" },
      { href: "/agent/viewings", label: "Viewings" },
    ];
  }
  if (role === "OWNER") {
    return [
      { href: "/owner", label: "Portfolio" },
      { href: "/owner/leases", label: "Leases" },
      { href: "/owner/tickets", label: "Tickets" },
    ];
  }
  if (signedIn) {
    return [
      { href: "/dashboard", label: "Overview" },
      { href: "/listings", label: "Browse" },
      { href: "/enquiries", label: "Enquiries" },
      { href: "/tenancy", label: "Tenancy" },
    ];
  }
  return [
    { href: "/listings", label: "Listings" },
    { href: "/#desks", label: "Desks" },
  ];
}

function tabClass(pathname: string, href: string, overDark: boolean) {
  const active = href !== "/#desks" && (pathname === href || pathname.startsWith(`${href}/`));
  return `px-3 py-2 ${overDark ? "hover:text-[var(--teal)]" : "hover:text-[var(--teal)]"} ${
    active ? "text-[var(--teal)] underline decoration-2 underline-offset-8" : ""
  }`;
}
