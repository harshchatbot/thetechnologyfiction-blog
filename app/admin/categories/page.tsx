import { AdminShell } from "@/components/admin/admin-shell";
import { TaxonomyForm } from "@/components/admin/taxonomy-form";
import { Card } from "@/components/ui/card";
import { saveCategoryAction } from "@/features/categories/actions";
import { getCategories } from "@/lib/content/repository";
import { requireAdminUser } from "@/lib/firebase/auth";

export default async function AdminCategoriesPage() {
  const user = await requireAdminUser();
  const categories = await getCategories();

  return (
    <AdminShell
      user={user}
      currentPath="/admin/categories"
      title="Category management"
      description="Create topical clusters that support archive pages, homepage sections, and related-content logic."
    >
      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <TaxonomyForm type="category" action={saveCategoryAction} />
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-ink">Existing categories</h2>
          <div className="mt-5 grid gap-4">
            {categories.map((category) => (
              <div key={category.id} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                  <p className="font-medium text-ink">{category.name}</p>
                </div>
                <p className="mt-2 text-sm text-slate-500">/{category.slug}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{category.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
