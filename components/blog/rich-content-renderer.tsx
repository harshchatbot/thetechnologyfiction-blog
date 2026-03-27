import { cn } from "@/lib/utils/cn";
import { ExternalImage } from "@/components/blog/external-image";
import { LinkifiedText } from "@/components/blog/linkified-text";
import type { RichTextNode } from "@/types/content";

export function RichContentRenderer({ content }: { content: RichTextNode[] }) {
  return (
    <div id="article-content" className="prose-article space-y-7">
      {content.map((node, index) => {
        switch (node.type) {
          case "paragraph":
            return (
              <p
                key={index}
                className="text-lg leading-8 text-slate-700"
                style={{
                  textAlign: node.align || "left",
                  color: node.color || undefined
                }}
              >
                <LinkifiedText text={node.text} />
              </p>
            );
          case "heading":
            if (node.level === 2) {
              return (
                <h2
                  key={index}
                  id={node.id}
                  className="pt-6 text-3xl font-semibold text-ink"
                  style={{
                    textAlign: node.align || "left",
                    color: node.color || undefined
                  }}
                >
                  {node.text}
                </h2>
              );
            }
            return (
              <h3
                key={index}
                id={node.id}
                className="pt-4 text-2xl font-semibold text-ink"
                style={{
                  textAlign: node.align || "left",
                  color: node.color || undefined
                }}
              >
                {node.text}
              </h3>
            );
          case "bulletList":
            return (
              <ul
                key={index}
                className="space-y-3 pl-6 text-lg leading-8 text-slate-700"
                style={{ color: node.color || undefined }}
              >
                {node.items.map((item) => (
                  <li key={item} className="list-disc">
                    <LinkifiedText text={item} />
                  </li>
                ))}
              </ul>
            );
          case "orderedList":
            return (
              <ol
                key={index}
                className="space-y-3 pl-6 text-lg leading-8 text-slate-700"
                style={{ color: node.color || undefined }}
              >
                {node.items.map((item) => (
                  <li key={item} className="list-decimal">
                    <LinkifiedText text={item} />
                  </li>
                ))}
              </ol>
            );
          case "blockquote":
            return (
              <blockquote
                key={index}
                className="rounded-[2rem] border border-accent/15 bg-accent/5 p-6 text-xl leading-8 text-ink"
                style={{
                  textAlign: node.align || "left",
                  color: node.color || undefined
                }}
              >
                <p>
                  <LinkifiedText text={node.text} />
                </p>
                {node.citation && (
                  <footer className="mt-4 text-sm uppercase tracking-[0.18em] text-slate-500">
                    {node.citation}
                  </footer>
                )}
              </blockquote>
            );
          case "codeBlock":
            return (
              <pre
                key={index}
                className="overflow-x-auto rounded-[2rem] bg-slate-950 p-5 text-sm leading-7 text-slate-100"
              >
                <code>{node.code}</code>
              </pre>
            );
          case "image":
            return (
              <figure key={index} className="space-y-3">
                <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[#f4efe5] p-3 sm:p-4">
                  <ExternalImage
                    src={node.src}
                    alt={node.alt}
                    loading="lazy"
                    className="mx-auto h-auto max-h-[70vh] w-full rounded-[1.25rem] object-contain"
                  />
                </div>
                {node.caption && (
                  <figcaption className="text-sm text-slate-500">{node.caption}</figcaption>
                )}
              </figure>
            );
          case "video":
            return (
              <figure key={index} className="space-y-3">
                <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[#f4efe5] p-3 sm:p-4">
                  <video
                    src={node.src}
                    controls
                    preload="metadata"
                    playsInline
                    className="mx-auto h-auto max-h-[70vh] w-full rounded-[1.25rem] bg-black object-contain"
                  />
                </div>
                <figcaption className="space-y-1">
                  <p className="text-base font-medium text-ink">{node.title}</p>
                  {node.caption ? (
                    <p className="text-sm text-slate-500">{node.caption}</p>
                  ) : null}
                </figcaption>
              </figure>
            );
          case "callout":
            return (
              <div
                key={index}
                className={cn(
                  "rounded-[2rem] border p-6",
                  node.tone === "info" && "border-sky-200 bg-sky-50",
                  node.tone === "warning" && "border-amber-200 bg-amber-50",
                  node.tone === "success" && "border-emerald-200 bg-emerald-50"
                )}
              >
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {node.title}
                </p>
                <p className="mt-3 text-base leading-7 text-slate-700">{node.body}</p>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
