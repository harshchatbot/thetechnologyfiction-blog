import { randomUUID } from "crypto";
import type { MediaItem } from "@/types/content";
import { getFirebaseAdminStorage } from "@/lib/firebase/admin";

export async function uploadMediaToStorage(file: File) {
  const storage = getFirebaseAdminStorage();
  if (!storage) {
    throw new Error("Firebase Storage is not configured.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = file.name.split(".").pop() || "jpg";
  const fileName = `media/${new Date().getFullYear()}/${randomUUID()}.${extension}`;
  const bucket = storage.bucket();
  const uploaded = bucket.file(fileName);

  await uploaded.save(buffer, {
    contentType: file.type,
    public: true,
    resumable: false
  });

  return {
    url: `https://storage.googleapis.com/${bucket.name}/${fileName}`,
    storagePath: fileName,
    mimeType: file.type
  };
}

export function createExternalMediaItem(input: {
  id: string;
  title: string;
  alt: string;
  caption?: string;
  url: string;
  mediaType: "image" | "video";
  mimeType?: string;
}): MediaItem {
  const now = new Date().toISOString();
  return {
    id: input.id,
    title: input.title,
    alt: input.alt,
    caption: input.caption,
    url: input.url,
    mediaType: input.mediaType,
    mimeType: input.mimeType,
    source: "external",
    createdAt: now,
    updatedAt: now
  };
}
