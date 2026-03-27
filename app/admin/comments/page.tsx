import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { approveCommentAction, rejectCommentAction } from "@/features/comments/actions";
import { getAllCommentsAdmin } from "@/lib/content/repository";
import { requireAdminUser } from "@/lib/firebase/auth";
import { formatDate } from "@/lib/utils/format";

export default async function AdminCommentsPage() {
  const user = await requireAdminUser();
  const comments = await getAllCommentsAdmin();
  const pendingCount = comments.filter((comment) => comment.status === "pending").length;
  const approvedCount = comments.filter((comment) => comment.status === "approved").length;
  const blockedCount = comments.filter((comment) => comment.status === "rejected" || comment.status === "spam").length;

  return (
    <AdminShell
      user={user}
      currentPath="/admin/comments"
      title="Comments"
      description="Review reader questions before they go live, and keep spam or low-value submissions out of public article pages."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Pending review</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{pendingCount}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Approved</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{approvedCount}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Blocked</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{blockedCount}</p>
        </Card>
      </div>

      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Card key={comment.id} className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-semibold text-ink">{comment.authorName}</p>
                    <span className="rounded-full border border-slate-200 bg-[#fbfaf7] px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                      {comment.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{comment.authorEmail}</p>
                  <p className="text-sm text-slate-500">
                    On{" "}
                    <Link href={`/blog/${comment.postSlug}`} className="font-medium text-accent hover:underline">
                      {comment.postTitle}
                    </Link>{" "}
                    · Submitted {formatDate(comment.submittedAt)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <form action={approveCommentAction}>
                    <input type="hidden" name="id" value={comment.id} />
                    <Button type="submit" variant="secondary">
                      Approve
                    </Button>
                  </form>
                  <form action={rejectCommentAction}>
                    <input type="hidden" name="id" value={comment.id} />
                    <Button type="submit" variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                      Reject
                    </Button>
                  </form>
                </div>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {comment.content}
              </p>

              {comment.moderationNotes ? (
                <div className="mt-4 rounded-[1.25rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  Moderation notes: {comment.moderationNotes}
                </div>
              ) : null}
            </Card>
          ))
        ) : (
          <Card className="p-6 text-sm text-slate-500">
            No comments have been submitted yet.
          </Card>
        )}
      </div>
    </AdminShell>
  );
}
