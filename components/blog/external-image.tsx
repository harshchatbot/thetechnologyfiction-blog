"use client";

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
  return (
    <div className={wrapperClassName}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        referrerPolicy="no-referrer"
        className={className}
      />
    </div>
  );
}
