"use client";

import { useState } from "react";
import type { MediaItem } from "@/types/content";
import { MediaThumbnail } from "@/components/admin/media-thumbnail";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Props = {
  media: MediaItem[];
  deleteAction: (formData: FormData) => Promise<void>;
};

export function MediaLibraryGrid({ media, deleteAction }: Props) {
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {media.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <button
              type="button"
              className="flex aspect-[16/10] w-full items-center justify-center bg-[#fbfaf7] p-3 transition hover:bg-[#f5eee0]"
              onClick={() => setActiveItem(item)}
            >
              <MediaThumbnail
                src={item.url}
                alt={item.alt}
                mediaType={item.mediaType}
                mimeType={item.mimeType}
                className="h-full w-full object-contain rounded-[1rem] bg-white p-2"
              />
            </button>
            <div className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">{item.title}</p>
                  <p className="text-sm text-slate-500">
                    {(item.mediaType || "image") === "video" ? "Video" : "Image"} · {item.source === "firebase" ? "Firebase Storage" : "External URL"}
                  </p>
                </div>
                <form action={deleteAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <Button type="submit" variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                    Delete
                  </Button>
                </form>
              </div>
              <p className="text-xs leading-6 text-slate-500">{item.alt}</p>
              <p className="text-xs leading-6 text-slate-500 break-all">{item.url}</p>
            </div>
          </Card>
        ))}
      </div>

      {activeItem ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-6">
          <button
            type="button"
            className="absolute inset-0 bg-[#07111f]/70 backdrop-blur-sm"
            onClick={() => setActiveItem(null)}
            aria-label="Close media preview"
          />
          <div className="relative z-10 w-full max-w-5xl rounded-[2rem] border border-white/60 bg-[#fbfaf7] p-6 shadow-[0_35px_120px_rgba(15,23,42,0.25)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Media preview</p>
                <h3 className="mt-2 text-2xl font-semibold text-ink">{activeItem.title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">{activeItem.alt}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={activeItem.url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-5 py-2.5 text-sm font-medium text-ink transition hover:border-accent hover:text-accent"
                >
                  Download
                </a>
                <Button type="button" variant="ghost" onClick={() => setActiveItem(null)}>
                  Close
                </Button>
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-4">
              <MediaThumbnail
                src={activeItem.url}
                alt={activeItem.alt}
                mediaType={activeItem.mediaType}
                mimeType={activeItem.mimeType}
                className="max-h-[72vh] w-full rounded-[1rem] object-contain bg-white"
              />
            </div>

            {activeItem.caption ? (
              <p className="mt-4 text-sm leading-7 text-slate-600">{activeItem.caption}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
