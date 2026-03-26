import { AdminShell } from "@/components/admin/admin-shell";
import { TaxonomyForm } from "@/components/admin/taxonomy-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { deleteTagAction, saveTagAction } from "@/features/tags/actions";
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
      <div className="grid items-start gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <TaxonomyForm type="tag" action={saveTagAction} />
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-ink">Existing tags</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {tags.map((tag) => (
              <form key={tag.id} action={deleteTagAction} className="inline-flex">
                <input type="hidden" name="id" value={tag.id} />
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
                  #{tag.name}
                  <Button type="submit" variant="ghost" className="px-2 py-1 text-red-600 hover:bg-red-50 hover:text-red-700">
                    Delete
                  </Button>
                </span>
              </form>
            ))}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
