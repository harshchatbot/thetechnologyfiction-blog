"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Category, MediaItem, Post, Tag } from "@/types/content";
import { postFormSchema, type PostFormValues } from "@/features/posts/schema";
import { slugify } from "@/lib/utils/format";
import { TiptapEditor } from "@/features/editor/tiptap-editor";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichContentRenderer } from "@/components/blog/rich-content-renderer";

type Props = {
  post?: Post | null;
  categories: Category[];
  tags: Tag[];
  media: MediaItem[];
  action: (formData: FormData) => Promise<void>;
};

export function PostForm({ post, categories, tags, media, action }: Props) {
  const [pending, startTransition] = useTransition();
  const [content, setContent] = useState<Post["content"]>(
    post?.content || [{ type: "paragraph", text: "" }]
  );
  const [manualSlug, setManualSlug] = useState(Boolean(post?.slug));

  const defaults = useMemo<PostFormValues>(
    () => ({
      id: post?.id,
      title: post?.title || "",
      slug: post?.slug || "",
      subtitle: post?.subtitle || "",
      excerpt: post?.excerpt || "",
      categoryId: post?.category.id || categories[0]?.id || "",
      tagIds: post?.tags.map((tag) => tag.id) || [],
      featuredImageId: post?.featuredImage?.id || "",
      contentJson: JSON.stringify(post?.content || [{ type: "paragraph", text: "" }]),
      status: post?.status || "draft",
      featured: post?.featured || false,
      publishDate: post?.publishedAt ? post.publishedAt.slice(0, 16) : "",
      seoTitle: post?.seo.seoTitle || "",
      seoDescription: post?.seo.seoDescription || "",
      canonicalUrl: post?.seo.canonicalUrl || "",
      focusKeyword: post?.seo.focusKeyword || ""
    }),
    [post, categories]
  );

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: defaults
  });

  const watchedTitle = form.watch("title");

  useEffect(() => {
    if (!manualSlug) {
      form.setValue("slug", slugify(watchedTitle || ""));
    }
  }, [watchedTitle, manualSlug, form]);

  return (
    <form
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"
      onSubmit={form.handleSubmit((values, event) => {
        const htmlForm = event?.currentTarget as HTMLFormElement;
        const formData = new FormData(htmlForm);
        formData.set("contentJson", JSON.stringify(content));
        formData.set("tagIds", JSON.stringify(values.tagIds || []));
        formData.set("featured", String(values.featured));
        startTransition(async () => {
          await action(formData);
        });
      })}
    >
      <div className="space-y-6">
        <Card className="p-6">
          <div className="grid gap-5">
            <Input placeholder="Post title" {...form.register("title")} />
            <Input
              placeholder="Post slug"
              {...form.register("slug")}
              onChange={(event) => {
                setManualSlug(true);
                form.setValue("slug", event.target.value);
              }}
            />
            <Textarea placeholder="Subtitle" {...form.register("subtitle")} />
            <Textarea placeholder="Excerpt" {...form.register("excerpt")} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-ink">Article body</h2>
            <p className="mt-1 text-sm text-slate-500">
              The editor stores structured JSON so TOC generation and safe rendering stay predictable.
            </p>
          </div>
          <TiptapEditor value={content} onChange={setContent} />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-ink">SEO settings</h2>
          <div className="mt-4 grid gap-4">
            <Input placeholder="SEO title" {...form.register("seoTitle")} />
            <Textarea placeholder="SEO description" {...form.register("seoDescription")} />
            <Input placeholder="Canonical URL" {...form.register("canonicalUrl")} />
            <Input placeholder="Focus keyword" {...form.register("focusKeyword")} />
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-ink">Publish</h2>
          <div className="mt-4 grid gap-4">
            <select className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm" {...form.register("status")}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <Input type="datetime-local" {...form.register("publishDate")} />
            <label className="flex items-center gap-3 text-sm text-slate-600">
              <input type="checkbox" onChange={(event) => form.setValue("featured", event.target.checked)} defaultChecked={defaults.featured} />
              Mark as featured
            </label>
            <Button disabled={pending}>{pending ? "Saving..." : "Save post"}</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-ink">Taxonomy</h2>
          <div className="mt-4 grid gap-4">
            <select className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm" {...form.register("categoryId")}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="grid gap-2">
              {tags.map((tag) => (
                <label key={tag.id} className="flex items-center gap-3 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    value={tag.id}
                    checked={form.watch("tagIds")?.includes(tag.id)}
                    onChange={(event) => {
                      const current = new Set(form.getValues("tagIds"));
                      if (event.target.checked) current.add(tag.id);
                      else current.delete(tag.id);
                      form.setValue("tagIds", Array.from(current));
                    }}
                  />
                  {tag.name}
                </label>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-ink">Featured image</h2>
          <select className="mt-4 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm" {...form.register("featuredImageId")}>
            <option value="">None</option>
            {media.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-ink">Preview</h2>
          <div className="mt-4 rounded-[1.5rem] border border-slate-200 bg-[#fbfaf7] p-4">
            <h3 className="text-2xl font-semibold text-ink">{form.watch("title") || "Draft title preview"}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{form.watch("excerpt") || "Your article excerpt will appear here."}</p>
            <div className="mt-5 max-h-72 overflow-auto border-t border-slate-200 pt-4">
              <RichContentRenderer content={content} />
            </div>
          </div>
        </Card>
      </div>

      <input type="hidden" name="id" value={post?.id || ""} />
      <input type="hidden" name="tagIds" value={JSON.stringify(form.watch("tagIds") || [])} />
      <input type="hidden" name="contentJson" value={JSON.stringify(content)} />
      <input type="hidden" name="featured" value={String(form.watch("featured"))} />
    </form>
  );
}
