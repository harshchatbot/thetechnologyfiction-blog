import { absoluteUrl } from "@/lib/utils/format";
import { siteConfig } from "@/lib/content/site-config";
import type { Category, Post } from "@/types/content";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.organizationName,
    url: siteConfig.siteUrl,
    logo: absoluteUrl(siteConfig.organizationLogo || "/")
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.siteName,
    url: siteConfig.siteUrl,
    description: siteConfig.siteDescription
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

export function articleJsonLd(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage?.url ? [post.featuredImage.url] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
      description: post.author.role
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.organizationName,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(siteConfig.organizationLogo || "/")
      }
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    url: post.seo.canonicalUrl || absoluteUrl(`/blog/${post.slug}`),
    articleSection: post.category.name,
    keywords: post.tags.map((tag) => tag.name).join(", "),
    inLanguage: "en",
    wordCount: post.content
      .map((node) => {
        switch (node.type) {
          case "paragraph":
          case "heading":
          case "blockquote":
            return node.text;
          case "bulletList":
          case "orderedList":
            return node.items.join(" ");
          case "codeBlock":
            return node.code;
          case "callout":
            return `${node.title} ${node.body}`;
          case "image":
            return `${node.alt} ${node.caption || ""}`;
          case "video":
            return `${node.title} ${node.caption || ""}`;
          default:
            return "";
        }
      })
      .join(" ")
      .split(/\s+/)
      .filter(Boolean).length
  };
}

export function categoryJsonLd(category: Category, postsCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} Articles`,
    description: category.description,
    url: absoluteUrl(`/category/${category.slug}`),
    isPartOf: absoluteUrl("/blog"),
    numberOfItems: postsCount
  };
}
