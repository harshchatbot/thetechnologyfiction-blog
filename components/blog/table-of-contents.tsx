"use client";

import { useEffect, useMemo, useState } from "react";
import type { TocItem } from "@/types/content";
import { cn } from "@/lib/utils/cn";

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const [open, setOpen] = useState(false);

  const ids = useMemo(() => items.map((item) => item.id), [items]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0.1, 1] }
    );

    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [ids]);

  if (!items.length) return null;

  return (
    <>
      <div className="rounded-[1.75rem] border border-slate-200 bg-white/75 p-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between text-left text-sm font-medium text-ink"
        >
          <span>Table of contents</span>
          <span className={cn("text-xs transition", open && "rotate-180")}>⌄</span>
        </button>
        {open && <TocList items={items} activeId={activeId} />}
      </div>

      <aside className="sticky top-28 hidden max-h-[calc(100vh-8rem)] overflow-auto rounded-[2rem] border border-slate-200 bg-white/75 p-5 lg:block">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">On this page</p>
        <TocList items={items} activeId={activeId} />
      </aside>
    </>
  );
}

function TocList({ items, activeId }: { items: TocItem[]; activeId: string }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={cn(
              "block text-sm leading-6 text-slate-500 transition hover:text-ink",
              item.level === 3 && "pl-4 text-[13px]",
              activeId === item.id && "font-medium text-accent"
            )}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  );
}
