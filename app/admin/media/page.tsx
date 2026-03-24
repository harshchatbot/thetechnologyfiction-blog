import { AdminShell } from "@/components/admin/admin-shell";
import { MediaForm } from "@/components/admin/media-form";
import { Card } from "@/components/ui/card";
import { saveMediaAction } from "@/features/media/actions";
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
      description="Manage Firebase Storage uploads and external image URLs side by side so migration from WordPress stays flexible."
    >
      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <MediaForm action={saveMediaAction} />
        <div className="grid gap-4 md:grid-cols-2">
          {media.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="flex aspect-[16/10] items-center justify-center bg-[#fbfaf7] p-3">
                <img
                  src={item.url}
                  alt={item.alt}
                  loading="lazy"
                  className="h-full w-full object-contain rounded-[1rem] bg-white p-2"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-2 p-4">
                <p className="font-medium text-ink">{item.title}</p>
                <p className="text-sm text-slate-500">{item.source}</p>
                <p className="text-xs leading-6 text-slate-500 break-all">{item.url}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
