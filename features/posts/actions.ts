"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Post } from "@/types/content";
import { requireAdminUser } from "@/lib/firebase/auth";
import { getCategories, getMedia, getPostById, getTags } from "@/lib/content/repository";
import { postFormSchema } from "@/features/posts/schema";
import { slugify } from "@/lib/utils/format";
import { deepOmitUndefined } from "@/lib/utils/object";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

function parsePostFormData(formData: FormData) {
  return postFormSchema.parse({
    id: (formData.get("id") as string) || undefined,
    title: formData.get("title"),
    slug: formData.get("slug"),
    subtitle: formData.get("subtitle"),
    excerpt: formData.get("excerpt"),
    categoryId: formData.get("categoryId"),
    tagIds: JSON.parse((formData.get("tagIds") as string) || "[]"),
    featuredImageId: (formData.get("featuredImageId") as string) || undefined,
    contentJson: formData.get("contentJson"),
    contentHtml: (formData.get("contentHtml") as string) || undefined,
    status: formData.get("status"),
    featured: formData.get("featured") === "true",
    publishDate: (formData.get("publishDate") as string) || undefined,
    seoTitle: (formData.get("seoTitle") as string) || undefined,
    seoDescription: (formData.get("seoDescription") as string) || undefined,
    canonicalUrl: (formData.get("canonicalUrl") as string) || undefined,
    focusKeyword: (formData.get("focusKeyword") as string) || undefined
  });
}

export async function savePostAction(formData: FormData) {
  try {
    await requireAdminUser();
    const payload = parsePostFormData(formData);
    const db = getFirebaseAdminDb();

    if (!db) {
      throw new Error("Configure Firebase Admin credentials before writing content.");
    }

    const [allCategories, allTags, allMedia, existing] = await Promise.all([
      getCategories(),
      getTags(),
      getMedia(),
      payload.id ? getPostById(payload.id) : Promise.resolve(null)
    ]);

    const category = allCategories.find((item) => item.id === payload.categoryId);
    if (!category) {
      throw new Error("Selected category was not found.");
    }

    const selectedTags = allTags.filter((tag) => payload.tagIds.includes(tag.id));
    const featuredImage = payload.featuredImageId
      ? allMedia.find((item) => item.id === payload.featuredImageId)
      : undefined;

    const now = new Date().toISOString();
    const id = payload.id || randomUUID();
    const slug = slugify(payload.slug || payload.title);
    const content = JSON.parse(payload.contentJson);

    const post: Post = deepOmitUndefined({
      id,
      slug,
      title: payload.title,
      subtitle: payload.subtitle,
      excerpt: payload.excerpt,
      featuredImage,
      category,
      categories: [category],
      tags: selectedTags,
      tagIds: selectedTags.map((tag) => tag.id),
      author: existing?.author || {
        id: "admin-author",
        name: "The Technology Fiction",
        role: "Editorial Team"
      },
      content,
      contentHtml: payload.contentHtml,
      status: payload.status,
      featured: payload.featured,
      readingTime: Math.max(3, Math.ceil(JSON.stringify(content).split(/\s+/).length / 220)),
      publishedAt:
        payload.status === "published"
          ? payload.publishDate || existing?.publishedAt || now
          : existing?.publishedAt,
      updatedAt: now,
      createdAt: existing?.createdAt || now,
      seo: {
        seoTitle: payload.seoTitle,
        seoDescription: payload.seoDescription,
        canonicalUrl: payload.canonicalUrl,
        focusKeyword: payload.focusKeyword,
        ogImage: featuredImage?.url
      }
    });

    console.log("[savePostAction] Saving post", {
      id,
      slug,
      status: payload.status,
      hasFeaturedImage: Boolean(featuredImage),
      tagCount: selectedTags.length
    });

    await db.collection("posts").doc(id).set(post, { merge: true });

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/posts");
    revalidatePath(`/blog/${slug}`);
    revalidatePath(`/category/${category.slug}`);
    redirect(`/admin/posts/${id}/edit?saved=${post.status}`);
  } catch (error) {
    console.error("[savePostAction] Failed to save post", error);
    throw error;
  }
}

export async function archivePostAction(formData: FormData) {
  await requireAdminUser();
  const id = formData.get("id") as string;
  const db = getFirebaseAdminDb();
  if (!db) throw new Error("Firebase Admin is not configured.");

  await db.collection("posts").doc(id).set(
    {
      status: "archived",
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );

  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}
