import { NextResponse } from "next/server";
import { z } from "zod";

import { checkAdminPassword, issueAdminSession } from "@/lib/admin-auth.server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = z.object({ password: z.string().min(1).max(200) }).safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false });
  if (!(await checkAdminPassword(parsed.data.password))) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return NextResponse.json({ ok: false });
  }
  await issueAdminSession();
  return NextResponse.json({ ok: true });
}
