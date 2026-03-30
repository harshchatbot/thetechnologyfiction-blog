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
    const hasSeenPopup = window.localStorage.getItem(STORAGE_KEY);
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
    window.localStorage.setItem(STORAGE_KEY, "true");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    trackEvent("newsletter_signup_click", {
      placement: "subscribe_modal",
      email_provided: Boolean(email)
    });
    setSubmitted(true);
    window.localStorage.setItem(STORAGE_KEY, "true");
    window.location.href = mailtoHref;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close newsletter popup"
        className="absolute inset-0 bg-[#07111f]/72 backdrop-blur-md"
        onClick={handleClose}
      />
      <div className="glass-panel relative z-10 w-full max-w-lg rounded-[2rem] border border-white/60 p-8 text-ink shadow-[0_35px_120px_rgba(15,23,42,0.3)]">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-accent hover:text-accent"
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
            <p className="mt-4 text-base leading-8 text-slate-600">
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
            <p className="mt-4 text-base leading-8 text-slate-600">
              Get the weekly signal stream on Salesforce architecture, AI, and
              career growth. No fluff. Just the sharp stuff.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="enter_your@email.com"
                className="w-full rounded-2xl border border-slate-200 bg-white/85 px-5 py-4 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
                required
              />
              <button
                type="submit"
                className={cn(
                  "inline-flex w-full items-center justify-center rounded-full bg-[#d8bc80] px-6 py-3 text-sm font-semibold text-[#07111f] transition hover:-translate-y-0.5 hover:bg-[#e5cf9f]"
                )}
              >
                Join Inner Circle
              </button>
            </form>

            <p className="mt-4 text-xs leading-6 text-slate-500">
              Clicking join opens your email app with a pre-filled request so
              you can subscribe right away.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
