export function formatNaira(kobo: number | bigint) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(kobo) / 100);
}

export function nairaToKobo(naira: number) {
  if (!Number.isFinite(naira) || naira < 0) {
    throw new Error("Amount must be a non-negative number");
  }
  return Math.round(naira * 100);
}
