import Link from "next/link";
import type { Category } from "@/types/content";
import { Card } from "@/components/ui/card";

export function TopicGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {categories.map((category) => (
        <Link key={category.id} href={`/category/${category.slug}`}>
          <Card className="h-full p-6 transition hover:-translate-y-1 hover:border-accent/30">
            <div
              className="mb-5 h-2 w-16 rounded-full"
              style={{ backgroundColor: category.color || "#c96d42" }}
            />
            <h3 className="text-xl font-semibold text-ink">{category.name}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{category.description}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
