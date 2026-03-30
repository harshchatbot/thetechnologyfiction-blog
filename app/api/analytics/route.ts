import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import type { AnalyticsEvent } from "@/types/content";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";
import { deepOmitUndefined } from "@/lib/utils/object";

type AnalyticsPayload = {
  eventName?: string;
  path?: string;
  pageTitle?: string;
  visitorId?: string;
  sessionId?: string;
  referrer?: string;
  params?: Record<string, string | number | boolean | null | undefined>;
};

function sanitizeParams(params?: AnalyticsPayload["params"]) {
  if (!params) return undefined;

  return Object.fromEntries(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .slice(0, 20)
  ) as Record<string, string | number | boolean>;
}

export async function POST(request: Request) {
  try {
    const db = getFirebaseAdminDb();
    if (!db) {
      return NextResponse.json({ ok: true }, { status: 202 });
    }

    const body = (await request.json()) as AnalyticsPayload;
    if (!body.eventName || !body.path || !body.visitorId || !body.sessionId) {
      return NextResponse.json({ error: "Invalid analytics payload" }, { status: 400 });
    }

    const event: AnalyticsEvent = deepOmitUndefined({
      id: randomUUID(),
      eventName: String(body.eventName).slice(0, 80),
      path: String(body.path).slice(0, 300),
      pageTitle: body.pageTitle ? String(body.pageTitle).slice(0, 200) : undefined,
      visitorId: String(body.visitorId).slice(0, 120),
      sessionId: String(body.sessionId).slice(0, 120),
      referrer: body.referrer ? String(body.referrer).slice(0, 400) : undefined,
      userAgent: request.headers.get("user-agent")?.slice(0, 400) || undefined,
      createdAt: new Date().toISOString(),
      params: sanitizeParams(body.params)
    });

    await db.collection("analytics_events").doc(event.id).set(event);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }, { status: 202 });
  }
}
