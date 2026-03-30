"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/types/content";
import { Input } from "@/components/ui/input";
import { trackEvent } from "@/lib/analytics/gtag";

type Props = {
  categories: Category[];
  defaultQuery?: string;
  selectedTag?: string;
};

export function BlogSearchPanel({ categories, defaultQuery = "", selectedTag }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();

    trackEvent("blog_search", {
      search_term: trimmedQuery || "(empty)",
      tag_filter: selectedTag || "none"
    });

    const params = new URLSearchParams();
    if (trimmedQuery) params.set("q", trimmedQuery);
    if (selectedTag) params.set("tag", selectedTag);
    router.push(params.toString() ? `/blog?${params.toString()}` : "/blog");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="relative">
          <span className="absolute left-4 top-3.5 text-xs uppercase tracking-[0.18em] text-slate-400">
            Search
          </span>
          <Input
            name="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles, ideas, topics, or frameworks"
            className="pl-20"
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-ink px-5 text-sm font-medium text-white transition hover:bg-[#0f172a]"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/blog"
          onClick={() =>
            trackEvent("blog_filter_click", {
              filter_type: "all_topics"
            })
          }
          className={`rounded-full border px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] transition ${
            !selectedTag
              ? "border-accent/30 bg-accent/10 text-accent"
              : "border-slate-200 bg-white/80 text-slate-500 hover:border-accent/30 hover:text-accent"
          }`}
        >
          All topics
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            onClick={() =>
              trackEvent("blog_category_click", {
                category_name: category.name,
                category_slug: category.slug
              })
            }
            className="rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500 transition hover:border-accent/30 hover:text-accent"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </>
  );
}
