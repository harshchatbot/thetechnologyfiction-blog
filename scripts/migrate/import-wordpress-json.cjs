#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const {
  buildExternalMediaItem,
  cleanText,
  getFirebaseAdminEnv,
  loadMigrationEnv,
  logFirebaseEnvPresence,
  parseArgs,
  slugify
} = require("./wp-migrate-utils.cjs");

const projectRoot = path.resolve(__dirname, "..", "..");
const defaultInput = path.resolve(__dirname, "output", "wordpress-posts.json");

loadMigrationEnv(projectRoot);

function getFirebaseApp() {
  if (getApps().length) return getApps()[0];

  const { projectId, clientEmail, privateKey, storageBucket } = getFirebaseAdminEnv();

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin env vars are missing. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.");
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey
    }),
    storageBucket
  });
}

async function ensureCategory(db, category, cache, now, dryRun) {
  const slug = category.slug || "uncategorized";
  if (cache.has(slug)) return cache.get(slug);

  const payload = {
    id: `cat-${slug}`,
    name: category.name,
    slug,
    description: category.description || `Imported from WordPress category "${category.name}".`,
    createdAt: now,
    updatedAt: now
  };

  if (!dryRun) {
    await db.collection("categories").doc(payload.id).set(payload, { merge: true });
  }

  cache.set(slug, payload);
  return payload;
}

async function ensureTag(db, tag, cache, now, dryRun) {
  const slug = tag.slug;
  if (cache.has(slug)) return cache.get(slug);

  const payload = {
    id: `tag-${slug}`,
    name: tag.name,
    slug,
    description: tag.description || `Imported from WordPress tag "${tag.name}".`,
    createdAt: now,
    updatedAt: now
  };

  if (!dryRun) {
    await db.collection("tags").doc(payload.id).set(payload, { merge: true });
  }

  cache.set(slug, payload);
  return payload;
}

async function ensureMedia(db, post, now, dryRun) {
  if (!post.featuredImage?.url) return undefined;

  const payload = buildExternalMediaItem({
    id: post.featuredImage.id || `media-wp-${post.wordpressPostId}`,
    title: post.featuredImage.title || post.title,
    url: post.featuredImage.url,
    alt: post.featuredImage.alt || post.title,
    caption: post.featuredImage.caption || "",
    createdAt: post.createdAt || now,
    updatedAt: post.updatedAt || now
  });

  if (!dryRun) {
    await db.collection("media").doc(payload.id).set(payload, { merge: true });
  }

  return payload;
}

async function findExistingPostBySlug(db, slug) {
  const snapshot = await db.collection("posts").where("slug", "==", slug).limit(1).get();
  return snapshot.empty ? null : snapshot.docs[0];
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const input = path.resolve(projectRoot, args.input || defaultInput);
  const dryRun = args["dry-run"] === "true" || args.dryRun === "true";
  const debugEnv = args["debug-env"] === "true" || args.debugEnv === "true";
  const useFirestoreInDryRun =
    args["use-firestore"] === "true" || args.useFirestore === "true";
  const includeAllStatuses = args["all-statuses"] === "true" || args.allStatuses === "true";
  const limit = args.limit ? Number(args.limit) : undefined;
  const onDuplicate = String(args["on-duplicate"] || args.onDuplicate || "skip").toLowerCase();

  if (debugEnv) {
    logFirebaseEnvPresence();
  }

  if (!fs.existsSync(input)) {
    throw new Error(`Parsed WordPress JSON not found: ${input}`);
  }

  const parsed = JSON.parse(fs.readFileSync(input, "utf8"));
  const allPosts = Array.isArray(parsed.posts) ? parsed.posts : [];
  const filteredPosts = allPosts.filter((post) =>
    includeAllStatuses ? true : post.wordpressStatus === "publish"
  );
  const posts = typeof limit === "number" ? filteredPosts.slice(0, limit) : filteredPosts;

  if (!posts.length) {
    console.log("No posts matched the current import filters.");
    return;
  }

  let db = null;
  if (!dryRun || useFirestoreInDryRun) {
    try {
      db = getFirestore(getFirebaseApp());
    } catch (error) {
      if (!dryRun) throw error;
      console.warn(`Dry run without Firebase connection: ${error.message}`);
    }
  }

  const now = new Date().toISOString();
  const categoryCache = new Map();
  const tagCache = new Map();
  const summary = {
    selected: posts.length,
    created: 0,
    updated: 0,
    skipped: 0,
    categoriesTouched: 0,
    tagsTouched: 0,
    mediaTouched: 0
  };

  for (const post of posts) {
    const postCategories = (post.categories?.length ? post.categories : [post.primaryCategory]).filter(Boolean);
    const postTags = (post.tags || []).filter(Boolean);

    const categories = db
      ? await Promise.all(postCategories.map((category) =>
          ensureCategory(
            db,
            { ...category, slug: category.slug || slugify(category.name) },
            categoryCache,
            now,
            dryRun
          )
        ))
      : postCategories.map((category) => ({
          id: `cat-${category.slug}`,
          name: category.name,
          slug: category.slug,
          description: category.description || ""
        }));

    const tags = db
      ? await Promise.all(postTags.map((tag) =>
          ensureTag(
            db,
            { ...tag, slug: tag.slug || slugify(tag.name) },
            tagCache,
            now,
            dryRun
          )
        ))
      : postTags.map((tag) => ({
          id: `tag-${tag.slug}`,
          name: tag.name,
          slug: tag.slug,
          description: tag.description || ""
        }));

    summary.categoriesTouched += categories.length;
    summary.tagsTouched += tags.length;

    let featuredImage = post.featuredImage;
    if (db && post.featuredImage?.url) {
      featuredImage = await ensureMedia(db, post, now, dryRun);
      summary.mediaTouched += 1;
    }

    const primaryCategory = categories[0] || {
      id: "cat-uncategorized",
      name: "Uncategorized",
      slug: "uncategorized",
      description: "Imported WordPress content awaiting categorization."
    };

    const payload = {
      id: `wp-${post.wordpressPostId}`,
      slug: post.slug,
      title: post.title,
      subtitle: undefined,
      excerpt: post.excerpt,
      excerptHtml: post.excerptHtml || undefined,
      featuredImage: featuredImage || undefined,
      category: primaryCategory,
      categories: categories.length ? categories : [primaryCategory],
      tags,
      tagIds: tags.map((tag) => tag.id),
      author: {
        id: `author-wp-${slugify(post.author?.login || post.author?.displayName || "wordpress")}`,
        name: post.author?.displayName || post.author?.login || "WordPress Author",
        role: "Imported from WordPress"
      },
      content: Array.isArray(post.content) ? post.content : [],
      contentHtml: post.contentHtml || "",
      inlineImageUrls: Array.isArray(post.inlineImageUrls) ? post.inlineImageUrls : [],
      status: post.firestoreStatus || "draft",
      featured: false,
      readingTime: post.readingTime || 1,
      publishedAt: post.publishedAt || undefined,
      updatedAt: post.updatedAt || now,
      createdAt: post.createdAt || now,
      seo: {
        seoTitle: cleanText(post.meta?.seoTitle || "") || undefined,
        seoDescription: cleanText(post.meta?.seoDescription || "") || undefined,
        canonicalUrl: cleanText(post.meta?.canonicalUrl || "") || undefined,
        focusKeyword: cleanText(post.meta?.focusKeyword || "") || undefined,
        ogImage: featuredImage?.url || undefined
      },
      source: {
        platform: "wordpress",
        wordpressPostId: String(post.wordpressPostId),
        originalUrl: post.link || undefined,
        originalStatus: post.wordpressStatus || undefined,
        importedAt: now,
        exporterFile: path.relative(projectRoot, input)
      }
    };

    if (!db) {
      console.log(`[dry-run:no-firebase] ${payload.slug} -> ${payload.status}`);
      continue;
    }

    const existingDoc = await findExistingPostBySlug(db, payload.slug);
    if (existingDoc && onDuplicate === "skip") {
      summary.skipped += 1;
      console.log(`[skip:duplicate] ${payload.slug} already exists as ${existingDoc.id}`);
      continue;
    }

    const ref = existingDoc && onDuplicate === "update"
      ? existingDoc.ref
      : db.collection("posts").doc(payload.id);

    if (!dryRun) {
      await ref.set({ ...payload, id: ref.id }, { merge: true });
    }

    if (existingDoc && onDuplicate === "update") {
      summary.updated += 1;
      console.log(`[update] ${payload.slug} -> ${ref.id}${dryRun ? " (dry-run)" : ""}`);
    } else {
      summary.created += 1;
      console.log(`[create] ${payload.slug} -> ${ref.id}${dryRun ? " (dry-run)" : ""}`);
    }
  }

  console.log("");
  console.log("Import summary");
  console.log(`Selected posts: ${summary.selected}`);
  console.log(`Created: ${summary.created}`);
  console.log(`Updated: ${summary.updated}`);
  console.log(`Skipped: ${summary.skipped}`);
  console.log(`Category docs touched: ${summary.categoriesTouched}`);
  console.log(`Tag docs touched: ${summary.tagsTouched}`);
  console.log(`Media docs touched: ${summary.mediaTouched}`);
  console.log(`Mode: ${dryRun ? "dry-run" : "write"}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
