"use client";

import { useEffect, useMemo, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import type { MediaItem, RichTextNode } from "@/types/content";
import { MediaThumbnail } from "@/components/admin/media-thumbnail";
import { Button } from "@/components/ui/button";

type Props = {
  value: RichTextNode[];
  media?: MediaItem[];
  onChange: (value: RichTextNode[]) => void;
  onHtmlChange?: (value: string) => void;
};

export function TiptapEditor({
  value,
  media = [],
  onChange,
  onHtmlChange
}: Props) {
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaSearch, setMediaSearch] = useState("");
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true
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
      onHtmlChange?.(currentEditor.getHTML());
    }
  });

  useEffect(() => {
    if (!editor) return;
    onHtmlChange?.(editor.getHTML());
  }, [editor, onHtmlChange]);

  const filteredMedia = useMemo(() => {
    const query = mediaSearch.trim().toLowerCase();
    if (!query) return media;
    return media.filter((item) =>
      [item.title, item.alt, item.caption, item.url]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [media, mediaSearch]);

  if (!editor) return null;

  const toolbarButtonClass = (active: boolean) =>
    active
      ? "border-accent/40 bg-accent/10 text-accent hover:bg-accent/15"
      : "text-slate-600 hover:bg-slate-100";

  const insertLink = () => {
    const url = window.prompt("Enter link URL");
    if (!url) return;
    const currentSelection = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to
    );

    if (currentSelection) {
      editor.chain().focus().setLink({ href: url }).run();
      return;
    }

    const label = window.prompt("Enter link text", url) || url;
    editor
      .chain()
      .focus()
      .insertContent(`<a href="${url}" target="_blank" rel="noreferrer">${label}</a>`)
      .run();
  };

  const insertImage = (src?: string, alt?: string) => {
    const imageUrl = src || window.prompt("Enter image URL");
    if (!imageUrl) return;
    const imageAlt = alt || window.prompt("Enter alt text", "Article image") || "Article image";
    editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt, title: imageAlt }).run();
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white/85">
      <div className="flex flex-wrap gap-2 border-b border-slate-200 p-4">
        <Button type="button" variant="ghost" className={toolbarButtonClass(false)} onClick={() => editor.chain().focus().undo().run()}>
          Undo
        </Button>
        <Button type="button" variant="ghost" className={toolbarButtonClass(false)} onClick={() => editor.chain().focus().redo().run()}>
          Redo
        </Button>
        <Button type="button" variant="ghost" className={toolbarButtonClass(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}>
          Bold
        </Button>
        <Button type="button" variant="ghost" className={toolbarButtonClass(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}>
          Italic
        </Button>
        <Button type="button" variant="ghost" className={toolbarButtonClass(editor.isActive("underline"))} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          Underline
        </Button>
        <Button type="button" variant="ghost" className={toolbarButtonClass(editor.isActive("link"))} onClick={insertLink}>
          Link
        </Button>
        <Button
          type="button"
          variant="ghost"
          className={toolbarButtonClass(!editor.isActive("heading") && !editor.isActive("bulletList") && !editor.isActive("orderedList") && !editor.isActive("blockquote") && !editor.isActive("codeBlock"))}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          Paragraph
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="cursor-default text-slate-400 hover:bg-transparent hover:text-slate-400"
          disabled
          title="The post title is the page H1. Use H2 and H3 inside the article body for SEO best practice."
        >
          Title (H1)
        </Button>
        <Button type="button" variant="ghost" className={toolbarButtonClass(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </Button>
        <Button type="button" variant="ghost" className={toolbarButtonClass(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </Button>
        <Button type="button" variant="ghost" className={toolbarButtonClass(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          Bullet list
        </Button>
        <Button type="button" variant="ghost" className={toolbarButtonClass(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          Numbered list
        </Button>
        <Button type="button" variant="ghost" className={toolbarButtonClass(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          Quote
        </Button>
        <Button type="button" variant="ghost" className={toolbarButtonClass(editor.isActive("codeBlock"))} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          Code block
        </Button>
        <Button type="button" variant="ghost" className={toolbarButtonClass(false)} onClick={() => insertImage()}>
          Insert image
        </Button>
        <Button type="button" variant="ghost" className={toolbarButtonClass(isMediaPickerOpen)} onClick={() => setIsMediaPickerOpen(true)}>
          Media library
        </Button>
      </div>

      <EditorContent
        editor={editor}
        className="min-h-[360px] px-5 py-4 [&_.ProseMirror]:min-h-[320px] [&_.ProseMirror]:outline-none [&_.ProseMirror_a]:text-accent [&_.ProseMirror_a]:underline [&_.ProseMirror_a]:decoration-accent/40 [&_.ProseMirror_h2]:mt-6 [&_.ProseMirror_h2]:text-3xl [&_.ProseMirror_h3]:mt-5 [&_.ProseMirror_h3]:text-2xl [&_.ProseMirror_img]:my-4 [&_.ProseMirror_img]:rounded-[1rem] [&_.ProseMirror_img]:border [&_.ProseMirror_img]:border-slate-200 [&_.ProseMirror_img]:bg-[#f4efe5] [&_.ProseMirror_img]:p-2 [&_.ProseMirror_p]:leading-8 [&_.ProseMirror_pre]:rounded-[1rem] [&_.ProseMirror_pre]:bg-slate-950 [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:text-slate-100"
      />

      {isMediaPickerOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
          <button
            type="button"
            className="absolute inset-0 bg-[#07111f]/70 backdrop-blur-sm"
            onClick={() => setIsMediaPickerOpen(false)}
            aria-label="Close media picker"
          />
          <div className="relative z-10 w-full max-w-4xl rounded-[2rem] border border-white/60 bg-[#fbfaf7] p-6 shadow-[0_35px_120px_rgba(15,23,42,0.25)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Media library
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-ink">
                  Insert an image into the article
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-accent hover:text-accent"
              >
                ×
              </button>
            </div>

            <input
              type="text"
              value={mediaSearch}
              onChange={(event) => setMediaSearch(event.target.value)}
              placeholder="Search media by title, alt text, or URL"
              className="mt-5 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-2 focus:ring-accent/15"
            />

            <div className="mt-5 grid max-h-[60vh] gap-3 overflow-auto sm:grid-cols-2 xl:grid-cols-3">
              {filteredMedia.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    insertImage(item.url, item.alt);
                    setIsMediaPickerOpen(false);
                  }}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-1 hover:border-accent/30"
                >
                  <div className="overflow-hidden rounded-[1rem] border border-slate-200 bg-[#f4efe5]">
                    <MediaThumbnail
                      src={item.url}
                      alt={item.alt}
                      className="h-40 w-full object-contain bg-white p-3"
                    />
                  </div>
                  <p className="text-sm font-medium text-ink">{item.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                    {item.source}
                  </p>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                    {item.alt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type TiptapMark = {
  type?: string;
  attrs?: Record<string, unknown>;
};

type TiptapNode = {
  type?: string;
  attrs?: Record<string, unknown>;
  text?: string;
  marks?: TiptapMark[];
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
            items: (block.content || []).map((item) => flattenText(item.content)).filter(Boolean)
          }
        ];
      case "orderedList":
        return [
          {
            type: "orderedList",
            items: (block.content || []).map((item) => flattenText(item.content)).filter(Boolean)
          }
        ];
      case "blockquote":
        return text ? [{ type: "blockquote", text }] : [];
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
      if (node.text) {
        const linkMark = node.marks?.find((mark) => mark.type === "link");
        if (linkMark?.attrs?.href && !String(node.text).includes(String(linkMark.attrs.href))) {
          return `${node.text} ${String(linkMark.attrs.href)}`;
        }
        return node.text;
      }
      return flattenText(node.content);
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
