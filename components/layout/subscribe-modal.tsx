"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { trackEvent } from "@/lib/analytics/gtag";

const STORAGE_KEY = "ttf_inner_circle_seen";

export function SubscribeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const hasSeenPopup = (()=>{try{return window.localStorage.getItem(STORAGE_KEY)}catch{return null}})();
    if (hasSeenPopup) return;

    const timer = window.setTimeout(() => setIsOpen(true), 4500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isOpen]);

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent("Join Inner Circle");
    const body = encodeURIComponent(
      `Please add me to The Technology Fiction Inner Circle.\n\nEmail: ${email || "[not provided]"}`
    );
    return `mailto:hello@thetechnologyfiction.com?subject=${subject}&body=${body}`;
  }, [email]);

  const handleClose = () => {
    trackEvent("newsletter_popup_dismiss", {
      placement: "subscribe_modal"
    });
    setIsOpen(false);
    try { window.localStorage.setItem(STORAGE_KEY, "true"); } catch {}
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    trackEvent("newsletter_signup_click", {
      placement: "subscribe_modal",
      email_provided: Boolean(email)
    });
    setSubmitted(true);
    try { window.localStorage.setItem(STORAGE_KEY, "true"); } catch {}
    window.location.href = mailtoHref;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close newsletter popup"
        className="absolute inset-0 bg-black/70"
        onClick={handleClose}
      />
      <div className="relative z-10 w-full max-w-lg border border-border bg-mist p-8 text-ink">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center border border-border text-steel transition hover:border-accent hover:text-accent"
          aria-label="Dismiss popup"
        >
          ×
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <p className="text-xs uppercase tracking-[0.24em] text-accent">
              Inner Circle
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-ink">Almost there.</h2>
            <p className="mt-4 text-base leading-8 text-steel">
              Your email app should open now so you can send the request. If it
              does not, use the footer contact email and mention Inner Circle.
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs uppercase tracking-[0.24em] text-accent">
              Limited Access
            </p>
            <h2 className="mt-4 font-[var(--font-serif)] text-4xl leading-tight text-ink">
              Join the Inner Circle
            </h2>
            <p className="mt-4 text-base leading-8 text-steel">
              Get the weekly signal stream on Salesforce architecture, AI, and
              career growth. No fluff. Just the sharp stuff.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="enter_your@email.com"
                className="w-full border border-border bg-transparent px-5 py-4 text-sm text-ink"
                required
              />
              <button
                type="submit"
                className={cn(
                  "ttf-button w-full"
                )}
              >
                Join Inner Circle
              </button>
            </form>

            <p className="mt-4 text-xs leading-6 text-steel">
              Clicking join opens your email app with a pre-filled request so
              you can subscribe right away.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
