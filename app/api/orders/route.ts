import { NextResponse } from "next/server";
import { z } from "zod";

import { MENU_BY_ID } from "@/lib/menu";
import { validatePickup } from "@/lib/pickup";
import { orderCode, orders, recentOrderCount, recordPhoneHit } from "@/lib/store.server";

export const runtime = "nodejs";

const orderInput = z.object({
  name: z.string().trim().min(2, "Please add your name.").max(80),
  phone: z.string().trim().min(7, "Please add a phone number.").max(30),
  email: z.union([z.string().trim().email("That email looks off.").max(120), z.literal("")]),
  pickupDate: z.string(),
  notes: z.string().trim().max(600).default(""),
  items: z
    .array(z.object({ id: z.string().max(60), qty: z.number().int().min(1).max(500) }))
    .min(1, "Add at least one item.")
    .max(40),
  company: z.string().max(200).optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = orderInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid order." }, { status: 400 });
  }
  const data = parsed.data;

  // Honeypot: bots fill the hidden field. Pretend success, store nothing.
  if (data.company) {
    return NextResponse.json({ code: "PB-THANKS", totalCents: 0, pickupDate: data.pickupDate });
  }

  const pickupError = validatePickup(data.pickupDate);
  if (pickupError) return NextResponse.json({ message: pickupError }, { status: 400 });

  const merged = new Map<string, number>();
  for (const line of data.items) merged.set(line.id, (merged.get(line.id) ?? 0) + line.qty);

  const lines: { item: NonNullable<ReturnType<typeof MENU_BY_ID.get>>; qty: number; lineCents: number }[] = [];
  for (const [id, qty] of merged) {
    const item = MENU_BY_ID.get(id);
    if (!item) return NextResponse.json({ message: "One of your items is no longer on the menu. Please refresh." }, { status: 400 });
    if (qty < item.min) return NextResponse.json({ message: `${item.name} has a minimum order of ${item.min}.` }, { status: 400 });
    lines.push({ item, qty, lineCents: item.priceCents * qty });
  }
  const totalCents = lines.reduce((sum, line) => sum + line.lineCents, 0);

  if (recentOrderCount(data.phone) >= 5) {
    return NextResponse.json(
      { message: "We already have several orders from this number today. Please email us to add more." },
      { status: 429 },
    );
  }

  const code = orderCode();
  orders().push({
    code,
    name: data.name,
    phone: data.phone,
    email: data.email,
    pickupDate: data.pickupDate,
    notes: data.notes,
    totalCents,
    status: "new",
    createdAt: new Date().toISOString(),
    items: lines.map((line) => ({ name: line.item.name, qty: line.qty, lineCents: line.lineCents })),
  });
  recordPhoneHit(data.phone);

  return NextResponse.json({ code, totalCents, pickupDate: data.pickupDate });
}
