import { NextResponse } from "next/server";
import { z } from "zod";

import { subscribers } from "@/lib/store.server";

export const runtime = "nodejs";

const input = z.object({ email: z.string().trim().toLowerCase().email("That email looks off.").max(120) });

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = input.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid email." }, { status: 400 });
  }
  const list = subscribers();
  if (!list.some((sub) => sub.email === parsed.data.email)) {
    list.push({ email: parsed.data.email, createdAt: new Date().toISOString() });
  }
  return NextResponse.json({ ok: true });
}
