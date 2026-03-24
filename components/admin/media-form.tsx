"use client";

import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function MediaForm({ action }: { action: (formData: FormData) => Promise<void> }) {
  const [sourceType, setSourceType] = useState<"external" | "firebase">("external");
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Card className="self-start p-6">
      <h2 className="text-xl font-semibold text-ink">Add media</h2>
      <form
        ref={formRef}
        className="mt-4 grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!formRef.current) return;
          const formData = new FormData(formRef.current);
          formData.set("sourceType", sourceType);
          startTransition(async () => action(formData));
        }}
      >
        <div className="flex gap-3 text-sm">
          <button type="button" className={sourceType === "external" ? "font-semibold text-ink" : "text-slate-500"} onClick={() => setSourceType("external")}>
            External URL
          </button>
          <button type="button" className={sourceType === "firebase" ? "font-semibold text-ink" : "text-slate-500"} onClick={() => setSourceType("firebase")}>
            Firebase upload
          </button>
        </div>
        <Input name="title" placeholder="Media title" required />
        <Input name="alt" placeholder="Alt text" required />
        <Textarea name="caption" placeholder="Caption" />
        {sourceType === "external" ? (
          <Input name="externalUrl" type="url" placeholder="https://example.com/image.jpg" required />
        ) : (
          <Input name="file" type="file" accept="image/*" required />
        )}
        <Button disabled={pending}>{pending ? "Saving..." : "Save media"}</Button>
      </form>
    </Card>
  );
}
