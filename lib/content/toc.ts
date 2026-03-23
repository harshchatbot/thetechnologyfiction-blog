import type { RichTextNode, TocItem } from "@/types/content";
import { slugify } from "@/lib/utils/format";

export function normalizeContentHeadings(content: RichTextNode[]) {
  return content.map((node) => {
    if (node.type !== "heading") return node;
    return {
      ...node,
      id: node.id || slugify(node.text)
    };
  });
}

export function extractToc(content: RichTextNode[]): TocItem[] {
  const normalized = normalizeContentHeadings(content);
  const headings = normalized.filter((node) => node.type === "heading") as Array<
    Extract<RichTextNode, { type: "heading" }>
  >;

  return headings.map((node) => ({
    id: node.id || slugify(node.text),
    text: node.text,
    level: node.level
  }));
}
