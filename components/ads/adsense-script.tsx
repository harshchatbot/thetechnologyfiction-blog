import Script from "next/script";
import { siteConfig } from "@/lib/content/site-config";

export function AdSenseScript() {
  if (!siteConfig.adsenseClientId || !siteConfig.adsenseAutoAdsEnabled) {
    return null;
  }

  return (
    <Script
      id="adsense-auto-ads"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsenseClientId}`}
      crossOrigin="anonymous"
    />
  );
}
