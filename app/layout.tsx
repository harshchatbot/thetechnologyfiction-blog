import type { Metadata } from "next";
import "@/app/globals.css";
import { siteConfig } from "@/lib/content/site-config";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/layout/json-ld";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import { AdSenseScript } from "@/components/ads/adsense-script";

export const metadata: Metadata = {
  ...buildMetadata({
    title: siteConfig.defaultSeoTitle,
    description: siteConfig.defaultSeoDescription
  }),
  icons: {
    icon: "/tech_fi_logo_512x512_image.jpeg",
    shortcut: "/tech_fi_logo_512x512_image.jpeg",
    apple: "/tech_fi_logo_512x512_image.jpeg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="font-[var(--font-sans)]">
        <AdSenseScript />
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        {children}
      </body>
    </html>
  );
}
