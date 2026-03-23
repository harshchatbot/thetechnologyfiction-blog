"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "@/components/layout/container";
import { homeNavLinks } from "@/features/root-site/content";
import { cn } from "@/lib/utils/cn";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const shellClassName = cn(
    "sticky top-0 z-40 border-b backdrop-blur-xl transition-all duration-300",
    isHome
      ? isScrolled
        ? "border-white/10 bg-[#07111f]/90"
        : "border-transparent bg-[#07111f]/60"
      : "border-white/50 bg-[#f7f2ea]/88",
    !isHome && "text-ink"
  );

  const textClassName = isHome ? "text-white" : "text-ink";
  const mutedTextClassName = isHome ? "text-slate-300" : "text-steel";

  return (
    <>
      <header className={shellClassName}>
        <Container className="flex h-20 items-center justify-between gap-6">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative h-11 w-11 overflow-hidden rounded-full border border-white/10 bg-white/10">
              <Image
                src="/tech_fi_logo_512x512_image.jpeg"
                alt="The Technology Fiction"
                fill
                sizes="44px"
                className="object-cover"
                priority
              />
            </div>
            <div className="min-w-0">
              <div
                className={cn(
                  "truncate text-xs uppercase tracking-[0.24em]",
                  mutedTextClassName
                )}
              >
                The Technology Fiction
              </div>
              <div className={cn("truncate text-sm", mutedTextClassName)}>
                Root website, mentorship, and blog
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {homeNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition hover:text-accent",
                  textClassName
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/salesforce-coaching-ajmer"
              className={cn(
                "text-sm font-medium transition hover:text-accent",
                textClassName
              )}
            >
              Coaching
            </Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/admin/login"
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition hover:text-accent",
                textClassName
              )}
            >
              Admin
            </Link>
            <Link
              href="/#newsletter"
              className={cn(
                "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition",
                isHome
                  ? "bg-[#d8bc80] text-[#07111f] hover:bg-white"
                  : "bg-ink text-white hover:bg-slate-800"
              )}
            >
              Join Inner Circle
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full border lg:hidden",
              isHome
                ? "border-white/15 bg-white/5 text-white"
                : "border-slate-300 bg-white/70 text-ink"
            )}
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
          >
            {isOpen ? "Close" : "Menu"}
          </button>
        </Container>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-30 bg-[#07111f] px-6 pt-28 text-white lg:hidden">
          <div className="mx-auto flex max-w-2xl flex-col gap-6">
            {homeNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="border-b border-white/10 pb-4 text-3xl font-semibold"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/salesforce-coaching-ajmer"
              onClick={() => setIsOpen(false)}
              className="border-b border-white/10 pb-4 text-3xl font-semibold"
            >
              Coaching
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setIsOpen(false)}
              className="mt-2 text-base text-slate-300"
            >
              Admin login
            </Link>
            <Link
              href="/#newsletter"
              onClick={() => setIsOpen(false)}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-[#d8bc80] px-6 py-3 text-sm font-semibold text-[#07111f]"
            >
              Join Inner Circle
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
