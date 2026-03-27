"use client";

type SeoChecklistProps = {
  title: string;
  excerpt: string;
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  content: unknown[];
  contentHtml?: string;
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
  content,
  contentHtml
}: SeoChecklistProps) {
  const keyword = focusKeyword?.trim().toLowerCase() || "";
  const serialized = JSON.stringify(content).toLowerCase();
  const html = String(contentHtml || "");
  const effectiveTitle = seoTitle?.trim() || title.trim();
  const effectiveDescription = seoDescription?.trim() || excerpt.trim();
  const keywordCount = keyword
    ? (serialized.match(new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || [])
        .length
    : 0;
  const contentText = serialized
    .replace(/[^a-z0-9\s-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = contentText ? contentText.split(" ").length : 0;
  const keywordDensity = keyword && wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;
  const headingCount = content.filter(
    (node) =>
      typeof node === "object" &&
      node &&
      "type" in node &&
      (node as { type?: string }).type === "heading"
  ).length;
  const linkMatches = Array.from(html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)).map((match) =>
    String(match[1] || "")
  );
  const internalLinkCount = linkMatches.filter(
    (href) =>
      href.startsWith("/") ||
      href.includes("thetechnologyfiction.com")
  ).length;
  const externalLinkCount = linkMatches.filter(
    (href) =>
      href.startsWith("http://") || href.startsWith("https://")
  ).filter((href) => !href.includes("thetechnologyfiction.com")).length;

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
      wordCount >= 600,
      "Content length",
      "Aim for at least 600 words for stronger topical coverage."
    ),
    scoreItem(
      internalLinkCount >= 1,
      "Internal links",
      "Link to at least one relevant page or blog post on your own site."
    ),
    scoreItem(
      externalLinkCount >= 1,
      "External references",
      "Add at least one relevant external reference when it improves trust or context."
    ),
    scoreItem(
      !keyword || (keywordDensity >= 0.3 && keywordDensity <= 2.5),
      "Keyword density",
      keyword
        ? `Keep "${focusKeyword}" around 0.3% to 2.5% of the article body.`
        : "Set a focus keyword to evaluate density."
    ),
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
              <p className="text-xs leading-6 text-slate-500">
                {item.detail}
                {item.label === "Content length" ? ` Current: ${wordCount} words.` : ""}
                {item.label === "Internal links" ? ` Current: ${internalLinkCount}.` : ""}
                {item.label === "External references" ? ` Current: ${externalLinkCount}.` : ""}
                {item.label === "Keyword density" && keyword ? ` Current: ${keywordDensity.toFixed(2)}%.` : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
