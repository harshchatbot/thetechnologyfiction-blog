import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { AdminUser } from "@/types/content";
import { getFirebaseAdminAuth } from "@/lib/firebase/admin";

const SESSION_COOKIE_NAME =
  process.env.FIREBASE_SESSION_COOKIE_NAME || "ttf_admin_session";

export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) return null;

  const auth = getFirebaseAdminAuth();
  if (!auth) return null;

  try {
    const decoded = await auth.verifySessionCookie(sessionCookie, true);
    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    if (!decoded.email || !adminEmails.includes(decoded.email.toLowerCase())) {
      return null;
    }

    return {
      uid: decoded.uid,
      email: decoded.email,
      displayName: decoded.name,
      role: "admin"
    };
  } catch {
    return null;
  }
}

export async function requireAdminUser() {
  const user = await getCurrentAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}
