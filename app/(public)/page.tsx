import { buildMetadata } from "@/lib/seo/metadata";
import { getHomePageData } from "@/lib/content/repository";
import { HomepageShell } from "@/features/root-site/homepage-shell";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title:
    "The Technology Fiction | Salesforce, AI, Career Growth, and Technical Deep Dives",
  description:
    "A premium root website and editorial platform for Salesforce builders, AI practitioners, and career-focused technologists."
});

export default async function HomePage() {
  const { latestPosts, categories } = await getHomePageData();

  return <HomepageShell latestPosts={latestPosts} categories={categories} />;
}
