export const WAT = "Africa/Lagos";

export function formatWAT(date: Date, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-NG", { timeZone: WAT, ...options }).format(date);
}

export function formatDate(date: Date) {
  return formatWAT(date, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(date: Date) {
  return `${formatDate(date)} · ${formatWAT(date, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}`;
}

export function greetingWAT(date = new Date()) {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: WAT,
      hour: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .find((part) => part.type === "hour")?.value ?? "12",
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function toDateTimeLocal(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: WAT,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}
