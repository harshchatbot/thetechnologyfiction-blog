"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { firebaseStorage } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function MediaForm({ action }: { action: (formData: FormData) => Promise<void> }) {
  const [sourceType, setSourceType] = useState<"external" | "firebase">("firebase");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
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
        Upload images or videos directly to Firebase Storage, or register an external media URL when needed.
      </p>
      <form
        ref={formRef}
        encType="multipart/form-data"
        className="mt-4 grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!formRef.current) return;
          setSubmitError(null);
          startTransition(async () => {
            try {
              const formData = new FormData(formRef.current as HTMLFormElement);
              formData.set("sourceType", sourceType);
              formData.set("mediaType", mediaType);

              if (sourceType === "firebase") {
                const file = formData.get("file") as File | null;
                if (!file || file.size === 0) {
                  throw new Error(`Choose a ${mediaType} file to upload.`);
                }
                if (!firebaseStorage) {
                  throw new Error("Firebase Storage client is not configured.");
                }

                const extension = file.name.split(".").pop() || (mediaType === "video" ? "mp4" : "jpg");
                const storagePath = `media/${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`;
                const storageRef = ref(firebaseStorage, storagePath);
                const uploadTask = uploadBytesResumable(storageRef, file, {
                  contentType: file.type
                });

                const uploadedUrl = await new Promise<string>((resolve, reject) => {
                  uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                      setUploadProgress(progress);
                    },
                    reject,
                    async () => {
                      try {
                        const url = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(url);
                      } catch (downloadError) {
                        reject(downloadError);
                      }
                    }
                  );
                });

                formData.set("uploadedUrl", uploadedUrl);
                formData.set("uploadedStoragePath", storagePath);
                formData.set("uploadedMimeType", file.type);
                formData.delete("file");
              }

              await action(formData);
              formRef.current?.reset();
              setPreviewUrl("");
              setUploadProgress(null);
            } catch (submissionError) {
              setUploadProgress(null);
              setSubmitError(
                submissionError instanceof Error
                  ? submissionError.message
                  : "We could not save this media item."
              );
            }
          });
        }}
      >
        <div className="grid grid-cols-2 gap-3 rounded-[1.25rem] border border-slate-200 bg-[#fbfaf7] p-2 text-sm">
          <button
            type="button"
            className={mediaType === "image" ? "rounded-full bg-white px-4 py-2 font-semibold text-ink shadow-soft" : "rounded-full px-4 py-2 text-slate-500"}
            onClick={() => setMediaType("image")}
          >
            Image
          </button>
          <button
            type="button"
            className={mediaType === "video" ? "rounded-full bg-white px-4 py-2 font-semibold text-ink shadow-soft" : "rounded-full px-4 py-2 text-slate-500"}
            onClick={() => setMediaType("video")}
          >
            Video
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 rounded-[1.25rem] border border-slate-200 bg-[#fbfaf7] p-2 text-sm">
          <button
            type="button"
            className={sourceType === "firebase" ? "rounded-full bg-white px-4 py-2 font-semibold text-ink shadow-soft" : "rounded-full px-4 py-2 text-slate-500"}
            onClick={() => setSourceType("firebase")}
          >
            Upload file
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
            Upload a local {mediaType} file and it will be stored in Firebase Storage.
          </div>
        ) : (
          <div className="rounded-[1.25rem] border border-slate-200 bg-[#fbfaf7] p-4 text-sm text-slate-600">
            Use this when the {mediaType} already lives on another trusted host.
          </div>
        )}
        <Input name="title" placeholder="Media title" required />
        <Input name="alt" placeholder="Alt text" required />
        <Textarea name="caption" placeholder="Caption" />
        {sourceType === "external" ? (
          <Input
            name="externalUrl"
            type="url"
            placeholder={mediaType === "video" ? "https://example.com/demo-video.mp4" : "https://example.com/image.jpg"}
            required
            onChange={(event) => setPreviewUrl(event.target.value)}
          />
        ) : (
          <Input
            name="file"
            type="file"
            accept={mediaType === "video" ? "video/mp4,video/webm,video/quicktime" : "image/*"}
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
              {mediaType === "video" ? (
                <video
                  src={previewUrl}
                  className="h-full w-full rounded-[0.75rem] object-contain"
                  controls
                  preload="metadata"
                  playsInline
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="Selected media preview"
                  className="h-full w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Choose a local {mediaType} or paste an external {mediaType} URL to preview it before saving.
            </p>
          )}
        </div>
        {uploadProgress !== null ? (
          <div className="rounded-[1.25rem] border border-slate-200 bg-[#fbfaf7] p-4">
            <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
              <span>Uploading to Firebase Storage</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-200">
              <div
                className="h-2 rounded-full bg-accent transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : null}
        {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}
        <Button disabled={pending}>{pending ? "Saving..." : "Save media"}</Button>
      </form>
    </Card>
  );
}
