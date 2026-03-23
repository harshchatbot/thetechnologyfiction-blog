import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAllPostsAdmin } from "@/lib/content/repository";
import { requireAdminUser } from "@/lib/firebase/auth";
import { formatDate } from "@/lib/utils/format";

export default async function AdminPostsPage() {
  const user = await requireAdminUser();
  const posts = await getAllPostsAdmin();

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
            {posts.map((post) => (
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
            ))}
          </tbody>
        </table>
      </Card>
    </AdminShell>
  );
}
