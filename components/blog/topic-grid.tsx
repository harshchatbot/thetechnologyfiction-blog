import Link from "next/link";
import type { Category } from "@/types/content";
export function TopicGrid({ categories }: { categories: Category[] }) {
  return <nav aria-label="Article topics" className="grid grid-cols-2 gap-x-6 border-t border-slate-300/70 sm:grid-cols-3 lg:grid-cols-4">
    {categories.map(category => <Link key={category.id} href={`/category/${category.slug}`} className="group flex min-w-0 items-center justify-between gap-2 border-b border-slate-300/70 py-5 text-base font-semibold text-ink transition-colors hover:text-[#667b36] sm:text-lg">
      <span className="truncate">{category.name}</span><span aria-hidden="true" className="text-slate-400 transition-transform motion-safe:group-hover:translate-x-1">↗</span>
    </Link>)}
  </nav>;
}
