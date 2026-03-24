#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");
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
const reportsDir = path.join(projectRoot, "scripts", "migrate", "output");

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

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function toPosix(value) {
  return String(value || "").replace(/\\/g, "/");
}

function normalizeUploadsRelativePath(value) {
  if (!value) return null;

  try {
    const url = new URL(String(value));
    const pathname = toPosix(url.pathname);
    if (pathname.includes("/blog/wp-content/uploads/")) {
      return pathname.split("/blog/wp-content/uploads/")[1] || null;
    }
    if (pathname.includes("/wp-content/uploads/")) {
      return pathname.split("/wp-content/uploads/")[1] || null;
    }
  } catch {
    const normalized = toPosix(value);
    if (normalized.includes("/blog/wp-content/uploads/")) {
      return normalized.split("/blog/wp-content/uploads/")[1] || null;
    }
    if (normalized.includes("/wp-content/uploads/")) {
      return normalized.split("/wp-content/uploads/")[1] || null;
    }
  }

  return null;
}

function getMimeType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".webp") return "image/webp";
  if (extension === ".png") return "image/png";
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".gif") return "image/gif";
  if (extension === ".svg") return "image/svg+xml";
  if (extension === ".avif") return "image/avif";
  return "application/octet-stream";
}

function buildStoragePath(relativeUploadsPath) {
  const sanitized = toPosix(relativeUploadsPath).replace(/^\/+/, "");
  return `wordpress-imports/${sanitized}`;
}

function buildPublicStorageUrl(bucketName, storagePath) {
  return `https://storage.googleapis.com/${bucketName}/${storagePath}`;
}

function replaceUrlInContentHtml(contentHtml, oldUrl, newUrl) {
  return String(contentHtml || "").split(oldUrl).join(newUrl);
}

function resolveLocalSourcePath(inputPath) {
  if (!inputPath) {
    throw new Error(
      "Missing local uploads source. Pass --source with a WordPress uploads folder or uploads.zip path."
    );
  }

  const absolutePath = path.resolve(inputPath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Local uploads source does not exist: ${absolutePath}`);
  }

  return absolutePath;
}

function prepareUploadsRoot(sourcePath) {
  const stats = fs.statSync(sourcePath);

  if (stats.isDirectory()) {
    const uploadsRoot = path.basename(sourcePath) === "uploads"
      ? sourcePath
      : path.join(sourcePath, "uploads");

    if (!fs.existsSync(uploadsRoot) || !fs.statSync(uploadsRoot).isDirectory()) {
      throw new Error(
        `Could not find an uploads directory inside ${sourcePath}. Point --source to the uploads folder or uploads.zip.`
      );
    }

    return { uploadsRoot, cleanup: () => {} };
  }

  if (!stats.isFile() || path.extname(sourcePath).toLowerCase() !== ".zip") {
    throw new Error("The local uploads source must be a directory or a .zip file.");
  }

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ttf-wp-uploads-"));
  execFileSync("unzip", ["-q", "-o", sourcePath, "-d", tempRoot], { stdio: "ignore" });

  const uploadsRoot = path.join(tempRoot, "uploads");
  if (!fs.existsSync(uploadsRoot) || !fs.statSync(uploadsRoot).isDirectory()) {
    throw new Error(`The zip file ${sourcePath} did not contain an uploads/ directory at its root.`);
  }

  return {
    uploadsRoot,
    cleanup: () => {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  };
}

function createUploadsIndex(uploadsRoot) {
  const index = new Map();
  const stack = [uploadsRoot];

  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }

      const relativePath = toPosix(path.relative(uploadsRoot, fullPath));
      index.set(relativePath, fullPath);
    }
  }

  return index;
}

function findLocalFileForLegacyUrl(legacyUrl, uploadsIndex) {
  const relativePath = normalizeUploadsRelativePath(legacyUrl);
  if (!relativePath) {
    return { relativePath: null, filePath: null };
  }

  return {
    relativePath,
    filePath: uploadsIndex.get(relativePath) || null
  };
}

async function uploadToFirebaseStorage(storage, localFilePath, relativeUploadsPath) {
  const bucket = storage.bucket();
  const storagePath = buildStoragePath(relativeUploadsPath);
  const file = bucket.file(storagePath);
  const [exists] = await file.exists();

  if (!exists) {
    await file.save(fs.readFileSync(localFilePath), {
      contentType: getMimeType(localFilePath),
      public: true,
      resumable: false,
      metadata: {
        cacheControl: "public, max-age=31536000, immutable"
      }
    });
  }

  return {
    url: buildPublicStorageUrl(bucket.name, storagePath),
    storagePath
  };
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

function createReportWriter() {
  ensureDirectory(reportsDir);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return {
    timestamp,
    successPath: path.join(reportsDir, `media-migration-success-${timestamp}.json`),
    failurePath: path.join(reportsDir, `media-migration-failures-${timestamp}.json`),
    summaryPath: path.join(reportsDir, `media-migration-summary-${timestamp}.json`)
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const dryRun = args["dry-run"] === "true" || args.dryRun === "true";
  const debugEnv = args["debug-env"] === "true" || args.debugEnv === "true";
  const debug = args.debug === "true";
  const limit = args.limit ? Number(args.limit) : undefined;
  const source = resolveLocalSourcePath(args.source || args.folder || args.path);
  const postFilter = String(args.post || "").trim();

  if (debugEnv) {
    logFirebaseEnvPresence();
  }

  const { uploadsRoot, cleanup } = prepareUploadsRoot(source);
  const uploadsIndex = createUploadsIndex(uploadsRoot);
  const { db, storage } = getServices();
  const reportFiles = createReportWriter();
  const successReport = [];
  const failureReport = [];

  try {
    const snapshot = await db
      .collection("posts")
      .where("source.platform", "==", "wordpress")
      .get();

    let posts = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((left, right) => {
        const leftDate = new Date(left.publishedAt || left.updatedAt || left.createdAt || 0).getTime();
        const rightDate = new Date(right.publishedAt || right.updatedAt || right.createdAt || 0).getTime();
        return rightDate - leftDate;
      });

    if (postFilter) {
      const postTerms = postFilter.split(",").map((item) => item.trim()).filter(Boolean);
      posts = posts.filter((post) =>
        postTerms.some((term) => post.slug === term || post.id === term)
      );
    }

    if (typeof limit === "number") {
      posts = posts.slice(0, limit);
    }

    const replacementCache = new Map();
    const summary = {
      source,
      uploadsRoot,
      indexedFiles: uploadsIndex.size,
      selectedPosts: posts.length,
      updatedPosts: 0,
      migratedImages: 0,
      skippedImages: 0,
      failedImages: 0,
      dryRun
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

      if (!candidateUrls.size) {
        if (debug) {
          console.log(`[post-skip] ${post.slug} -> no legacy wordpress images`);
        }
        continue;
      }

      const replacements = {};

      for (const legacyUrl of candidateUrls) {
        if (isFirebaseStorageUrl(legacyUrl)) {
          summary.skippedImages += 1;
          continue;
        }

        if (replacementCache.has(legacyUrl)) {
          replacements[legacyUrl] = replacementCache.get(legacyUrl);
          summary.skippedImages += 1;
          console.log(`[image-skip-cache] ${post.slug} -> ${legacyUrl}`);
          continue;
        }

        const { relativePath, filePath } = findLocalFileForLegacyUrl(legacyUrl, uploadsIndex);

        if (!relativePath || !filePath) {
          summary.failedImages += 1;
          const failure = {
            postId: post.id,
            postSlug: post.slug,
            imageUrl: legacyUrl,
            reason: "missing-local-file",
            relativePath
          };
          failureReport.push(failure);
          console.log(`[image-missing] ${post.slug} -> ${legacyUrl}`);
          continue;
        }

        if (dryRun) {
          const storagePath = buildStoragePath(relativePath);
          const simulated = {
            url: buildPublicStorageUrl(storage.bucket().name, storagePath),
            storagePath
          };
          replacementCache.set(legacyUrl, simulated);
          replacements[legacyUrl] = simulated;
          summary.migratedImages += 1;
          successReport.push({
            postId: post.id,
            postSlug: post.slug,
            imageUrl: legacyUrl,
            localFilePath: filePath,
            relativePath,
            storagePath,
            mode: "dry-run"
          });
          console.log(`[image-dry-run] ${post.slug} -> ${relativePath}`);
          continue;
        }

        const uploaded = await uploadToFirebaseStorage(storage, filePath, relativePath);
        replacementCache.set(legacyUrl, uploaded);
        replacements[legacyUrl] = uploaded;
        summary.migratedImages += 1;
        successReport.push({
          postId: post.id,
          postSlug: post.slug,
          imageUrl: legacyUrl,
          localFilePath: filePath,
          relativePath,
          storagePath: uploaded.storagePath,
          storageUrl: uploaded.url,
          mode: "write"
        });
        console.log(`[image-migrated] ${post.slug} -> ${relativePath}`);
      }

      if (!Object.keys(replacements).length) {
        continue;
      }

      const updatedPost = rewritePostImages(post, replacements);
      if (!dryRun) {
        await db.collection("posts").doc(post.id).set(updatedPost, { merge: true });
      }
      summary.updatedPosts += 1;
      console.log(`[post-updated] ${post.slug}`);
    }

    fs.writeFileSync(reportFiles.successPath, JSON.stringify(successReport, null, 2));
    fs.writeFileSync(reportFiles.failurePath, JSON.stringify(failureReport, null, 2));
    fs.writeFileSync(
      reportFiles.summaryPath,
      JSON.stringify(
        {
          ...summary,
          successReport: reportFiles.successPath,
          failureReport: reportFiles.failurePath
        },
        null,
        2
      )
    );

    console.log("");
    console.log("Media migration summary");
    console.log(`Source: ${source}`);
    console.log(`Uploads root: ${uploadsRoot}`);
    console.log(`Indexed files: ${summary.indexedFiles}`);
    console.log(`Selected posts: ${summary.selectedPosts}`);
    console.log(`Updated posts: ${summary.updatedPosts}`);
    console.log(`Migrated images: ${summary.migratedImages}`);
    console.log(`Skipped images: ${summary.skippedImages}`);
    console.log(`Failed images: ${summary.failedImages}`);
    console.log(`Mode: ${dryRun ? "dry-run" : "write"}`);
    console.log(`Success report: ${reportFiles.successPath}`);
    console.log(`Failure report: ${reportFiles.failurePath}`);
    console.log(`Summary report: ${reportFiles.summaryPath}`);
  } finally {
    cleanup();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exit(1);
});
