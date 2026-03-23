import Link from "next/link";
import type { Category } from "@/types/content";
import { Card } from "@/components/ui/card";
import { getCategorySummary } from "@/lib/content/presentation";

export function TopicGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {categories.map((category) => (
        <Link key={category.id} href={`/category/${category.slug}`}>
          <Card className="group h-full border border-white/60 bg-white/72 p-6 transition duration-500 hover:-translate-y-2 hover:border-accent/30 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
            <div
              className="mb-5 h-2 w-16 rounded-full transition duration-500 group-hover:w-24"
              style={{ backgroundColor: category.color || "#c96d42" }}
            />
            <h3 className="text-xl font-semibold text-ink transition duration-300 group-hover:text-accent">
              {category.name}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {getCategorySummary(category)}
            </p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
