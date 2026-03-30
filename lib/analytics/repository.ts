import { cache } from "react";
import type { AnalyticsEvent } from "@/types/content";
import { getFirebaseAdminDb } from "@/lib/firebase/admin";

type DashboardRow = {
  label: string;
  count: number;
};

export type AnalyticsDashboardData = {
  pageViews: number;
  uniqueVisitors: number;
  articleClicks: number;
  searchCount: number;
  whatsappClicks: number;
  newsletterClicks: number;
  commentSubmissions: number;
  topPages: DashboardRow[];
  topArticles: DashboardRow[];
  topSearches: DashboardRow[];
  topCtas: DashboardRow[];
};

function summarize(rows: Map<string, number>, limit = 5): DashboardRow[] {
  return Array.from(rows.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

export const getAnalyticsDashboardData = cache(
  async (days = 30): Promise<AnalyticsDashboardData> => {
    const db = getFirebaseAdminDb();
    if (!db) {
      return {
        pageViews: 0,
        uniqueVisitors: 0,
        articleClicks: 0,
        searchCount: 0,
        whatsappClicks: 0,
        newsletterClicks: 0,
        commentSubmissions: 0,
        topPages: [],
        topArticles: [],
        topSearches: [],
        topCtas: []
      };
    }

    const threshold = Date.now() - days * 24 * 60 * 60 * 1000;

    const snapshot = await db
      .collection("analytics_events")
      .orderBy("createdAt", "desc")
      .limit(2500)
      .get();

    const events = snapshot.docs
      .map((item) => item.data() as AnalyticsEvent)
      .filter((event) => new Date(event.createdAt).getTime() >= threshold);

    const visitors = new Set(events.map((event) => event.visitorId));
    const pageRows = new Map<string, number>();
    const articleRows = new Map<string, number>();
    const searchRows = new Map<string, number>();
    const ctaRows = new Map<string, number>();

    let pageViews = 0;
    let articleClicks = 0;
    let searchCount = 0;
    let whatsappClicks = 0;
    let newsletterClicks = 0;
    let commentSubmissions = 0;

    for (const event of events) {
      if (event.eventName === "page_view") {
        pageViews += 1;
        pageRows.set(event.path, (pageRows.get(event.path) || 0) + 1);
      }

      if (event.eventName === "blog_article_click") {
        articleClicks += 1;
        const label =
          String(event.params?.article_title || event.params?.article_slug || event.path);
        articleRows.set(label, (articleRows.get(label) || 0) + 1);
      }

      if (event.eventName === "blog_search") {
        searchCount += 1;
        const label = String(event.params?.search_term || "(empty)");
        searchRows.set(label, (searchRows.get(label) || 0) + 1);
      }

      if (event.eventName === "whatsapp_click") {
        whatsappClicks += 1;
        ctaRows.set("WhatsApp", (ctaRows.get("WhatsApp") || 0) + 1);
      }

      if (
        event.eventName === "newsletter_signup_click" ||
        event.eventName === "newsletter_cta_click"
      ) {
        newsletterClicks += 1;
        ctaRows.set("Newsletter", (ctaRows.get("Newsletter") || 0) + 1);
      }

      if (event.eventName === "comment_submit") {
        commentSubmissions += 1;
        ctaRows.set("Comment submit", (ctaRows.get("Comment submit") || 0) + 1);
      }

      if (
        event.eventName.endsWith("_cta_click") &&
        event.eventName !== "newsletter_cta_click"
      ) {
        const label = String(event.eventName).replace(/_/g, " ");
        ctaRows.set(label, (ctaRows.get(label) || 0) + 1);
      }
    }

    return {
      pageViews,
      uniqueVisitors: visitors.size,
      articleClicks,
      searchCount,
      whatsappClicks,
      newsletterClicks,
      commentSubmissions,
      topPages: summarize(pageRows),
      topArticles: summarize(articleRows),
      topSearches: summarize(searchRows),
      topCtas: summarize(ctaRows)
    };
  }
);
