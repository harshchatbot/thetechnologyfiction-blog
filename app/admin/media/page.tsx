import { AdminShell } from "@/components/admin/admin-shell";
import { MediaForm } from "@/components/admin/media-form";
import { MediaThumbnail } from "@/components/admin/media-thumbnail";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
        <div className="grid gap-4 md:grid-cols-2">
          {media.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="flex aspect-[16/10] items-center justify-center bg-[#fbfaf7] p-3">
                <MediaThumbnail
                  src={item.url}
                  alt={item.alt}
                  mediaType={item.mediaType}
                  mimeType={item.mimeType}
                  className="h-full w-full object-contain rounded-[1rem] bg-white p-2"
                />
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink">{item.title}</p>
                    <p className="text-sm text-slate-500">
                      {(item.mediaType || "image") === "video" ? "Video" : "Image"} · {item.source === "firebase" ? "Firebase Storage" : "External URL"}
                    </p>
                  </div>
                  <form action={deleteMediaAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <Button type="submit" variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                      Delete
                    </Button>
                  </form>
                </div>
                <p className="text-xs leading-6 text-slate-500">{item.alt}</p>
                <p className="text-xs leading-6 text-slate-500 break-all">{item.url}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
