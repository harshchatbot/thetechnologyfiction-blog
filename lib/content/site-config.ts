import type { SiteSettings } from "@/types/content";

export const siteConfig: SiteSettings = {
  siteName: "The Technology Fiction",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  siteDescription:
    "A modern technology publication exploring Salesforce, AI, career growth, tutorials, and entrepreneurship with an editorial lens.",
  defaultSeoTitle: "The Technology Fiction | Technology, AI, Salesforce, and Career Growth",
  defaultSeoDescription:
    "Premium editorial content for technologists building modern careers, products, and businesses.",
  adsenseClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
  adsenseAutoAdsEnabled:
    process.env.NEXT_PUBLIC_ADSENSE_AUTO_ADS_ENABLED === "true",
  organizationName: "The Technology Fiction",
  organizationLogo: "/tech_fi_logo_512x512_image.jpeg",
  twitterHandle: "@technologyfiction"
};
