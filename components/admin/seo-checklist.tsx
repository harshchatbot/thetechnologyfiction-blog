"use client";

type SeoChecklistProps = {
  title: string;
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  content: unknown[];
};

function scoreItem(passed: boolean, label: string, detail: string) {
  return { passed, label, detail };
}

export function SeoChecklist({
  title,
  excerpt,
  seoTitle,
  seoDescription,
  focusKeyword,
  content
}: SeoChecklistProps) {
  const keyword = focusKeyword?.trim().toLowerCase() || "";
  const serialized = JSON.stringify(content).toLowerCase();
  const effectiveTitle = seoTitle?.trim() || title.trim();
  const effectiveDescription = seoDescription?.trim() || excerpt.trim();
  const keywordCount = keyword
    ? (serialized.match(new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || [])
        .length
    : 0;
  const headingCount = content.filter(
    (node) =>
      typeof node === "object" &&
      node &&
      "type" in node &&
      (node as { type?: string }).type === "heading"
  ).length;

  const items = [
    scoreItem(
      effectiveTitle.length >= 35 && effectiveTitle.length <= 65,
      "Title length",
      "Aim for 35-65 characters."
    ),
    scoreItem(
      effectiveDescription.length >= 120 && effectiveDescription.length <= 165,
      "Meta description",
      "Aim for 120-165 characters."
    ),
    scoreItem(Boolean(keyword), "Focus keyword", "Add one clear primary keyword."),
    scoreItem(
      !keyword || effectiveTitle.toLowerCase().includes(keyword),
      "Keyword in title",
      "Use the focus keyword in the title naturally."
    ),
    scoreItem(
      !keyword || effectiveDescription.toLowerCase().includes(keyword),
      "Keyword in description",
      "Mention the keyword once in the meta description."
    ),
    scoreItem(headingCount >= 2, "Heading structure", "Use at least 2 headings."),
    scoreItem(
      !keyword || keywordCount <= 12,
      "Keyword stuffing",
      "Avoid repeating the same keyword excessively."
    )
  ];

  const passed = items.filter((item) => item.passed).length;

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-[#fbfaf7] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            SEO checklist
          </p>
          <h3 className="mt-2 text-lg font-semibold text-ink">
            {passed}/{items.length} checks passed
          </h3>
        </div>
        <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-accent">
          {Math.round((passed / items.length) * 100)}%
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"
          >
            <div
              className={
                item.passed
                  ? "mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500"
                  : "mt-1 h-2.5 w-2.5 rounded-full bg-amber-500"
              }
            />
            <div>
              <p className="text-sm font-medium text-ink">{item.label}</p>
              <p className="text-xs leading-6 text-slate-500">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
