"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { submitCommentAction } from "@/features/comments/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  postId: string;
  postSlug: string;
  postTitle: string;
};

export function CommentForm({ postId, postSlug, postTitle }: Props) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setStartedAt(String(Date.now()));
  }, []);

  return (
    <form
      ref={formRef}
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (!formRef.current) return;

        setMessage(null);
        setError(null);

        const formData = new FormData(formRef.current);
        formData.set("postId", postId);
        formData.set("postSlug", postSlug);
        formData.set("postTitle", postTitle);
        formData.set("formStartedAt", startedAt || String(Date.now()));

        startTransition(async () => {
          try {
            const result = await submitCommentAction(formData);
            setMessage(result.message);
            formRef.current?.reset();
            setStartedAt(String(Date.now()));
          } catch (submissionError) {
            setError(
              submissionError instanceof Error
                ? submissionError.message
                : "We could not submit your comment right now."
            );
          }
        });
      }}
    >
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <Input name="authorName" placeholder="Your name" required />
        <Input name="authorEmail" type="email" placeholder="Your email" required />
      </div>
      <Textarea
        name="content"
        placeholder="Ask a thoughtful question or share your perspective on the article."
        required
        minLength={8}
      />
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="max-w-xl text-xs leading-6 text-slate-500">
          Comments are moderated before going live to keep the discussion useful and spam-free.
        </p>
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
          {pending ? "Submitting..." : "Submit comment"}
        </Button>
      </div>
    </form>
  );
}
