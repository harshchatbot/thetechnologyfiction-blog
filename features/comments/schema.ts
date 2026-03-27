import { z } from "zod";

export const publicCommentSchema = z.object({
  postId: z.string().min(1),
  postSlug: z.string().min(1),
  postTitle: z.string().min(1),
  authorName: z.string().min(2).max(80),
  authorEmail: z.string().email().max(160),
  content: z.string().min(8).max(2000),
  company: z.string().max(0).optional(),
  formStartedAt: z.string().min(1)
});
