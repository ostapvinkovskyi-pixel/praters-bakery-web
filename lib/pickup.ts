// Pickup rules: Tuesday to Friday, at least 3 days (72 hours) out, in the
// bakery's own time zone. Shared by the order form and the server.
export const PICKUP_TZ = "America/New_York";
const MAX_DAYS_AHEAD = 60;

export function todayIso(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PICKUP_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function isPickupDay(iso: string): boolean {
  const weekday = new Date(`${iso}T12:00:00Z`).getUTCDay();
  return weekday >= 2 && weekday <= 5;
}

export function earliestPickup(now: Date = new Date()): string {
  let candidate = addDays(todayIso(now), 3);
  while (!isPickupDay(candidate)) candidate = addDays(candidate, 1);
  return candidate;
}

export function upcomingPickupDays(count: number, now: Date = new Date()): string[] {
  const days: string[] = [];
  let candidate = earliestPickup(now);
  while (days.length < count) {
    if (isPickupDay(candidate)) days.push(candidate);
    candidate = addDays(candidate, 1);
  }
  return days;
}

export function validatePickup(iso: string, now: Date = new Date()): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "Choose a pickup day.";
  if (!isPickupDay(iso)) return "Pickup is Tuesday to Friday.";
  if (iso < earliestPickup(now)) return "Pre-orders need 3 days notice. Please choose a later day.";
  if (iso > addDays(todayIso(now), MAX_DAYS_AHEAD)) return "Please choose a day within the next two months.";
  return null;
}

export function formatPickup(iso: string, style: "long" | "short" = "long"): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: style === "long" ? "long" : "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
