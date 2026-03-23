"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/firebase/auth";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";
import { tagSchema } from "@/features/tags/schema";

export async function saveTagAction(formData: FormData) {
  await requireAdminUser();
  const payload = tagSchema.parse({
    id: (formData.get("id") as string) || undefined,
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: (formData.get("description") as string) || undefined
  });
  const db = getFirebaseAdminDb();
  if (!db) throw new Error("Firebase Admin is not configured.");

  const id = payload.id || randomUUID();
  const now = new Date().toISOString();
  await db.collection("tags").doc(id).set(
    {
      ...payload,
      id,
      createdAt: now,
      updatedAt: now
    },
    { merge: true }
  );

  revalidatePath("/admin/tags");
}
