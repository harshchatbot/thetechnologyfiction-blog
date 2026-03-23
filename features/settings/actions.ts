"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/firebase/auth";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";
import { settingsSchema } from "@/features/settings/schema";

export async function saveSettingsAction(formData: FormData) {
  await requireAdminUser();
  const payload = settingsSchema.parse({
    siteName: formData.get("siteName"),
    siteUrl: formData.get("siteUrl"),
    siteDescription: formData.get("siteDescription"),
    defaultSeoTitle: formData.get("defaultSeoTitle"),
    defaultSeoDescription: formData.get("defaultSeoDescription"),
    organizationName: formData.get("organizationName"),
    organizationLogo: (formData.get("organizationLogo") as string) || "",
    twitterHandle: (formData.get("twitterHandle") as string) || undefined,
    adsenseClientId: (formData.get("adsenseClientId") as string) || undefined,
    adsenseAutoAdsEnabled: formData.get("adsenseAutoAdsEnabled") === "true"
  });

  const db = getFirebaseAdminDb();
  if (!db) throw new Error("Firebase Admin is not configured.");

  await db.collection("settings").doc("site").set(
    {
      ...payload,
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/settings");
}
