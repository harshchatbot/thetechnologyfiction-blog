"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

export async function deleteTagAction(formData: FormData) {
  await requireAdminUser();
  const id = formData.get("id") as string;
  const db = getFirebaseAdminDb();
  if (!db) throw new Error("Firebase Admin is not configured.");

  const inUse = await db.collection("posts").where("tagIds", "array-contains", id).limit(1).get();
  if (!inUse.empty) {
    throw new Error("This tag is still used by at least one post.");
  }

  await db.collection("tags").doc(id).delete();
  revalidatePath("/admin/tags");
  redirect("/admin/tags");
}
