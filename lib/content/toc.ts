import type { RichTextNode, TocItem } from "@/types/content";
import { slugify } from "@/lib/utils/format";

export function normalizeContentHeadings(content: RichTextNode[]): RichTextNode[] {
  return content.flatMap<RichTextNode>((node) => {
    switch (node.type) {
      case "heading": {
        const text = node.text?.trim() || "";
        if (!text) return [];

        return [
          {
            ...node,
            level: node.level === 3 ? 3 : 2,
            text,
            id: node.id || slugify(text)
          }
        ];
      }
      case "paragraph": {
        const text = node.text?.trim() || "";
        return text ? [{ ...node, text }] : [];
      }
      case "blockquote": {
        const text = node.text?.trim() || "";
        return text ? [{ ...node, text }] : [];
      }
      case "bulletList":
      case "orderedList": {
        const items = node.items.map((item) => item.trim()).filter(Boolean);
        return items.length ? [{ ...node, items }] : [];
      }
      case "codeBlock": {
        const code = node.code?.trim() || "";
        return code ? [{ ...node, code }] : [];
      }
      case "image":
        return node.src ? [node] : [];
      case "video":
        return node.src ? [node] : [];
      case "callout": {
        const title = node.title?.trim() || "";
        const body = node.body?.trim() || "";
        return title || body ? [{ ...node, title, body }] : [];
      }
      default:
        return [node];
    }
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
