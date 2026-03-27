import type { MediaItem } from "@/types/content";

export function inferMediaTypeFromUrl(url?: string): "image" | "video" {
  const value = String(url || "").toLowerCase();
  if (/\.(mp4|webm|mov|m4v|ogg)(\?|$)/.test(value)) {
    return "video";
  }
  return "image";
}

export function getMediaType(media?: Pick<MediaItem, "mediaType" | "mimeType" | "url"> | null) {
  if (!media) return "image" as const;
  if (media.mediaType) return media.mediaType;
  if (String(media.mimeType || "").startsWith("video/")) return "video" as const;
  return inferMediaTypeFromUrl(media.url);
}

export function isVideoMedia(media?: Pick<MediaItem, "mediaType" | "mimeType" | "url"> | null) {
  return getMediaType(media) === "video";
}
