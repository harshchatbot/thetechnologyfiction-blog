import { cache } from "react";
import type { Category, MediaItem, Post, Tag } from "@/types/content";
import { categories, posts, tags } from "@/lib/content/sample-data";
import { extractToc, normalizeContentHeadings } from "@/lib/content/toc";
import { getRelatedPosts } from "@/lib/content/related-posts";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

function isLegacyWordPressUploadUrl(url?: string) {
  return /thetechnologyfiction\.com/.test(String(url || "")) && /\/wp-content\/uploads\//.test(String(url || ""));
}

function isPreferredMediaCandidate(item: MediaItem) {
  if (item.archived) return false;
  if (item.source === "firebase") return true;
  return !isLegacyWordPressUploadUrl(item.url);
}

function compareMediaPriority(left: MediaItem, right: MediaItem) {
  const leftScore = left.source === "firebase" ? 2 : 1;
  const rightScore = right.source === "firebase" ? 2 : 1;
  if (leftScore !== rightScore) return rightScore - leftScore;
  return right.updatedAt.localeCompare(left.updatedAt);
}

function normalizePosts(list: Post[]) {
  return list.map((post) => ({
    ...post,
    content: normalizeContentHeadings(post.content)
  }));
}

function fallbackPublishedPosts() {
  return normalizePosts(posts.filter((post) => post.status === "published"));
}

function fallbackAllPosts() {
  return normalizePosts(posts);
}

async function withFirebaseFallback<T>(
  operation: () => Promise<T>,
  fallback: () => T
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.warn(
      "Falling back to local sample content because Firebase is unavailable.",
      error instanceof Error ? error.message : error
    );
    return fallback();
  }
}

export const getPublishedPosts = cache(async (): Promise<Post[]> => {
  const db = getFirebaseAdminDb();

  if (!db) {
    return fallbackPublishedPosts();
  }

  return withFirebaseFallback(async () => {
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
  }, fallbackPublishedPosts);
});

export const getAllPostsAdmin = cache(async (): Promise<Post[]> => {
  const db = getFirebaseAdminDb();

  if (!db) {
    return fallbackAllPosts();
  }

  return withFirebaseFallback(async () => {
    const snapshot = await db.collection("posts").orderBy("updatedAt", "desc").get();
    return snapshot.docs.map((item) => {
      const data = item.data() as Post;
      return {
        ...data,
        content: normalizeContentHeadings(data.content)
      };
    });
  }, fallbackAllPosts);
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

  return withFirebaseFallback(async () => {
    const snapshot = await db.collection("categories").orderBy("name", "asc").get();
    return snapshot.docs.map((item) => item.data() as Category);
  }, () => categories);
});

export const getCategoryBySlug = cache(async (slug: string) => {
  const allCategories = await getCategories();
  return allCategories.find((category) => category.slug === slug) || null;
});

export const getTags = cache(async (): Promise<Tag[]> => {
  const db = getFirebaseAdminDb();
  if (!db) return tags;

  return withFirebaseFallback(async () => {
    const snapshot = await db.collection("tags").orderBy("name", "asc").get();
    return snapshot.docs.map((item) => item.data() as Tag);
  }, () => tags);
});

export const getMedia = cache(async (): Promise<MediaItem[]> => {
  const db = getFirebaseAdminDb();
  if (!db) {
    return posts
      .map((post) => post.featuredImage)
      .filter((item): item is MediaItem => Boolean(item));
  }

  return withFirebaseFallback(async () => {
    const [mediaSnapshot, postsSnapshot] = await Promise.all([
      db.collection("media").orderBy("createdAt", "desc").get(),
      db.collection("posts").orderBy("updatedAt", "desc").get()
    ]);

    const mediaMap = new Map<string, MediaItem>();
    const registerMedia = (item: MediaItem) => {
      if (!isPreferredMediaCandidate(item)) return;
      const existing = mediaMap.get(item.id);
      if (!existing || compareMediaPriority(existing, item) > 0) {
        mediaMap.set(item.id, item);
      }
    };

    for (const item of mediaSnapshot.docs) {
      const mediaItem = item.data() as MediaItem;
      registerMedia(mediaItem);
    }

    for (const item of postsSnapshot.docs) {
      const post = item.data() as Post;
      if (post.featuredImage && !post.featuredImage.archived) {
        registerMedia(post.featuredImage);
      }
    }

    return Array.from(mediaMap.values()).sort((left, right) =>
      right.createdAt.localeCompare(left.createdAt)
    );
  }, () =>
    posts
      .map((post) => post.featuredImage)
      .filter((item): item is MediaItem => Boolean(item))
  );
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
