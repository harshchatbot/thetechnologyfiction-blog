import { z } from "zod";

export const postFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5),
  slug: z.string().min(3),
  subtitle: z.string().optional(),
  excerpt: z.string().min(20),
  categoryId: z.string().min(1),
  tagIds: z.array(z.string()).default([]),
  featuredImageId: z.string().optional(),
  contentJson: z.string().min(2),
  contentHtml: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  featured: z.boolean().default(false),
  publishDate: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
  focusKeyword: z.string().optional()
});

export type PostFormValues = z.infer<typeof postFormSchema>;
