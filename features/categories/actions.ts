"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/firebase/auth";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";
import { categorySchema } from "@/features/categories/schema";

export async function saveCategoryAction(formData: FormData) {
  await requireAdminUser();
  const payload = categorySchema.parse({
    id: (formData.get("id") as string) || undefined,
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    color: formData.get("color")
  });
  const db = getFirebaseAdminDb();
  if (!db) throw new Error("Firebase Admin is not configured.");

  const now = new Date().toISOString();
  const id = payload.id || randomUUID();
  await db
    .collection("categories")
    .doc(id)
    .set(
      {
        ...payload,
        id,
        createdAt: now,
        updatedAt: now
      },
      { merge: true }
    );

  revalidatePath("/admin/categories");
  revalidatePath("/blog");
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdminUser();
  const id = formData.get("id") as string;
  const db = getFirebaseAdminDb();
  if (!db) throw new Error("Firebase Admin is not configured.");

  const inUse = await db.collection("posts").where("category.id", "==", id).limit(1).get();
  if (!inUse.empty) {
    throw new Error("This category is still used by at least one post.");
  }

  await db.collection("categories").doc(id).delete();
  revalidatePath("/admin/categories");
  revalidatePath("/blog");
  redirect("/admin/categories");
}
