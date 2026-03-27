import { AdminShell } from "@/components/admin/admin-shell";
import { MediaForm } from "@/components/admin/media-form";
import { MediaLibraryGrid } from "@/components/admin/media-library-grid";
import { deleteMediaAction, saveMediaAction } from "@/features/media/actions";
import { getMedia } from "@/lib/content/repository";
import { requireAdminUser } from "@/lib/firebase/auth";

export default async function AdminMediaPage() {
  const user = await requireAdminUser();
  const media = await getMedia();

  return (
    <AdminShell
      user={user}
      currentPath="/admin/media"
      title="Media library"
      description="Manage Firebase Storage uploads and external media URLs side by side so images and demo videos both fit the publishing workflow."
    >
      <div className="grid items-start gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <MediaForm action={saveMediaAction} />
        <MediaLibraryGrid media={media} deleteAction={deleteMediaAction} />
      </div>
    </AdminShell>
  );
}
