import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";
import { getAllPostsAdmin, getCategories, getMedia, getTags } from "@/lib/content/repository";
import { requireAdminUser } from "@/lib/firebase/auth";

export default async function AdminDashboardPage() {
  const user = await requireAdminUser();
  const [posts, categories, tags, media] = await Promise.all([
    getAllPostsAdmin(),
    getCategories(),
    getTags(),
    getMedia()
  ]);

  const metrics = [
    { label: "Posts", value: posts.length },
    { label: "Categories", value: categories.length },
    { label: "Tags", value: tags.length },
    { label: "Media", value: media.length }
  ];

  return (
    <AdminShell
      user={user}
      currentPath="/admin"
      title="Editorial command center"
      description="Manage long-tail content clusters, publishing cadence, media assets, and SEO settings from one place."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          return (
            <Card key={metric.label} className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{metric.label}</p>
                <span className="text-lg text-accent">+</span>
              </div>
              <p className="mt-5 text-4xl font-semibold text-ink">{metric.value}</p>
            </Card>
          );
        })}
      </div>
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-ink">Publishing workflow</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          The current MVP is structured for real Firebase-backed publishing, featured-post curation, migration-safe slug management, and external media reuse for WordPress/Godaddy assets.
        </p>
      </Card>
    </AdminShell>
  );
}
