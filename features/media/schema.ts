import { z } from "zod";

export const mediaSchema = z.object({
  title: z.string().min(2),
  alt: z.string().min(2),
  caption: z.string().optional(),
  externalUrl: z.string().url().optional().or(z.literal("")),
  sourceType: z.enum(["external", "firebase"])
});
