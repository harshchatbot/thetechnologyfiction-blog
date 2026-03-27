"use server";

import { createHash, randomUUID } from "crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { Comment, CommentStatus } from "@/types/content";
import { publicCommentSchema } from "@/features/comments/schema";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";
import { requireAdminUser } from "@/lib/firebase/auth";
import { deepOmitUndefined } from "@/lib/utils/object";

const SUSPICIOUS_PATTERNS = [
  /essay writing/i,
  /dissertation/i,
  /casino/i,
  /viagra/i,
  /loan/i,
  /backlink/i,
  /seo service/i,
  /crypto/i,
  /telegram/i,
  /whatsapp/i
];

function scoreCommentSpam(input: {
  company?: string;
  content: string;
  formStartedAt: string;
  authorName: string;
}) {
  let spamScore = 0;
  const notes: string[] = [];

  if (input.company?.trim()) {
    spamScore += 10;
    notes.push("Honeypot field was filled.");
  }

  const startedAt = Number(input.formStartedAt);
  if (Number.isFinite(startedAt) && Date.now() - startedAt < 4000) {
    spamScore += 3;
    notes.push("Form submitted too quickly.");
  }

  const linkCount = (input.content.match(/https?:\/\//gi) || []).length;
  if (linkCount > 2) {
    spamScore += 4;
    notes.push("Too many links in comment body.");
  }

  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(input.content) || pattern.test(input.authorName)) {
      spamScore += 4;
      notes.push(`Matched suspicious pattern: ${pattern}`);
    }
  }

  return { spamScore, moderationNotes: notes.join(" ") || undefined };
}

function hashContent(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function submitCommentAction(formData: FormData) {
  const payload = publicCommentSchema.parse({
    postId: formData.get("postId"),
    postSlug: formData.get("postSlug"),
    postTitle: formData.get("postTitle"),
    authorName: formData.get("authorName"),
    authorEmail: formData.get("authorEmail"),
    content: formData.get("content"),
    company: formData.get("company"),
    formStartedAt: formData.get("formStartedAt")
  });

  const db = getFirebaseAdminDb();
  if (!db) {
    throw new Error("Comments are unavailable until Firebase Admin is configured.");
  }

  const normalizedContent = payload.content.trim();
  const normalizedEmail = payload.authorEmail.trim().toLowerCase();
  const { spamScore, moderationNotes } = scoreCommentSpam({
    company: payload.company,
    content: normalizedContent,
    formStartedAt: payload.formStartedAt,
    authorName: payload.authorName
  });

  const duplicateSnapshot = await db
    .collection("comments")
    .where("postId", "==", payload.postId)
    .where("authorEmail", "==", normalizedEmail)
    .limit(20)
    .get();

  const normalizedHash = hashContent(normalizedContent);
  const isDuplicate = duplicateSnapshot.docs.some((doc) => {
    const existing = doc.data() as Partial<Comment> & { content?: string };
    return hashContent(existing.content || "") === normalizedHash;
  });

  let status: CommentStatus = "pending";
  let finalNotes = moderationNotes;

  if (isDuplicate) {
    status = "spam";
    finalNotes = [moderationNotes, "Duplicate comment submission."].filter(Boolean).join(" ");
  } else if (spamScore >= 6) {
    status = "spam";
  } else if (spamScore >= 3) {
    status = "rejected";
  }

  const forwardedFor = (await headers()).get("x-forwarded-for") || "";
  const comment: Comment = deepOmitUndefined({
    id: randomUUID(),
    postId: payload.postId,
    postSlug: payload.postSlug,
    postTitle: payload.postTitle,
    authorName: payload.authorName.trim(),
    authorEmail: normalizedEmail,
    content: normalizedContent,
    status,
    spamScore,
    moderationNotes: finalNotes,
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: "public-form"
  });

  await db.collection("comments").doc(comment.id).set({
    ...comment,
    ipHash: forwardedFor ? hashContent(forwardedFor) : undefined
  });

  revalidatePath(`/blog/${payload.postSlug}`);

  return {
    ok: true,
    status,
    message:
      status === "pending"
        ? "Your comment was received and is waiting for review."
        : "Your comment was received."
  };
}

export async function approveCommentAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") || "");
  const db = getFirebaseAdminDb();
  if (!db) throw new Error("Firebase Admin is not configured.");

  const snapshot = await db.collection("comments").doc(id).get();
  if (!snapshot.exists) throw new Error("Comment not found.");
  const comment = snapshot.data() as Comment;

  await db.collection("comments").doc(id).set(
    {
      status: "approved",
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );

  revalidatePath(`/blog/${comment.postSlug}`);
  revalidatePath("/admin/comments");
}

export async function rejectCommentAction(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id") || "");
  const db = getFirebaseAdminDb();
  if (!db) throw new Error("Firebase Admin is not configured.");

  const snapshot = await db.collection("comments").doc(id).get();
  if (!snapshot.exists) throw new Error("Comment not found.");
  const comment = snapshot.data() as Comment;

  await db.collection("comments").doc(id).set(
    {
      status: "rejected",
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );

  revalidatePath(`/blog/${comment.postSlug}`);
  revalidatePath("/admin/comments");
}
