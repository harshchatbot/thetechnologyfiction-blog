"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function MediaForm({ action }: { action: (formData: FormData) => Promise<void> }) {
  const [sourceType, setSourceType] = useState<"external" | "firebase">("firebase");
  const [previewUrl, setPreviewUrl] = useState("");
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <Card className="self-start p-6">
      <h2 className="text-xl font-semibold text-ink">Add media</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Upload directly to Firebase Storage or register an external URL if you want to reuse an image hosted elsewhere.
      </p>
      <form
        ref={formRef}
        encType="multipart/form-data"
        className="mt-4 grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!formRef.current) return;
          const formData = new FormData(formRef.current);
          formData.set("sourceType", sourceType);
          startTransition(async () => action(formData));
        }}
      >
        <div className="grid grid-cols-2 gap-3 rounded-[1.25rem] border border-slate-200 bg-[#fbfaf7] p-2 text-sm">
          <button
            type="button"
            className={sourceType === "firebase" ? "rounded-full bg-white px-4 py-2 font-semibold text-ink shadow-soft" : "rounded-full px-4 py-2 text-slate-500"}
            onClick={() => setSourceType("firebase")}
          >
            Upload image
          </button>
          <button
            type="button"
            className={sourceType === "external" ? "rounded-full bg-white px-4 py-2 font-semibold text-ink shadow-soft" : "rounded-full px-4 py-2 text-slate-500"}
            onClick={() => setSourceType("external")}
          >
            External URL
          </button>
        </div>
        {sourceType === "firebase" ? (
          <div className="rounded-[1.25rem] border border-slate-200 bg-[#fbfaf7] p-4 text-sm text-slate-600">
            Upload a local image file and it will be stored in Firebase Storage.
          </div>
        ) : (
          <div className="rounded-[1.25rem] border border-slate-200 bg-[#fbfaf7] p-4 text-sm text-slate-600">
            Use this when the image already lives on another trusted host.
          </div>
        )}
        <Input name="title" placeholder="Media title" required />
        <Input name="alt" placeholder="Alt text" required />
        <Textarea name="caption" placeholder="Caption" />
        {sourceType === "external" ? (
          <Input
            name="externalUrl"
            type="url"
            placeholder="https://example.com/image.jpg"
            required
            onChange={(event) => setPreviewUrl(event.target.value)}
          />
        ) : (
          <Input
            name="file"
            type="file"
            accept="image/*"
            required
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
              }
              setPreviewUrl(file ? URL.createObjectURL(file) : "");
            }}
          />
        )}
        <div className="rounded-[1.25rem] border border-slate-200 bg-[#fbfaf7] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Preview</p>
          {previewUrl ? (
            <div className="mt-3 flex aspect-[16/10] items-center justify-center overflow-hidden rounded-[1rem] border border-slate-200 bg-white p-3">
              <img
                src={previewUrl}
                alt="Selected media preview"
                className="h-full w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Choose a local image or paste an external image URL to preview it before saving.
            </p>
          )}
        </div>
        <Button disabled={pending}>{pending ? "Saving..." : "Save media"}</Button>
      </form>
    </Card>
  );
}
