import type { Metadata } from "next";
import "@/app/globals.css";
import { siteConfig } from "@/lib/content/site-config";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/layout/json-ld";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import { AdSenseScript } from "@/components/ads/adsense-script";

export const metadata: Metadata = buildMetadata({
  title: siteConfig.defaultSeoTitle,
  description: siteConfig.defaultSeoDescription
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-[var(--font-sans)]">
        <AdSenseScript />
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        {children}
      </body>
    </html>
  );
}
