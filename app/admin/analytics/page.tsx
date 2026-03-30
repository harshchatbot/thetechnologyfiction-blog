import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";
import { requireAdminUser } from "@/lib/firebase/auth";
import { getAnalyticsDashboardData } from "@/lib/analytics/repository";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-ink">{value}</p>
    </Card>
  );
}

function ListCard({
  title,
  items,
  emptyLabel
}: {
  title: string;
  items: Array<{ label: string; count: number }>;
  emptyLabel: string;
}) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      {items.length ? (
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-[#fbfaf7] px-4 py-3"
            >
              <p className="min-w-0 flex-1 truncate text-sm text-slate-700">{item.label}</p>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm leading-7 text-slate-500">{emptyLabel}</p>
      )}
    </Card>
  );
}

export default async function AdminAnalyticsPage() {
  const user = await requireAdminUser();
  const data = await getAnalyticsDashboardData(30);

  return (
    <AdminShell
      user={user}
      currentPath="/admin/analytics"
      title="Analytics"
      description="A 30-day view of page traffic, article discovery, search behavior, and key CTA clicks captured inside the platform."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Page views" value={data.pageViews} />
        <StatCard label="Unique visitors" value={data.uniqueVisitors} />
        <StatCard label="Article clicks" value={data.articleClicks} />
        <StatCard label="Searches" value={data.searchCount} />
        <StatCard label="WhatsApp clicks" value={data.whatsappClicks} />
        <StatCard label="Newsletter clicks" value={data.newsletterClicks} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ListCard
          title="Top pages"
          items={data.topPages}
          emptyLabel="Page view analytics will appear here once people start browsing the site."
        />
        <ListCard
          title="Top article clicks"
          items={data.topArticles}
          emptyLabel="Article click analytics will appear once readers start opening posts from lists and cards."
        />
        <ListCard
          title="Top searches"
          items={data.topSearches}
          emptyLabel="Search terms from the blog hub will appear here after readers use the search bar."
        />
        <ListCard
          title="Top CTA activity"
          items={data.topCtas}
          emptyLabel="CTA click analytics will appear here after readers interact with WhatsApp, newsletter, and homepage entry points."
        />
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-ink">Notes</h2>
        <div className="mt-4 space-y-2 text-sm leading-7 text-slate-600">
          <p>This dashboard uses internal event logging for quick editorial visibility inside the admin.</p>
          <p>For acquisition, channels, and broader traffic reporting, continue using GA4 and Search Console alongside this view.</p>
          <p>Comment submissions tracked here reflect submission attempts from the public article form.</p>
        </div>
      </Card>
    </AdminShell>
  );
}
