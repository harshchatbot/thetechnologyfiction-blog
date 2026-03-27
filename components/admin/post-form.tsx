"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Category, MediaItem, Post, Tag } from "@/types/content";
import { postFormSchema, type PostFormValues } from "@/features/posts/schema";
import { slugify } from "@/lib/utils/format";
import { TiptapEditor } from "@/features/editor/tiptap-editor";
import { SeoChecklist } from "@/components/admin/seo-checklist";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichContentRenderer } from "@/components/blog/rich-content-renderer";
import { isVideoMedia } from "@/lib/content/media";

type Props = {
  post?: Post | null;
  categories: Category[];
  tags: Tag[];
  media: MediaItem[];
  action: (formData: FormData) => Promise<void>;
  savedState?: string;
};

function isRedirectSignal(error: unknown) {
  if (!error || typeof error !== "object") return false;

  const maybeRedirect = error as { digest?: string; message?: string };
  return (
    maybeRedirect.message === "NEXT_REDIRECT" ||
    maybeRedirect.digest?.startsWith("NEXT_REDIRECT;") === true
  );
}

export function PostForm({ post, categories, tags, media, action, savedState }: Props) {
  const [pending, startTransition] = useTransition();
  const [submissionState, setSubmissionState] = useState<"draft" | "published" | "archived" | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [content, setContent] = useState<Post["content"]>(
    post?.content || [{ type: "paragraph", text: "" }]
  );
  const [contentHtml, setContentHtml] = useState(post?.contentHtml || "");
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
      contentHtml: post?.contentHtml || "",
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
  const slugField = form.register("slug");

  const watchedTitle = form.watch("title");
  const watchedStatus = form.watch("status");
  const watchedExcerpt = form.watch("excerpt");
  const watchedSeoDescription = form.watch("seoDescription");
  const watchedFeaturedImageId = form.watch("featuredImageId");
  const watchedFocusKeyword = form.watch("focusKeyword");

  const selectedFeaturedImage = useMemo(
    () => media.find((item) => item.id === watchedFeaturedImageId),
    [media, watchedFeaturedImageId]
  );
  const featuredImageOptions = useMemo(
    () => media.filter((item) => !isVideoMedia(item)),
    [media]
  );

  const wordCount = useMemo(() => {
    const serialized = JSON.stringify(content)
      .replace(/[^\w\s-]/g, " ")
      .trim();
    return serialized ? serialized.split(/\s+/).length : 0;
  }, [content]);

  const headingCount = useMemo(
    () => content.filter((node) => node.type === "heading").length,
    [content]
  );

  const publishBlockers = useMemo(() => {
    const blockers: string[] = [];

    if (!watchedTitle.trim()) blockers.push("Add a title before publishing.");
    if ((watchedExcerpt || "").trim().length < 120) {
      blockers.push("Write an excerpt of at least 120 characters.");
    }
    if (!watchedFeaturedImageId) {
      blockers.push("Choose a featured image for stronger click-through rate.");
    }
    if (headingCount < 2) {
      blockers.push("Add at least two headings to improve readability and SEO structure.");
    }
    if (wordCount < 250) {
      blockers.push("Expand the article body to at least 250 words.");
    }
    if ((watchedSeoDescription || "").trim().length < 120) {
      blockers.push("Add an SEO description between 120 and 165 characters.");
    }
    if (!watchedFocusKeyword?.trim()) {
      blockers.push("Set one focus keyword before publishing.");
    }

    return blockers;
  }, [
    headingCount,
    watchedExcerpt,
    watchedFeaturedImageId,
    watchedFocusKeyword,
    watchedSeoDescription,
    watchedTitle,
    wordCount
  ]);

  const isPublishReady = watchedStatus !== "published" || publishBlockers.length === 0;
  const saveFeedback =
    savedState === "draft"
      ? "Draft saved. You can find it anytime in Admin > Posts with the Draft status."
      : savedState === "published"
        ? "Post published successfully."
        : savedState === "archived"
          ? "Post archived successfully."
          : null;

  useEffect(() => {
    if (!manualSlug) {
      form.setValue("slug", slugify(watchedTitle || ""));
    }
  }, [watchedTitle, manualSlug, form]);

  useEffect(() => {
    if (!pending && submissionState) {
      console.log("[PostForm] Submission transition completed", {
        status: submissionState,
        postId: post?.id ?? "new-post"
      });
    }
  }, [pending, post?.id, submissionState]);

  return (
    <form
      ref={formRef}
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"
      onSubmit={form.handleSubmit((values, event) => {
        event?.preventDefault();
        if (!formRef.current) {
          console.error("[PostForm] Form ref is unavailable while submitting");
          setSubmitError("The editor form was not ready. Please try again.");
          return;
        }

        const formData = new FormData(formRef.current);
        formData.set("contentJson", JSON.stringify(content));
        formData.set("contentHtml", contentHtml);
        formData.set("tagIds", JSON.stringify(values.tagIds || []));
        formData.set("featured", String(values.featured));
        setSubmissionState(values.status);
        setSubmitError(null);
        console.log("[PostForm] Submitting post form", {
          mode: values.status,
          postId: values.id ?? "new-post",
          title: values.title,
          slug: values.slug,
          contentNodes: content.length
        });
        startTransition(async () => {
          try {
            await action(formData);
            console.log("[PostForm] Server action finished successfully", {
              mode: values.status,
              postId: values.id ?? "new-post"
            });
          } catch (error) {
            if (isRedirectSignal(error)) {
              console.log("[PostForm] Redirecting after successful save", {
                mode: values.status,
                postId: values.id ?? "new-post"
              });
              return;
            }

            const message =
              error instanceof Error ? error.message : "Something went wrong while saving the post.";
            console.error("[PostForm] Failed to save post", error);
            setSubmitError(message);
          }
        });
      })}
    >
      {pending ? (
        <Card className="xl:col-span-2 border-accent/20 bg-accent/5 p-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
            <div>
              <p className="text-sm font-semibold text-ink">
                {submissionState === "published" ? "Publishing post..." : "Saving draft..."}
              </p>
              <p className="text-sm text-slate-600">
                Please stay on this page for a moment while we store your changes.
              </p>
            </div>
          </div>
        </Card>
      ) : null}
      {saveFeedback ? (
        <Card className="xl:col-span-2 border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-900">{saveFeedback}</p>
        </Card>
      ) : null}
      {submitError ? (
        <Card className="xl:col-span-2 border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-900">We could not save your post.</p>
          <p className="mt-1 text-sm text-red-800">{submitError}</p>
        </Card>
      ) : null}
      <div className="space-y-6">
        <Card className="p-6">
          <div className="grid gap-5">
            <Input placeholder="Post title" {...form.register("title")} />
            <Input
              placeholder="Post slug"
              {...slugField}
              onChange={(event) => {
                slugField.onChange(event);
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
          <div className="mb-4 flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="rounded-full border border-slate-200 bg-[#fbfaf7] px-3 py-1.5">
              {wordCount} words
            </span>
            <span className="rounded-full border border-slate-200 bg-[#fbfaf7] px-3 py-1.5">
              {headingCount} headings
            </span>
            <span className="rounded-full border border-slate-200 bg-[#fbfaf7] px-3 py-1.5">
              {Math.max(3, Math.ceil(wordCount / 220))} min read
            </span>
          </div>
          <TiptapEditor
            value={content}
            media={media}
            onChange={setContent}
            onHtmlChange={setContentHtml}
          />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-ink">SEO settings</h2>
          <div className="mt-4 grid gap-4">
            <Input placeholder="SEO title" {...form.register("seoTitle")} />
            <Textarea placeholder="SEO description" {...form.register("seoDescription")} />
            <Input placeholder="Canonical URL" {...form.register("canonicalUrl")} />
            <Input placeholder="Focus keyword" {...form.register("focusKeyword")} />
          </div>
          <div className="mt-5">
            <SeoChecklist
              title={form.watch("title")}
              excerpt={form.watch("excerpt")}
              seoTitle={form.watch("seoTitle")}
              seoDescription={form.watch("seoDescription")}
              focusKeyword={form.watch("focusKeyword")}
              content={content}
              contentHtml={contentHtml}
            />
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
            {watchedStatus === "published" && publishBlockers.length > 0 ? (
              <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-4 py-4">
                <p className="text-sm font-semibold text-amber-900">
                  Finish these checks before publishing
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-800">
                  {publishBlockers.map((blocker) => (
                    <li key={blocker}>• {blocker}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-900">
                {watchedStatus === "published"
                  ? "This post is ready to go live."
                  : "Draft mode keeps the article private while you keep editing."}
              </div>
            )}
            <Button disabled={pending || !isPublishReady}>
              {pending
                ? submissionState === "published"
                  ? "Publishing..."
                  : "Saving draft..."
                : watchedStatus === "published"
                  ? "Publish post"
                  : "Save draft"}
            </Button>
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
            {featuredImageOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          {selectedFeaturedImage ? (
            <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-[#fbfaf7]">
              <img
                src={selectedFeaturedImage.url}
                alt={selectedFeaturedImage.alt}
                className="h-44 w-full object-contain bg-white p-3"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="border-t border-slate-200 px-4 py-3">
                <p className="text-sm font-medium text-ink">{selectedFeaturedImage.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {selectedFeaturedImage.alt}
                </p>
              </div>
            </div>
          ) : null}
          <p className="mt-3 text-xs leading-6 text-slate-500">
            Featured images improve article cards, Open Graph sharing, and search result quality.
          </p>
        </Card>
      </div>

      <Card className="xl:col-span-2 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-ink">Live preview</h2>
            <p className="mt-1 text-sm text-slate-500">
              Review the article with more breathing room before publishing.
            </p>
          </div>
          <span className="rounded-full border border-slate-200 bg-[#fbfaf7] px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-slate-500">
            Editorial preview
          </span>
        </div>
        <div className="mt-5 rounded-[2rem] border border-slate-200 bg-[#fbfaf7] p-5 sm:p-8">
          <div className="mx-auto max-w-4xl">
            <h3 className="text-3xl font-semibold text-ink">
              {form.watch("title") || "Draft title preview"}
            </h3>
            <p className="mt-4 text-base leading-8 text-slate-600">
              {form.watch("excerpt") || "Your article excerpt will appear here."}
            </p>
            <div className="mt-8 border-t border-slate-200 pt-6">
              <RichContentRenderer content={content} />
            </div>
          </div>
        </div>
      </Card>

      <input type="hidden" name="id" value={post?.id || ""} />
      <input type="hidden" name="tagIds" value={JSON.stringify(form.watch("tagIds") || [])} />
      <input type="hidden" name="contentJson" value={JSON.stringify(content)} />
      <input type="hidden" name="contentHtml" value={contentHtml} />
      <input type="hidden" name="featured" value={String(form.watch("featured"))} />
    </form>
  );
}
