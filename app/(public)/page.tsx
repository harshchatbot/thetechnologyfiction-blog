import { buildMetadata } from "@/lib/seo/metadata";
import { getHomePageData } from "@/lib/content/repository";
import { HomepageShell } from "@/features/root-site/homepage-shell";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title:
    "Learn Salesforce Online | Practical Training & Tutorials | The Technology Fiction",
  description:
    "Learn Salesforce with practical training, real-world tutorials and guidance from an experienced professional. Practice your skills for free on OrgReady."
});

export default async function HomePage() {
  const { latestPosts, categories } = await getHomePageData();

  return <HomepageShell latestPosts={latestPosts} categories={categories} />;
}
