export function homeForRole(role: "ADMIN" | "AGENT" | "OWNER" | "TENANT" | string | undefined) {
  if (role === "ADMIN") return "/admin";
  if (role === "AGENT") return "/agent";
  if (role === "OWNER") return "/owner";
  return "/dashboard";
}

export function firstName(name?: string | null) {
  const value = name?.trim();
  if (!value) return "there";
  return value.split(/\s+/)[0] ?? "there";
}

function isSafePath(path: string) {
  return path.startsWith("/") && !path.startsWith("//") && !path.includes("://");
}

export function resolvePostAuthPath(
  role: "ADMIN" | "AGENT" | "OWNER" | "TENANT" | string | undefined,
  callbackUrl?: string | null,
) {
  const home = homeForRole(role);
  if (!callbackUrl || callbackUrl === "/" || !isSafePath(callbackUrl)) {
    return home;
  }

  if (role === "ADMIN") {
    if (!callbackUrl.startsWith("/admin")) return home;
    return callbackUrl;
  }

  if (role === "AGENT") {
    if (!callbackUrl.startsWith("/agent")) return home;
    return callbackUrl;
  }

  if (role === "OWNER") {
    if (!callbackUrl.startsWith("/owner")) return home;
    return callbackUrl;
  }

  if (
    callbackUrl.startsWith("/admin") ||
    callbackUrl.startsWith("/agent") ||
    callbackUrl.startsWith("/owner")
  ) {
    return home;
  }
  return callbackUrl;
}
