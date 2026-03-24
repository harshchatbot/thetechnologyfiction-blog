"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "@/components/layout/container";
import { homeNavLinks } from "@/features/root-site/content";
import { cn } from "@/lib/utils/cn";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
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

  useEffect(() => {
    if (!isHome) {
      setActiveSection("");
      return;
    }

    const sectionIds = ["roadmaps", "resources", "mentorship", "newsletter"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries[0]?.target instanceof HTMLElement) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-30% 0px -45% 0px",
        threshold: [0.2, 0.35, 0.5, 0.7]
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [isHome]);

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
  const isBlogRoute =
    pathname.startsWith("/blog") || pathname.startsWith("/category");

  const isActiveLink = (href: string) => {
    if (href === "/blog") {
      return isBlogRoute;
    }

    if (!href.startsWith("/#")) {
      return pathname === href;
    }

    return isHome && activeSection === href.replace("/#", "");
  };

  const scrollToSection = (href: string) => {
    const targetId = href.replace("/#", "");
    const target = document.getElementById(targetId);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setIsOpen(false);

    if (!href.startsWith("/#")) {
      return;
    }

    if (isHome) {
      event.preventDefault();
      scrollToSection(href);
      return;
    }

    event.preventDefault();
    router.push(href);
  };

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
                Salesforce, AI, career growth
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-5 xl:flex">
            {homeNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(event) => handleNavClick(event, link.href)}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition",
                  textClassName,
                  isActiveLink(link.href)
                    ? isHome
                      ? "bg-white/10 text-[#d8bc80]"
                      : "bg-white/80 text-accent shadow-soft"
                    : "hover:text-accent"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/salesforce-coaching-ajmer"
              className={cn(
                "rounded-full px-3 py-2 text-sm font-medium transition",
                textClassName,
                pathname === "/salesforce-coaching-ajmer"
                  ? isHome
                    ? "bg-white/10 text-[#d8bc80]"
                    : "bg-white/80 text-accent shadow-soft"
                  : "hover:text-accent"
              )}
            >
              Coaching
            </Link>
          </nav>

          <div className="hidden items-center gap-3 xl:flex">
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
              "inline-flex h-11 w-11 items-center justify-center rounded-full border xl:hidden",
              isHome
                ? "border-white/15 bg-white/5 text-white"
                : "border-slate-300 bg-white/70 text-ink"
            )}
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
          >
            <span className="flex h-4 w-5 flex-col justify-between">
              <span
                className={cn(
                  "block h-0.5 w-full rounded-full bg-current transition",
                  isOpen && "translate-y-[7px] rotate-45"
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-full rounded-full bg-current transition",
                  isOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "block h-0.5 w-full rounded-full bg-current transition",
                  isOpen && "-translate-y-[7px] -rotate-45"
                )}
              />
            </span>
          </button>
        </Container>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-30 bg-[#07111f]/96 px-6 pt-28 text-white backdrop-blur-2xl xl:hidden">
          <div className="mx-auto flex max-w-2xl flex-col gap-6">
            {homeNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(event) => handleNavClick(event, link.href)}
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
              onClick={(event) => handleNavClick(event, "/#newsletter")}
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
