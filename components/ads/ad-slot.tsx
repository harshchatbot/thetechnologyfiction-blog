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
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
};

export function AdSlot({ slot, format = "auto", className }: AdSlotProps) {
  useEffect(() => {
    if (!siteConfig.adsenseClientId || !slot) return;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ignore ad push errors in local preview and before AdSense approval.
    }
  }, [slot]);

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

  return (
    <div className={cn("overflow-hidden rounded-3xl bg-white/70", className)}>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={siteConfig.adsenseClientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
