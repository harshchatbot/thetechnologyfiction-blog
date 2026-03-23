import { z } from "zod";

export const settingsSchema = z.object({
  siteName: z.string().min(2),
  siteUrl: z.string().url(),
  siteDescription: z.string().min(10),
  defaultSeoTitle: z.string().min(5),
  defaultSeoDescription: z.string().min(10),
  organizationName: z.string().min(2),
  organizationLogo: z.string().url().optional().or(z.literal("")),
  twitterHandle: z.string().optional(),
  adsenseClientId: z.string().optional(),
  adsenseAutoAdsEnabled: z.boolean().default(false)
});
