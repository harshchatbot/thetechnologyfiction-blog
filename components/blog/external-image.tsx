"use client";

import { useMemo, useState } from "react";
import { getWordPressMediaCandidates } from "@/lib/content/media";

type ExternalImageProps = {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  loading?: "lazy" | "eager";
};

export function ExternalImage({
  src,
  alt,
  className,
  wrapperClassName,
  loading = "lazy"
}: ExternalImageProps) {
  const candidates = useMemo(() => getWordPressMediaCandidates(src), [src]);
  const [index, setIndex] = useState(0);

  return (
    <div className={wrapperClassName}>
      <img
        src={candidates[index] || src}
        alt={alt}
        loading={loading}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={() => {
          if (index < candidates.length - 1) {
            setIndex(index + 1);
          }
        }}
        className={className}
      />
    </div>
  );
}
