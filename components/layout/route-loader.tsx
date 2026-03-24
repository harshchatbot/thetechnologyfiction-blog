import { cn } from "@/lib/utils/cn";

type RouteLoaderProps = {
  mode?: "light" | "dark";
  label?: string;
};

export function RouteLoader({
  mode = "light",
  label = "Loading the next page"
}: RouteLoaderProps) {
  const isDark = mode === "dark";

  return (
    <div
      className={cn(
        "fixed inset-0 z-[120] flex items-center justify-center px-6",
        isDark
          ? "bg-[#07111f]/94 text-white"
          : "bg-[#f7f2ea]/92 text-ink"
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div
        className={cn(
          "flex w-full max-w-sm flex-col items-center rounded-[2rem] border px-8 py-10 text-center shadow-[0_30px_80px_rgba(15,23,42,0.18)]",
          isDark
            ? "border-white/10 bg-[#0d1828]/92"
            : "border-[#d9c8a8] bg-[#fffaf2]"
        )}
      >
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="loader-ring loader-ring-outer border-accent/25" />
          <div className="loader-ring loader-ring-inner border-[#d8bc80]" />
          <div
            className={cn(
              "relative z-10 rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em]",
              isDark ? "bg-white/10 text-white" : "bg-white text-accent"
            )}
          >
            TTF
          </div>
        </div>
        <p
          className={cn(
            "mt-6 text-xs font-semibold uppercase tracking-[0.24em]",
            isDark ? "text-slate-200" : "text-[#7a5a2b]"
          )}
        >
          The Technology Fiction
        </p>
        <h2
          className={cn(
            "mt-3 text-2xl font-semibold",
            isDark ? "text-white" : "text-[#111827]"
          )}
        >
          Loading the next page
        </h2>
        <p
          className={cn(
            "mt-3 max-w-xs text-sm font-medium leading-7",
            isDark ? "text-slate-200" : "text-[#374151]"
          )}
        >
          Pulling in the next view so the experience stays smooth and responsive.
        </p>
      </div>
    </div>
  );
}
