import { cache } from "react";
import type { Category, MediaItem, Post, Tag } from "@/types/content";
import { categories, posts, tags } from "@/lib/content/sample-data";
import { extractToc, normalizeContentHeadings } from "@/lib/content/toc";
import { getRelatedPosts } from "@/lib/content/related-posts";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

export const getPublishedPosts = cache(async (): Promise<Post[]> => {
  const db = getFirebaseAdminDb();

  if (!db) {
    return posts
      .filter((post) => post.status === "published")
      .map((post) => ({
        ...post,
        content: normalizeContentHeadings(post.content)
      }));
  }

  const snapshot = await db
    .collection("posts")
    .where("status", "==", "published")
    .orderBy("publishedAt", "desc")
    .limit(24)
    .get();

  return snapshot.docs.map((item) => {
    const data = item.data() as Post;
    return {
      ...data,
      content: normalizeContentHeadings(data.content)
    };
  });
});

export const getAllPostsAdmin = cache(async (): Promise<Post[]> => {
  const db = getFirebaseAdminDb();

  if (!db) {
    return posts.map((post) => ({
      ...post,
      content: normalizeContentHeadings(post.content)
    }));
  }

  const snapshot = await db.collection("posts").orderBy("updatedAt", "desc").get();
  return snapshot.docs.map((item) => {
    const data = item.data() as Post;
    return {
      ...data,
      content: normalizeContentHeadings(data.content)
    };
  });
});

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  const allPosts = await getPublishedPosts();
  return allPosts.find((post) => post.slug === slug) || null;
});

export const getPostById = cache(async (id: string): Promise<Post | null> => {
  const allPosts = await getAllPostsAdmin();
  return allPosts.find((post) => post.id === id) || null;
});

export const getCategories = cache(async (): Promise<Category[]> => {
  const db = getFirebaseAdminDb();

  if (!db) return categories;

  const snapshot = await db.collection("categories").orderBy("name", "asc").get();
  return snapshot.docs.map((item) => item.data() as Category);
});

export const getCategoryBySlug = cache(async (slug: string) => {
  const allCategories = await getCategories();
  return allCategories.find((category) => category.slug === slug) || null;
});

export const getTags = cache(async (): Promise<Tag[]> => {
  const db = getFirebaseAdminDb();
  if (!db) return tags;

  const snapshot = await db.collection("tags").orderBy("name", "asc").get();
  return snapshot.docs.map((item) => item.data() as Tag);
});

export const getMedia = cache(async (): Promise<MediaItem[]> => {
  const db = getFirebaseAdminDb();
  if (!db) {
    return posts
      .map((post) => post.featuredImage)
      .filter((item): item is MediaItem => Boolean(item));
  }

  const snapshot = await db.collection("media").orderBy("createdAt", "desc").get();
  return snapshot.docs.map((item) => item.data() as MediaItem);
});

export async function getPostsByCategory(slug: string) {
  const allPosts = await getPublishedPosts();
  return allPosts.filter((post) => post.category.slug === slug);
}

export async function getHomePageData() {
  const [allPosts, allCategories] = await Promise.all([
    getPublishedPosts(),
    getCategories()
  ]);

  return {
    featuredPosts: allPosts.filter((post) => post.featured).slice(0, 2),
    latestPosts: allPosts.slice(0, 6),
    categories: allCategories
  };
}

export async function getPostPageData(slug: string) {
  const [post, allPosts] = await Promise.all([getPostBySlug(slug), getPublishedPosts()]);
  if (!post) return null;

  return {
    post,
    toc: extractToc(post.content),
    relatedPosts: getRelatedPosts(allPosts, post, 3),
    previousPost:
      allPosts.findIndex((item) => item.id === post.id) > 0
        ? allPosts[allPosts.findIndex((item) => item.id === post.id) - 1]
        : null,
    nextPost:
      allPosts.findIndex((item) => item.id === post.id) >= 0 &&
      allPosts.findIndex((item) => item.id === post.id) < allPosts.length - 1
        ? allPosts[allPosts.findIndex((item) => item.id === post.id) + 1]
        : null
  };
}
