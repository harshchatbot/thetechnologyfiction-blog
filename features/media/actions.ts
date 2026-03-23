"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/firebase/auth";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";
import { createExternalMediaItem, uploadMediaToStorage } from "@/lib/firebase/storage";
import { mediaSchema } from "@/features/media/schema";

export async function saveMediaAction(formData: FormData) {
  await requireAdminUser();
  const payload = mediaSchema.parse({
    title: formData.get("title"),
    alt: formData.get("alt"),
    caption: (formData.get("caption") as string) || undefined,
    externalUrl: (formData.get("externalUrl") as string) || "",
    sourceType: formData.get("sourceType")
  });

  const db = getFirebaseAdminDb();
  if (!db) throw new Error("Firebase Admin is not configured.");

  const file = formData.get("file") as File | null;
  const id = randomUUID();
  const now = new Date().toISOString();

  const media =
    payload.sourceType === "firebase" && file && file.size > 0
      ? (() => {
          return uploadMediaToStorage(file).then((uploaded) => ({
            id,
            title: payload.title,
            alt: payload.alt,
            caption: payload.caption,
            url: uploaded.url,
            storagePath: uploaded.storagePath,
            source: "firebase" as const,
            createdAt: now,
            updatedAt: now
          }));
        })()
      : Promise.resolve(
          createExternalMediaItem({
            id,
            title: payload.title,
            alt: payload.alt,
            caption: payload.caption,
            url: payload.externalUrl ?? ""
          })
        );

  await db.collection("media").doc(id).set(await media);
  revalidatePath("/admin/media");
}
