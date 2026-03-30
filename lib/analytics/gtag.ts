"use client";

type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    __ttfVisitorId?: string;
    __ttfSessionId?: string;
  }
}

const VISITOR_KEY = "ttf_visitor_id";
const SESSION_KEY = "ttf_session_id";

function getVisitorId() {
  if (typeof window === "undefined") return "";
  if (window.__ttfVisitorId) return window.__ttfVisitorId;

  const existing = window.localStorage.getItem(VISITOR_KEY);
  if (existing) {
    window.__ttfVisitorId = existing;
    return existing;
  }

  const nextValue = `visitor_${crypto.randomUUID()}`;
  window.localStorage.setItem(VISITOR_KEY, nextValue);
  window.__ttfVisitorId = nextValue;
  return nextValue;
}

function getSessionId() {
  if (typeof window === "undefined") return "";
  if (window.__ttfSessionId) return window.__ttfSessionId;

  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) {
    window.__ttfSessionId = existing;
    return existing;
  }

  const nextValue = `session_${crypto.randomUUID()}`;
  window.sessionStorage.setItem(SESSION_KEY, nextValue);
  window.__ttfSessionId = nextValue;
  return nextValue;
}

function sendAnalyticsEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") return;

  const payload = {
    eventName,
    path: `${window.location.pathname}${window.location.search}`,
    pageTitle: document.title,
    referrer: document.referrer || undefined,
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    params
  };

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }));
    return;
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true
  });
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }

  sendAnalyticsEvent(eventName, params);
}

export function trackPageView(pagePath: string) {
  sendAnalyticsEvent("page_view", {
    page_path: pagePath
  });
}
