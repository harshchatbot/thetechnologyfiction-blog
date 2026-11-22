type RouteLoaderProps = {
  mode?: "light" | "dark";
  label?: string;
};

/** Theme-aware, motion-safe route transition. No layout shift or external assets. */
export function RouteLoader({ label = "Loading content" }: RouteLoaderProps) {
  return (
    <div className="ttf-page-loader" role="status" aria-live="polite" aria-label={label}>
      <div className="ttf-page-loader__mark" aria-hidden="true">
        <span className="ttf-page-loader__orbit ttf-page-loader__orbit--outer" />
        <span className="ttf-page-loader__orbit ttf-page-loader__orbit--inner" />
        <span className="ttf-page-loader__core">TTF</span>
      </div>
      <span className="ttf-eyebrow ttf-page-loader__brand">The Technology Fiction</span>
      <span className="ttf-page-loader__caption">{label}</span>
    </div>
  );
}
