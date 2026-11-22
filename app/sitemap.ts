import type { MetadataRoute } from "next";
import { getCategories, getPublishedPosts } from "@/lib/content/repository";
import { siteConfig } from "@/lib/content/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([getPublishedPosts(), getCategories()]);

  const staticRoutes = ["", "/blog", "/roadmap", "/salesforce-coaching"].map((path) => ({
    url: `${siteConfig.siteUrl}${path}`,
  }));

  const postRoutes = posts.map((post) => ({
    url: `${siteConfig.siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt)
  }));

  const categoryRoutes = categories.map((category) => ({
    url: `${siteConfig.siteUrl}/category/${category.slug}`
  }));

  return [...staticRoutes, ...postRoutes, ...categoryRoutes];
}
