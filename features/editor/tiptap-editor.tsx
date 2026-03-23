"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import type { RichTextNode } from "@/types/content";

type Props = {
  value: RichTextNode[];
  onChange: (value: RichTextNode[]) => void;
};

export function TiptapEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false
      }),
      Image,
      Placeholder.configure({
        placeholder: "Write the article body..."
      })
    ],
    immediatelyRender: false,
    content: toTiptapDocument(value) as never,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(fromTiptapDocument(currentEditor.getJSON()));
    }
  });

  if (!editor) return null;

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white/85">
      <div className="flex flex-wrap gap-2 border-b border-slate-200 p-4">
        <Button type="button" variant="ghost" onClick={() => editor.chain().focus().toggleBold().run()}>
          Bold
        </Button>
        <Button type="button" variant="ghost" onClick={() => editor.chain().focus().toggleItalic().run()}>
          Italic
        </Button>
        <Button type="button" variant="ghost" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </Button>
        <Button type="button" variant="ghost" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </Button>
        <Button type="button" variant="ghost" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          Bullet list
        </Button>
        <Button type="button" variant="ghost" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          Numbered list
        </Button>
        <Button type="button" variant="ghost" onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          Quote
        </Button>
        <Button type="button" variant="ghost" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          Code
        </Button>
      </div>
      <EditorContent editor={editor} className="min-h-[360px] px-5 py-4 [&_.ProseMirror]:min-h-[320px] [&_.ProseMirror]:outline-none [&_.ProseMirror_h2]:mt-6 [&_.ProseMirror_h2]:text-3xl [&_.ProseMirror_h3]:mt-5 [&_.ProseMirror_h3]:text-2xl [&_.ProseMirror_p]:leading-8" />
    </div>
  );
}

type TiptapNode = {
  type?: string;
  attrs?: Record<string, unknown>;
  text?: string;
  content?: TiptapNode[];
};

function toTiptapDocument(nodes: RichTextNode[]) {
  return {
    type: "doc",
    content: nodes.flatMap<any>((node) => {
      switch (node.type) {
        case "paragraph":
          return [{ type: "paragraph", content: [{ type: "text", text: node.text }] }];
        case "heading":
          return [
            {
              type: "heading",
              attrs: { level: node.level },
              content: [{ type: "text", text: node.text }]
            }
          ];
        case "bulletList":
          return [
            {
              type: "bulletList",
              content: node.items.map((item) => ({
                type: "listItem",
                content: [{ type: "paragraph", content: [{ type: "text", text: item }] }]
              }))
            }
          ];
        case "orderedList":
          return [
            {
              type: "orderedList",
              content: node.items.map((item) => ({
                type: "listItem",
                content: [{ type: "paragraph", content: [{ type: "text", text: item }] }]
              }))
            }
          ];
        case "blockquote":
          return [
            {
              type: "blockquote",
              content: [{ type: "paragraph", content: [{ type: "text", text: node.text }] }]
            }
          ];
        case "codeBlock":
          return [
            {
              type: "codeBlock",
              attrs: { language: node.language },
              content: [{ type: "text", text: node.code }]
            }
          ];
        case "image":
          return [{ type: "image", attrs: { src: node.src, alt: node.alt, title: node.caption } }];
        case "callout":
          return [{ type: "paragraph", content: [{ type: "text", text: `${node.title}: ${node.body}` }] }];
        default:
          return [];
      }
    })
  };
}

function fromTiptapDocument(document: { content?: TiptapNode[] }): RichTextNode[] {
  const blocks = document.content || [];
  return blocks.flatMap<RichTextNode>((block) => {
    const text = flattenText(block.content);
    switch (block.type) {
      case "paragraph":
        return text ? [{ type: "paragraph", text }] : [];
      case "heading":
        return [
          {
            type: "heading",
            level: (block.attrs?.level as 2 | 3) || 2,
            text
          }
        ];
      case "bulletList":
        return [
          {
            type: "bulletList",
            items: (block.content || []).map((item) => flattenText(item.content))
          }
        ];
      case "orderedList":
        return [
          {
            type: "orderedList",
            items: (block.content || []).map((item) => flattenText(item.content))
          }
        ];
      case "blockquote":
        return [{ type: "blockquote", text }];
      case "codeBlock":
        return [
          {
            type: "codeBlock",
            code: text,
            language: block.attrs?.language as string | undefined
          }
        ];
      case "image":
        return [
          {
            type: "image",
            src: String(block.attrs?.src || ""),
            alt: String(block.attrs?.alt || ""),
            caption: block.attrs?.title ? String(block.attrs.title) : undefined
          }
        ];
      default:
        return [];
    }
  });
}

function flattenText(nodes?: TiptapNode[]): string {
  if (!nodes?.length) return "";
  return nodes
    .map((node) => {
      if (node.text) return node.text;
      return flattenText(node.content);
    })
    .join(" ")
    .trim();
}
