export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null) {
    return "0";
  }
  return num.toLocaleString("tr-TR");
}
