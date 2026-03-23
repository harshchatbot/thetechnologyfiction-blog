const fs = require("fs");
const path = require("path");
const { loadEnvConfig } = require("@next/env");
const { parse: parseHtml } = require("node-html-parser");

function ensureArray(value) {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (!current.startsWith("--")) continue;

    const trimmed = current.slice(2);
    const [rawKey, inlineValue] = trimmed.split("=");
    const next = argv[index + 1];
    const usesNext = inlineValue === undefined && next && !next.startsWith("--");
    const value = inlineValue !== undefined ? inlineValue : usesNext ? next : "true";
    args[rawKey] = value;

    if (usesNext) index += 1;
  }

  return args;
}

function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/&amp;/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function cleanText(input) {
  return String(input || "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(input) {
  if (!input) return "";
  const root = parseHtml(String(input));
  return cleanText(root.textContent || "");
}

function estimateReadingTime(input) {
  const wordCount = cleanText(input).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 220));
}

function parseWpDate(value, fallbackValue) {
  const raw = value || fallbackValue;
  if (!raw) return undefined;

  const normalized = String(raw).trim();
  if (!normalized || normalized.startsWith("0000-00-00")) return undefined;

  const isoValue = normalized.includes("T")
    ? normalized
    : normalized.includes("+") || normalized.endsWith("Z")
      ? normalized
      : `${normalized.replace(" ", "T")}Z`;

  const asDate = new Date(isoValue);
  return Number.isNaN(asDate.getTime()) ? undefined : asDate.toISOString();
}

function parseRssPubDate(value) {
  if (!value) return undefined;
  const asDate = new Date(String(value));
  return Number.isNaN(asDate.getTime()) ? undefined : asDate.toISOString();
}

function normalizeWpStatus(status) {
  switch (String(status || "").toLowerCase()) {
    case "publish":
      return "published";
    case "trash":
      return "archived";
    default:
      return "draft";
  }
}

function toTextNode(text) {
  const value = cleanText(text);
  return value ? { type: "paragraph", text: value } : null;
}

function extractInlineImageUrls(contentHtml) {
  if (!contentHtml) return [];
  const root = parseHtml(String(contentHtml));
  return Array.from(
    new Set(
      root
        .querySelectorAll("img")
        .map((image) => image.getAttribute("src"))
        .filter(Boolean)
    )
  );
}

function htmlToRichTextNodes(contentHtml) {
  if (!contentHtml) return [];

  const root = parseHtml(String(contentHtml), {
    comment: false
  });

  const blocks = root.childNodes.flatMap(nodeToBlocks).filter(Boolean);
  return blocks.length ? blocks : [toTextNode(stripHtml(contentHtml))].filter(Boolean);
}

function nodeToBlocks(node) {
  if (!node) return [];

  if (node.nodeType === 3) {
    const paragraph = toTextNode(node.rawText || node.text || "");
    return paragraph ? [paragraph] : [];
  }

  if (!node.tagName) {
    const fallback = toTextNode(node.textContent || "");
    return fallback ? [fallback] : [];
  }

  const tag = node.tagName.toLowerCase();

  if (["h1", "h2", "h3", "h4"].includes(tag)) {
    const text = cleanText(node.textContent || "");
    if (!text) return [];
    return [{
      type: "heading",
      level: tag === "h3" || tag === "h4" ? 3 : 2,
      text
    }];
  }

  if (tag === "p") {
    const nestedImages = node.querySelectorAll("img");
    const text = cleanText(node.textContent || "");
    if (nestedImages.length && !text) {
      return nestedImages.map(imageNodeToBlock).filter(Boolean);
    }
    const paragraph = toTextNode(text);
    return paragraph ? [paragraph] : [];
  }

  if (tag === "ul" || tag === "ol") {
    const items = node
      .querySelectorAll("li")
      .map((item) => cleanText(item.textContent || ""))
      .filter(Boolean);
    if (!items.length) return [];
    return [{
      type: tag === "ul" ? "bulletList" : "orderedList",
      items
    }];
  }

  if (tag === "blockquote") {
    const text = cleanText(node.textContent || "");
    return text ? [{ type: "blockquote", text }] : [];
  }

  if (tag === "pre") {
    const codeElement = node.querySelector("code");
    const code = String(codeElement?.textContent || node.textContent || "").trim();
    return code ? [{ type: "codeBlock", code }] : [];
  }

  if (tag === "figure") {
    const image = node.querySelector("img");
    const block = image ? imageNodeToBlock(image) : null;
    if (!block) return [];
    const caption = cleanText(node.querySelector("figcaption")?.textContent || "");
    if (caption) block.caption = caption;
    return [block];
  }

  if (tag === "img") {
    const image = imageNodeToBlock(node);
    return image ? [image] : [];
  }

  if (["div", "section", "article", "main", "body", "span"].includes(tag)) {
    return node.childNodes.flatMap(nodeToBlocks);
  }

  const paragraph = toTextNode(node.textContent || "");
  return paragraph ? [paragraph] : [];
}

function imageNodeToBlock(node) {
  const src = node.getAttribute("src");
  if (!src) return null;
  return {
    type: "image",
    src,
    alt: cleanText(node.getAttribute("alt") || node.getAttribute("title") || "Imported image"),
    caption: cleanText(node.getAttribute("title") || "")
  };
}

function buildExternalMediaItem({ id, title, url, alt, caption, createdAt, updatedAt }) {
  return {
    id,
    title: title || alt || "Imported WordPress media",
    alt: alt || title || "Imported WordPress media",
    caption: caption || undefined,
    url,
    source: "external",
    createdAt,
    updatedAt
  };
}

function writeJson(outputPath, data) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function deepOmitUndefined(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => deepOmitUndefined(item))
      .filter((item) => item !== undefined);
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value)
      .map(([key, currentValue]) => [key, deepOmitUndefined(currentValue)])
      .filter(([, currentValue]) => currentValue !== undefined);

    return Object.fromEntries(entries);
  }

  return value === undefined ? undefined : value;
}

function loadMigrationEnv(projectRoot) {
  loadEnvConfig(projectRoot);
}

function normalizePrivateKey(value) {
  if (!value) return undefined;
  return String(value).replace(/\\n/g, "\n");
}

function getFirebaseAdminEnv() {
  return {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  };
}

function logFirebaseEnvPresence() {
  const env = getFirebaseAdminEnv();
  console.log("Firebase env presence");
  console.log(`FIREBASE_PROJECT_ID: ${env.projectId ? "present" : "missing"}`);
  console.log(`FIREBASE_CLIENT_EMAIL: ${env.clientEmail ? "present" : "missing"}`);
  console.log(`FIREBASE_PRIVATE_KEY: ${env.privateKey ? "present" : "missing"}`);
}

module.exports = {
  buildExternalMediaItem,
  cleanText,
  deepOmitUndefined,
  getFirebaseAdminEnv,
  ensureArray,
  estimateReadingTime,
  extractInlineImageUrls,
  htmlToRichTextNodes,
  loadMigrationEnv,
  logFirebaseEnvPresence,
  normalizeWpStatus,
  normalizePrivateKey,
  parseArgs,
  parseRssPubDate,
  parseWpDate,
  slugify,
  stripHtml,
  writeJson
};
