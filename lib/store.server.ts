// In-memory demo store. Vercel serverless functions are stateless between
// cold starts, so this resets occasionally — good enough for a live demo,
// not a durable production database. Swap for a real Postgres/Neon database
// (via the Vercel Marketplace) when this becomes the real ordering system.
export type OrderStatus = "new" | "confirmed" | "ready" | "picked-up" | "cancelled";

export interface StoredOrder {
  code: string;
  name: string;
  phone: string;
  email: string;
  pickupDate: string;
  notes: string;
  totalCents: number;
  status: OrderStatus;
  createdAt: string;
  items: { name: string; qty: number; lineCents: number }[];
}

declare global {
  // eslint-disable-next-line no-var
  var __pbOrders: StoredOrder[] | undefined;
  // eslint-disable-next-line no-var
  var __pbSubscribers: { email: string; createdAt: string }[] | undefined;
  // eslint-disable-next-line no-var
  var __pbRecentPhones: Map<string, number[]> | undefined;
}

export function orders(): StoredOrder[] {
  if (!global.__pbOrders) global.__pbOrders = [];
  return global.__pbOrders;
}

export function subscribers(): { email: string; createdAt: string }[] {
  if (!global.__pbSubscribers) global.__pbSubscribers = [];
  return global.__pbSubscribers;
}

export function recentOrderCount(phone: string): number {
  if (!global.__pbRecentPhones) global.__pbRecentPhones = new Map();
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const hits = (global.__pbRecentPhones.get(phone) ?? []).filter((ts) => ts > cutoff);
  global.__pbRecentPhones.set(phone, hits);
  return hits.length;
}

export function recordPhoneHit(phone: string): void {
  if (!global.__pbRecentPhones) global.__pbRecentPhones = new Map();
  const hits = global.__pbRecentPhones.get(phone) ?? [];
  hits.push(Date.now());
  global.__pbRecentPhones.set(phone, hits);
}

export function orderCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return `PB-${Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("")}`;
}
