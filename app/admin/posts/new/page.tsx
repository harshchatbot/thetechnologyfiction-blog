import { AdminShell } from "@/components/admin/admin-shell";
import { PostForm } from "@/components/admin/post-form";
import { getCategories, getMedia, getTags } from "@/lib/content/repository";
import { requireAdminUser } from "@/lib/firebase/auth";
import { savePostAction } from "@/features/posts/actions";

export default async function NewPostPage() {
  const user = await requireAdminUser();
  const [categories, tags, media] = await Promise.all([getCategories(), getTags(), getMedia()]);

  return (
    <AdminShell
      user={user}
      currentPath="/admin/posts"
      title="Create post"
      description="Draft structured content with rich editing, SEO fields, featured media, and preview support."
    >
      <PostForm categories={categories} tags={tags} media={media} action={savePostAction} />
    </AdminShell>
  );
}
