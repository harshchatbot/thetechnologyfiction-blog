import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where
} from "firebase/firestore";
import type { Category, MediaItem, Post, Tag } from "@/types/content";
import { firebaseDb } from "@/lib/firebase/client";
import { categories, posts, tags } from "@/lib/content/sample-data";

function ensureClientDb() {
  if (!firebaseDb) {
    throw new Error("Firebase client is not configured.");
  }
  return firebaseDb;
}

export async function fetchPublishedPostsClient() {
  if (!firebaseDb) return posts;

  const db = ensureClientDb();
  const postsQuery = query(
    collection(db, "posts"),
    where("status", "==", "published"),
    orderBy("publishedAt", "desc"),
    limit(24)
  );

  const snapshot = await getDocs(postsQuery);
  return snapshot.docs.map((item: any) => item.data() as Post);
}

export async function fetchPostBySlugClient(slug: string) {
  if (!firebaseDb) return posts.find((post) => post.slug === slug) || null;

  const db = ensureClientDb();
  const postsQuery = query(
    collection(db, "posts"),
    where("slug", "==", slug),
    limit(1)
  );
  const snapshot = await getDocs(postsQuery);
  return snapshot.docs[0]?.data() as Post | undefined | null;
}

export async function fetchCategoriesClient() {
  if (!firebaseDb) return categories;
  const db = ensureClientDb();
  const snapshot = await getDocs(collection(db, "categories"));
  return snapshot.docs.map((item: any) => item.data() as Category);
}

export async function fetchTagsClient() {
  if (!firebaseDb) return tags;
  const db = ensureClientDb();
  const snapshot = await getDocs(collection(db, "tags"));
  return snapshot.docs.map((item: any) => item.data() as Tag);
}

export async function fetchMediaClient() {
  if (!firebaseDb) return [] as MediaItem[];
  const db = ensureClientDb();
  const snapshot = await getDocs(collection(db, "media"));
  return snapshot.docs.map((item: any) => item.data() as MediaItem);
}

export async function fetchPostDocumentClient(id: string) {
  if (!firebaseDb) return posts.find((post) => post.id === id) || null;
  const db = ensureClientDb();
  const snapshot = await getDoc(doc(db, "posts", id));
  return snapshot.data() as Post | undefined | null;
}
