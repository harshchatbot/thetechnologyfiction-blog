import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { PostForm } from "@/components/admin/post-form";
import { Button } from "@/components/ui/button";
import { getCategories, getMedia, getPostById, getTags } from "@/lib/content/repository";
import { requireAdminUser } from "@/lib/firebase/auth";
import { archivePostAction, savePostAction } from "@/features/posts/actions";

export default async function EditPostPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAdminUser();
  const { id } = await params;
  const [post, categories, tags, media] = await Promise.all([
    getPostById(id),
    getCategories(),
    getTags(),
    getMedia()
  ]);

  if (!post) notFound();

  return (
    <AdminShell
      user={user}
      currentPath="/admin/posts"
      title="Edit post"
      description="Update body content, metadata, publish state, and topical relationships without leaving the dashboard."
    >
      <div className="flex justify-end">
        <form action={archivePostAction}>
          <input type="hidden" name="id" value={post.id} />
          <Button variant="secondary">Archive post</Button>
        </form>
      </div>
      <PostForm post={post} categories={categories} tags={tags} media={media} action={savePostAction} />
    </AdminShell>
  );
}
