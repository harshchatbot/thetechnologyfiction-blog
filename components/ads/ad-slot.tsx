"use client";

import { useEffect } from "react";
import { siteConfig } from "@/lib/content/site-config";
import { cn } from "@/lib/utils/cn";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdSlotProps = {
  slot?: string;
  slotKey?: keyof NonNullable<typeof siteConfig.adsenseSlots>;
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
};

export function AdSlot({ slot, slotKey, format = "auto", className }: AdSlotProps) {
  const resolvedSlot = slot || (slotKey ? siteConfig.adsenseSlots?.[slotKey] : undefined);

  useEffect(() => {
    if (!siteConfig.adsenseClientId || !resolvedSlot) return;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ignore ad push errors in local preview and before AdSense approval.
    }
  }, [resolvedSlot]);

  if (!siteConfig.adsenseClientId) {
    return (
      <div
        className={cn(
          "rounded-3xl border border-dashed border-slate-300 bg-white/70 px-4 py-6 text-center text-xs uppercase tracking-[0.2em] text-slate-400",
          className
        )}
      >
        Ad slot placeholder
      </div>
    );
  }

  if (!resolvedSlot) {
    if (process.env.NODE_ENV !== "production") {
      return (
        <div
          className={cn(
            "rounded-3xl border border-dashed border-amber-300 bg-amber-50/80 px-4 py-6 text-center text-[11px] uppercase tracking-[0.2em] text-amber-700",
            className
          )}
        >
          Missing AdSense slot ID
        </div>
      );
    }
    return null;
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70",
        className
      )}
    >
      <div className="px-4 pt-3 text-center text-[10px] font-medium uppercase tracking-[0.24em] text-slate-400">
        Advertisement
      </div>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={siteConfig.adsenseClientId}
        data-ad-slot={resolvedSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
