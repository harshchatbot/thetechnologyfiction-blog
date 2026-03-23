import { AdminShell } from "@/components/admin/admin-shell";
import { TaxonomyForm } from "@/components/admin/taxonomy-form";
import { Card } from "@/components/ui/card";
import { saveTagAction } from "@/features/tags/actions";
import { getTags } from "@/lib/content/repository";
import { requireAdminUser } from "@/lib/firebase/auth";

export default async function AdminTagsPage() {
  const user = await requireAdminUser();
  const tags = await getTags();

  return (
    <AdminShell
      user={user}
      currentPath="/admin/tags"
      title="Tag management"
      description="Use tags to connect adjacent topics, strengthen related-post logic, and support long-tail search journeys."
    >
      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <TaxonomyForm type="tag" action={saveTagAction} />
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-ink">Existing tags</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {tags.map((tag) => (
              <span key={tag.id} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
                #{tag.name}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
