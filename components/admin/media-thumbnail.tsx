"use client";

import { useState } from "react";
import { isVideoMedia } from "@/lib/content/media";

type Props = {
  src: string;
  alt: string;
  className?: string;
  mediaType?: "image" | "video";
  mimeType?: string;
};

export function MediaThumbnail({ src, alt, className, mediaType, mimeType }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center rounded-[1rem] border border-dashed border-slate-300 bg-white p-4 text-center text-sm leading-6 text-slate-500 ${className ?? ""}`}
      >
        Preview unavailable
      </div>
    );
  }

  if (isVideoMedia({ url: src, mediaType, mimeType })) {
    return (
      <video
        src={src}
        className={className}
        controls
        preload="metadata"
        playsInline
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
