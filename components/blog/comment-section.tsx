import type { Comment, Post } from "@/types/content";
import { formatDate } from "@/lib/utils/format";
import { CommentForm } from "@/components/blog/comment-form";
import { Card } from "@/components/ui/card";

export function CommentSection({
  post,
  comments
}: {
  post: Post;
  comments: Comment[];
}) {
  return (
    <section className="space-y-5 sm:space-y-6" aria-labelledby="comments-heading">
      <Card className="overflow-hidden p-5 sm:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Discussion</p>
        <h2 id="comments-heading" className="mt-2 text-xl font-semibold text-ink sm:text-2xl">
          Questions and comments
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          Ask a thoughtful question, add context from your own implementation, or share what helped you most.
        </p>
        <div className="mt-5 border-t border-slate-200/80 pt-5 sm:mt-6 sm:pt-6">
          <CommentForm postId={post.id} postSlug={post.slug} postTitle={post.title} />
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-ink">
            Approved comments ({comments.length})
          </h3>
          <p className="text-sm text-slate-500">Only approved comments appear publicly.</p>
        </div>

        {comments.length > 0 ? (
          comments.map((comment) => (
            <Card key={comment.id} className="p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">{comment.authorName}</p>
                  <p className="text-sm text-slate-500">{formatDate(comment.approvedAt || comment.submittedAt)}</p>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700 sm:mt-4">
                {comment.content}
              </p>
            </Card>
          ))
        ) : (
          <Card className="p-5 text-sm leading-7 text-slate-500 sm:p-6">
            No approved comments yet. Be the first to ask a useful question or add your perspective.
          </Card>
        )}
      </div>
    </section>
  );
}
