import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";

const COOKIE_NAME = process.env.FIREBASE_SESSION_COOKIE_NAME || "ttf_admin_session";
const EXPIRES_IN = Number(process.env.FIREBASE_SESSION_EXPIRES_IN || "432000000");

export async function POST(request: Request) {
  const auth = getFirebaseAdminAuth();
  if (!auth) {
    return NextResponse.json(
      { error: "Firebase Admin Auth is not configured." },
      { status: 500 }
    );
  }

  const { token } = await request.json();
  const sessionCookie = await auth.createSessionCookie(token, { expiresIn: EXPIRES_IN });
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: EXPIRES_IN / 1000
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
