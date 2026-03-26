import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAllPostsAdmin } from "@/lib/content/repository";
import { requireAdminUser } from "@/lib/firebase/auth";
import { formatDate } from "@/lib/utils/format";

export default async function AdminPostsPage({
  searchParams
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    category?: string;
  }>;
}) {
  const user = await requireAdminUser();
  const { q = "", status = "", category = "" } = await searchParams;
  const posts = await getAllPostsAdmin();
  const draftCount = posts.filter((post) => post.status === "draft").length;
  const publishedCount = posts.filter((post) => post.status === "published").length;
  const archivedCount = posts.filter((post) => post.status === "archived").length;
  const categoryOptions = Array.from(
    new Set(posts.map((post) => post.category.name).filter(Boolean))
  ).sort((left, right) => left.localeCompare(right));
  const query = q.trim().toLowerCase();
  const filteredPosts = posts.filter((post) => {
    const matchesQuery =
      !query ||
      post.title.toLowerCase().includes(query) ||
      post.slug.toLowerCase().includes(query);
    const matchesStatus = !status || post.status === status;
    const matchesCategory = !category || post.category.name === category;
    return matchesQuery && matchesStatus && matchesCategory;
  });

  return (
    <AdminShell
      user={user}
      currentPath="/admin/posts"
      title="Manage posts"
      description="Create, revise, publish, or archive articles with migration-safe slugs and structured SEO fields."
    >
      <div className="flex justify-end">
        <Link href="/admin/posts/new">
          <Button>Create new post</Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Drafts</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{draftCount}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Saved drafts appear in this table with the Draft status.
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Published</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{publishedCount}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            These posts are live on the public website.
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Archived</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{archivedCount}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Archived posts stay in admin but are hidden from the site.
          </p>
        </Card>
      </div>
      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Filter posts</p>
            <h2 className="mt-2 text-xl font-semibold text-ink">Find drafts, published posts, or specific categories faster</h2>
          </div>
          <Link href="/admin/posts">
            <Button variant="secondary">Clear filters</Button>
          </Link>
        </div>
        <form className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_220px_220px_auto]">
          <Input
            name="q"
            defaultValue={q}
            placeholder="Search by title or slug"
          />
          <select
            name="status"
            defaultValue={status}
            className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
          >
            <option value="">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <select
            name="category"
            defaultValue={category}
            className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
          >
            <option value="">All categories</option>
            {categoryOptions.map((categoryName) => (
              <option key={categoryName} value={categoryName}>
                {categoryName}
              </option>
            ))}
          </select>
          <Button type="submit">Apply filters</Button>
        </form>
        <p className="mt-4 text-sm text-slate-500">
          Showing {filteredPosts.length} of {posts.length} posts.
        </p>
      </Card>
      <Card className="overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <tr key={post.id} className="border-b border-slate-100 last:border-none">
                  <td className="px-6 py-4">
                    <Link href={`/admin/posts/${post.id}/edit`} className="font-medium text-ink hover:text-accent">
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 capitalize text-slate-600">{post.status}</td>
                  <td className="px-6 py-4 text-slate-600">{post.category.name}</td>
                  <td className="px-6 py-4 text-slate-500">{formatDate(post.updatedAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-500">
                  No posts matched your current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </AdminShell>
  );
}
