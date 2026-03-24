#!/usr/bin/env node

const path = require("path");
const crypto = require("crypto");
const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
const {
  deepOmitUndefined,
  getFirebaseAdminEnv,
  loadMigrationEnv,
  logFirebaseEnvPresence,
  parseArgs
} = require("./wp-migrate-utils.cjs");

const projectRoot = path.resolve(__dirname, "..", "..");
loadMigrationEnv(projectRoot);

function getFirebaseApp() {
  if (getApps().length) return getApps()[0];

  const { projectId, clientEmail, privateKey, storageBucket } = getFirebaseAdminEnv();

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin env vars are missing. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket
  });
}

function getServices() {
  const app = getFirebaseApp();
  const db = getFirestore(app);
  db.settings({ ignoreUndefinedProperties: true });
  const storage = getStorage(app);
  return { db, storage };
}

function isFirebaseStorageUrl(value) {
  return /storage.googleapis.com|firebasestorage.googleapis.com/.test(String(value || ""));
}

function isWordPressUrl(value) {
  return /thetechnologyfiction\.com/.test(String(value || "")) && /\/wp-content\/uploads\//.test(String(value || ""));
}

function getCandidateUrls(value) {
  const candidates = new Set([value]);

  try {
    const url = new URL(value);
    const paths = new Set([url.pathname]);
    if (url.pathname.startsWith("/blog/wp-content/uploads/")) {
      paths.add(url.pathname.replace("/blog/wp-content/uploads/", "/wp-content/uploads/"));
    }
    if (url.pathname.startsWith("/wp-content/uploads/")) {
      paths.add(`/blog${url.pathname}`);
    }

    const hosts = new Set([url.hostname]);
    if (url.hostname.startsWith("www.")) {
      hosts.add(url.hostname.replace(/^www\./, ""));
    } else {
      hosts.add(`www.${url.hostname}`);
    }

    const protocols = new Set([url.protocol, "https:", "http:"]);

    for (const protocol of protocols) {
      for (const host of hosts) {
        for (const pathname of paths) {
          const candidate = new URL(value);
          candidate.protocol = protocol;
          candidate.hostname = host;
          candidate.pathname = pathname;
          candidates.add(candidate.toString());
        }
      }
    }
  } catch {
    return Array.from(candidates);
  }

  return Array.from(candidates);
}

function guessExtension(url, contentType) {
  const pathname = (() => {
    try {
      return new URL(url).pathname;
    } catch {
      return "";
    }
  })();

  const fromPath = pathname.split(".").pop();
  if (fromPath && fromPath.length <= 5) {
    return fromPath.toLowerCase();
  }

  if (contentType?.includes("webp")) return "webp";
  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("jpeg") || contentType?.includes("jpg")) return "jpg";
  return "bin";
}

async function fetchFirstAvailable(url) {
  const candidates = getCandidateUrls(url);

  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate, {
        redirect: "follow",
        headers: {
          "user-agent": "Mozilla/5.0 TheTechnologyFictionMediaMigrator/1.0"
        }
      });

      if (!response.ok) continue;

      const arrayBuffer = await response.arrayBuffer();
      return {
        url: candidate,
        buffer: Buffer.from(arrayBuffer),
        contentType: response.headers.get("content-type") || undefined
      };
    } catch {
      continue;
    }
  }

  return null;
}

async function uploadToFirebaseStorage(storage, input) {
  const bucket = storage.bucket();
  const hash = crypto.createHash("sha1").update(input.originalUrl).digest("hex");
  const extension = guessExtension(input.originalUrl, input.contentType);
  const filePath = `wordpress-imports/${new Date().getFullYear()}/${hash}.${extension}`;
  const file = bucket.file(filePath);

  const [exists] = await file.exists();
  if (!exists) {
    await file.save(input.buffer, {
      contentType: input.contentType,
      public: true,
      resumable: false
    });
  }

  return {
    url: `https://storage.googleapis.com/${bucket.name}/${filePath}`,
    storagePath: filePath
  };
}

function replaceUrlInContentHtml(contentHtml, oldUrl, newUrl) {
  return String(contentHtml || "").split(oldUrl).join(newUrl);
}

function rewritePostImages(post, replacements) {
  const nextPost = { ...post };

  if (nextPost.featuredImage?.url && replacements[nextPost.featuredImage.url]) {
    nextPost.featuredImage = {
      ...nextPost.featuredImage,
      url: replacements[nextPost.featuredImage.url].url,
      storagePath: replacements[nextPost.featuredImage.url].storagePath,
      source: "firebase"
    };
  }

  if (Array.isArray(nextPost.inlineImageUrls)) {
    nextPost.inlineImageUrls = nextPost.inlineImageUrls.map((url) =>
      replacements[url] ? replacements[url].url : url
    );
  }

  if (Array.isArray(nextPost.content)) {
    nextPost.content = nextPost.content.map((node) => {
      if (node?.type === "image" && replacements[node.src]) {
        return {
          ...node,
          src: replacements[node.src].url
        };
      }
      return node;
    });
  }

  if (nextPost.contentHtml) {
    let updatedHtml = nextPost.contentHtml;
    for (const [oldUrl, replacement] of Object.entries(replacements)) {
      updatedHtml = replaceUrlInContentHtml(updatedHtml, oldUrl, replacement.url);
    }
    nextPost.contentHtml = updatedHtml;
  }

  nextPost.updatedAt = new Date().toISOString();
  return deepOmitUndefined(nextPost);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const dryRun = args["dry-run"] === "true" || args.dryRun === "true";
  const debugEnv = args["debug-env"] === "true" || args.debugEnv === "true";
  const limit = args.limit ? Number(args.limit) : undefined;

  if (debugEnv) {
    logFirebaseEnvPresence();
  }

  const { db, storage } = getServices();

  const snapshot = await db
    .collection("posts")
    .where("source.platform", "==", "wordpress")
    .orderBy("publishedAt", "desc")
    .get();

  const posts = (typeof limit === "number" ? snapshot.docs.slice(0, limit) : snapshot.docs).map(
    (doc) => ({ id: doc.id, ...doc.data() })
  );

  const replacementCache = new Map();
  const summary = {
    selectedPosts: posts.length,
    updatedPosts: 0,
    migratedImages: 0,
    skippedImages: 0,
    failedImages: 0
  };

  for (const post of posts) {
    const candidateUrls = new Set();
    if (post.featuredImage?.url && isWordPressUrl(post.featuredImage.url)) {
      candidateUrls.add(post.featuredImage.url);
    }
    for (const url of post.inlineImageUrls || []) {
      if (isWordPressUrl(url)) candidateUrls.add(url);
    }
    for (const node of post.content || []) {
      if (node?.type === "image" && isWordPressUrl(node.src)) {
        candidateUrls.add(node.src);
      }
    }

    if (!candidateUrls.size) continue;

    const replacements = {};

    for (const url of candidateUrls) {
      if (isFirebaseStorageUrl(url)) {
        summary.skippedImages += 1;
        continue;
      }

      if (replacementCache.has(url)) {
        replacements[url] = replacementCache.get(url);
        summary.skippedImages += 1;
        continue;
      }

      const fetched = await fetchFirstAvailable(url);
      if (!fetched) {
        summary.failedImages += 1;
        console.log(`[image-failed] ${post.slug} -> ${url}`);
        continue;
      }

      if (dryRun) {
        replacements[url] = {
          url: `dry-run://${path.basename(fetched.url)}`,
          storagePath: "dry-run"
        };
        summary.migratedImages += 1;
        console.log(`[image-dry-run] ${post.slug} -> ${url}`);
        continue;
      }

      const uploaded = await uploadToFirebaseStorage(storage, {
        originalUrl: url,
        buffer: fetched.buffer,
        contentType: fetched.contentType
      });

      replacementCache.set(url, uploaded);
      replacements[url] = uploaded;
      summary.migratedImages += 1;
      console.log(`[image-migrated] ${post.slug} -> ${uploaded.url}`);
    }

    if (!Object.keys(replacements).length) continue;

    const updatedPost = rewritePostImages(post, replacements);
    if (!dryRun) {
      await db.collection("posts").doc(post.id).set(updatedPost, { merge: true });
    }
    summary.updatedPosts += 1;
    console.log(`[post-updated] ${post.slug}`);
  }

  console.log("");
  console.log("Media migration summary");
  console.log(`Selected posts: ${summary.selectedPosts}`);
  console.log(`Updated posts: ${summary.updatedPosts}`);
  console.log(`Migrated images: ${summary.migratedImages}`);
  console.log(`Skipped images: ${summary.skippedImages}`);
  console.log(`Failed images: ${summary.failedImages}`);
  console.log(`Mode: ${dryRun ? "dry-run" : "write"}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exit(1);
});
