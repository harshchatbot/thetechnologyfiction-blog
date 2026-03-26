"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/firebase/auth";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";
import { createExternalMediaItem, uploadMediaToStorage } from "@/lib/firebase/storage";
import { mediaSchema } from "@/features/media/schema";

export async function saveMediaAction(formData: FormData) {
  await requireAdminUser();
  const sourceType = formData.get("sourceType");
  const payload = mediaSchema.parse({
    title: formData.get("title"),
    alt: formData.get("alt"),
    caption: (formData.get("caption") as string) || undefined,
    externalUrl: (formData.get("externalUrl") as string) || "",
    sourceType
  });

  const db = getFirebaseAdminDb();
  if (!db) throw new Error("Firebase Admin is not configured.");

  const file = formData.get("file") as File | null;
  const id = randomUUID();
  const now = new Date().toISOString();

  if (payload.sourceType === "firebase" && (!file || file.size === 0)) {
    throw new Error("Choose an image file to upload.");
  }

  if (payload.sourceType === "external" && !payload.externalUrl) {
    throw new Error("Add an external image URL.");
  }

  const media =
    payload.sourceType === "firebase"
      ? await uploadMediaToStorage(file as File).then((uploaded) => ({
          id,
          title: payload.title,
          alt: payload.alt,
          ...(payload.caption ? { caption: payload.caption } : {}),
          url: uploaded.url,
          storagePath: uploaded.storagePath,
          source: "firebase" as const,
          createdAt: now,
          updatedAt: now
        }))
      : createExternalMediaItem({
          id,
          title: payload.title,
          alt: payload.alt,
          caption: payload.caption,
          url: payload.externalUrl ?? ""
        });

  await db.collection("media").doc(id).set(media);
  revalidatePath("/admin/media");
  revalidatePath("/admin/posts");
  revalidatePath("/admin/posts/new");
}

export async function deleteMediaAction(formData: FormData) {
  await requireAdminUser();
  const id = formData.get("id") as string;
  const db = getFirebaseAdminDb();
  if (!db) throw new Error("Firebase Admin is not configured.");

  const inUse = await db.collection("posts").where("featuredImage.id", "==", id).limit(1).get();
  if (!inUse.empty) {
    throw new Error("This media item is still used as a featured image in at least one post.");
  }

  await db.collection("media").doc(id).set(
    {
      archived: true,
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );

  revalidatePath("/admin/media");
  redirect("/admin/media");
}
