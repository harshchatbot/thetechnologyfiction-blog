#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { XMLParser } = require("fast-xml-parser");
const {
  buildExternalMediaItem,
  cleanText,
  ensureArray,
  estimateReadingTime,
  extractInlineImageUrls,
  htmlToRichTextNodes,
  normalizeWpStatus,
  parseArgs,
  parseRssPubDate,
  parseWpDate,
  slugify,
  stripHtml,
  writeJson
} = require("./wp-migrate-utils.cjs");

const projectRoot = path.resolve(__dirname, "..", "..");
const defaultInput = path.resolve(__dirname, "thetech-fi.WordPress.2026-03-23.xml");
const defaultOutput = path.resolve(__dirname, "output", "wordpress-posts.json");

function parseXmlFile(filePath) {
  const xml = fs.readFileSync(filePath, "utf8");
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    parseAttributeValue: false,
    parseTagValue: false,
    trimValues: false,
    processEntities: false
  });

  return parser.parse(xml);
}

function metadataMap(item) {
  const map = new Map();
  for (const entry of ensureArray(item["wp:postmeta"])) {
    if (!entry) continue;
    map.set(String(entry["wp:meta_key"] || ""), entry["wp:meta_value"]);
  }
  return map;
}

function makeTaxonomyMaps(channel) {
  const categories = new Map();
  const tags = new Map();

  for (const category of ensureArray(channel["wp:category"])) {
    const item = {
      termId: String(category["wp:term_id"] || ""),
      name: cleanText(category["wp:cat_name"] || ""),
      slug: String(category["wp:category_nicename"] || slugify(category["wp:cat_name"] || "")),
      description: cleanText(category["wp:category_description"] || "")
    };
    categories.set(item.termId, item);
    categories.set(item.slug, item);
  }

  for (const tag of ensureArray(channel["wp:tag"])) {
    const item = {
      termId: String(tag["wp:term_id"] || ""),
      name: cleanText(tag["wp:tag_name"] || ""),
      slug: String(tag["wp:tag_slug"] || slugify(tag["wp:tag_name"] || "")),
      description: cleanText(tag["wp:tag_description"] || "")
    };
    tags.set(item.termId, item);
    tags.set(item.slug, item);
  }

  return { categories, tags };
}

function makeAuthorMap(channel) {
  const authors = new Map();
  for (const author of ensureArray(channel["wp:author"])) {
    authors.set(String(author["wp:author_login"] || ""), {
      login: String(author["wp:author_login"] || ""),
      email: String(author["wp:author_email"] || ""),
      displayName: cleanText(author["wp:author_display_name"] || author["wp:author_login"] || "WordPress Author"),
      firstName: cleanText(author["wp:author_first_name"] || ""),
      lastName: cleanText(author["wp:author_last_name"] || "")
    });
  }
  return authors;
}

function makeAttachmentMap(items) {
  const attachments = new Map();

  for (const item of items) {
    if (String(item["wp:post_type"] || "") !== "attachment") continue;

    const meta = metadataMap(item);
    const attachmentId = String(item["wp:post_id"] || "");
    attachments.set(attachmentId, {
      attachmentId,
      url: String(item["wp:attachment_url"] || ""),
      title: cleanText(item.title || ""),
      alt: cleanText(meta.get("_wp_attachment_image_alt") || ""),
      caption: cleanText(item["excerpt:encoded"] || ""),
      description: cleanText(stripHtml(item["content:encoded"] || ""))
    });
  }

  return attachments;
}

function normalizeCategory(category, taxonomyMaps) {
  const slug = String(category.nicename || slugify(category["#text"] || category));
  const mapped = taxonomyMaps.categories.get(slug);
  return {
    termId: mapped?.termId || "",
    slug,
    name: cleanText(category["#text"] || mapped?.name || slug),
    description: mapped?.description || ""
  };
}

function normalizeTag(tag, taxonomyMaps) {
  const slug = String(tag.nicename || slugify(tag["#text"] || tag));
  const mapped = taxonomyMaps.tags.get(slug);
  return {
    termId: mapped?.termId || "",
    slug,
    name: cleanText(tag["#text"] || mapped?.name || slug),
    description: mapped?.description || ""
  };
}

function buildParsedPost(item, context) {
  const meta = metadataMap(item);
  const itemCategories = ensureArray(item.category);
  const categories = itemCategories
    .filter((entry) => entry?.domain === "category")
    .map((entry) => normalizeCategory(entry, context.taxonomyMaps));
  const tags = itemCategories
    .filter((entry) => entry?.domain === "post_tag")
    .map((entry) => normalizeTag(entry, context.taxonomyMaps));

  const primaryCategoryTermId = String(meta.get("rank_math_primary_category") || "");
  const primaryCategory =
    categories.find((category) => category.termId === primaryCategoryTermId) ||
    categories[0] || {
      termId: "",
      slug: "uncategorized",
      name: "Uncategorized",
      description: "Imported WordPress content awaiting category refinement."
    };

  const title = cleanText(item.title || "");
  const slug = String(item["wp:post_name"] || slugify(title));
  const contentHtml = String(item["content:encoded"] || "");
  const excerptHtml = String(item["excerpt:encoded"] || "");
  const excerpt =
    cleanText(stripHtml(excerptHtml)) ||
    cleanText(stripHtml(item.description || "")) ||
    cleanText(stripHtml(contentHtml)).slice(0, 220);
  const publishedAt =
    parseWpDate(item["wp:post_date_gmt"], item["wp:post_date"]) ||
    parseRssPubDate(item.pubDate);
  const updatedAt =
    parseWpDate(item["wp:post_modified_gmt"], item["wp:post_modified"]) ||
    publishedAt ||
    new Date().toISOString();
  const createdAt = publishedAt || updatedAt;
  const wordpressStatus = String(item["wp:status"] || "draft");
  const firestoreStatus = normalizeWpStatus(wordpressStatus);
  const thumbnailId = String(meta.get("_thumbnail_id") || "");
  const attachment = thumbnailId ? context.attachments.get(thumbnailId) : undefined;
  const inlineImageUrls = extractInlineImageUrls(contentHtml);
  const author = context.authors.get(String(item["dc:creator"] || "")) || {
    login: String(item["dc:creator"] || ""),
    email: "",
    displayName: cleanText(item["dc:creator"] || "WordPress Author")
  };
  const featuredImage = attachment?.url
    ? buildExternalMediaItem({
        id: `media-wp-${attachment.attachmentId}`,
        title: attachment.title || title,
        url: attachment.url,
        alt: attachment.alt || attachment.title || title,
        caption: attachment.caption || attachment.description,
        createdAt,
        updatedAt
      })
    : undefined;

  return {
    wordpressPostId: String(item["wp:post_id"] || ""),
    title,
    slug,
    link: String(item.link || ""),
    excerpt,
    excerptHtml,
    contentHtml,
    publishedAt,
    updatedAt,
    createdAt,
    wordpressStatus,
    firestoreStatus,
    isPublished: wordpressStatus === "publish",
    author,
    categories,
    primaryCategory,
    tags,
    featuredImage,
    inlineImageUrls,
    readingTime: estimateReadingTime(stripHtml(contentHtml)),
    content: htmlToRichTextNodes(contentHtml),
    meta: {
      thumbnailId,
      rankMathPrimaryCategory: primaryCategoryTermId,
      seoTitle: cleanText(meta.get("rank_math_title") || ""),
      seoDescription: cleanText(meta.get("rank_math_description") || ""),
      canonicalUrl: cleanText(meta.get("rank_math_canonical_url") || ""),
      focusKeyword: cleanText(meta.get("rank_math_focus_keyword") || "")
    },
    firestorePreview: {
      id: `wp-${String(item["wp:post_id"] || crypto.randomUUID())}`,
      slug,
      title,
      excerpt,
      category: primaryCategory,
      categories: categories.length ? categories : [primaryCategory],
      tags,
      tagIds: tags.map((tag) => `tag-${tag.slug}`),
      status: firestoreStatus,
      readingTime: estimateReadingTime(stripHtml(contentHtml)),
      featuredImage,
      contentHtml,
      inlineImageUrls
    }
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const input = path.resolve(projectRoot, args.input || defaultInput);
  const output = path.resolve(projectRoot, args.output || defaultOutput);
  const limit = args.limit ? Number(args.limit) : undefined;

  if (!fs.existsSync(input)) {
    throw new Error(`WordPress XML file not found: ${input}`);
  }

  const parsed = parseXmlFile(input);
  const channel = parsed?.rss?.channel;
  if (!channel) {
    throw new Error("Invalid WordPress export. Could not find rss.channel.");
  }

  const items = ensureArray(channel.item);
  const taxonomyMaps = makeTaxonomyMaps(channel);
  const authors = makeAuthorMap(channel);
  const attachments = makeAttachmentMap(items);
  const posts = items
    .filter((item) => String(item["wp:post_type"] || "") === "post")
    .slice(0, limit || Number.MAX_SAFE_INTEGER)
    .map((item) => buildParsedPost(item, { taxonomyMaps, authors, attachments }));

  const outputData = {
    generatedAt: new Date().toISOString(),
    sourceFile: path.relative(projectRoot, input),
    sourceSite: {
      title: cleanText(channel.title || ""),
      link: String(channel.link || ""),
      baseSiteUrl: String(channel["wp:base_site_url"] || ""),
      baseBlogUrl: String(channel["wp:base_blog_url"] || "")
    },
    summary: {
      totalItems: items.length,
      totalBlogPosts: items.filter((item) => String(item["wp:post_type"] || "") === "post").length,
      exportedPosts: posts.length,
      publishedPosts: posts.filter((post) => post.wordpressStatus === "publish").length,
      draftPosts: posts.filter((post) => post.wordpressStatus !== "publish").length,
      uniqueCategories: new Set(posts.flatMap((post) => post.categories.map((category) => category.slug))).size,
      uniqueTags: new Set(posts.flatMap((post) => post.tags.map((tag) => tag.slug))).size
    },
    authors: Array.from(authors.values()),
    posts
  };

  writeJson(output, outputData);

  console.log(`Parsed ${posts.length} WordPress posts from ${path.relative(projectRoot, input)}.`);
  console.log(`Published posts in output: ${outputData.summary.publishedPosts}`);
  console.log(`Draft or other-status posts in output: ${outputData.summary.draftPosts}`);
  console.log(`Wrote migration JSON to ${path.relative(projectRoot, output)}`);
}

main();
