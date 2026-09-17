import { NextResponse } from "next/server";
import { z } from "zod";

import { isAdminRequest } from "@/lib/admin-auth.server";
import { orders, type OrderStatus } from "@/lib/store.server";

export const runtime = "nodejs";
const STATUSES: OrderStatus[] = ["new", "confirmed", "ready", "picked-up", "cancelled"];

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return NextResponse.json({ message: "Please sign in again." }, { status: 401 });
  const body = await request.json().catch(() => null);
  const parsed = z.object({ code: z.string().max(20), status: z.enum(STATUSES as [OrderStatus, ...OrderStatus[]]) }).safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  const order = orders().find((o) => o.code === parsed.data.code);
  if (order) order.status = parsed.data.status;
  return NextResponse.json({ ok: true });
}
