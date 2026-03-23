import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";

export function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-white/10 bg-[#07111f] py-16 text-white">
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#d8bc80]/10 blur-3xl" />
      <div className="absolute left-[-5rem] bottom-0 h-64 w-64 rounded-full bg-[#4f87c5]/10 blur-3xl" />
      <Container className="relative">
        <div className="glass-panel-dark mb-10 rounded-[2rem] border border-white/10 p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#d8bc80]">
                The Technology Fiction
              </p>
              <h2 className="mt-4 font-[var(--font-serif)] text-4xl leading-tight text-white sm:text-5xl">
                Built for technical depth, credibility, and long-term brand trust.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-300">
                A modern editorial platform for Salesforce, AI, career growth,
                and entrepreneurship with room to scale into a serious content
                business.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-full bg-[#d8bc80] px-6 py-3 text-sm font-semibold text-[#07111f] transition hover:bg-white"
              >
                Explore articles
              </Link>
              <a
                href="mailto:hello@thetechnologyfiction.com?subject=The%20Technology%20Fiction"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Contact
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="space-y-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full border border-white/10 bg-white/10">
              <Image
                src="/tech_fi_logo_512x512_image.jpeg"
                alt="The Technology Fiction"
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-wide text-white">
                The Technology Fiction
              </div>
              <div className="text-sm text-slate-400">Editorial technology platform</div>
            </div>
          </Link>
          <p className="max-w-md text-sm leading-7 text-slate-300">
            Decoding Salesforce, AI, and career growth for builders who want
            practical systems, better judgment, and a long-term brand with real
            search visibility.
          </p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.24em] text-slate-400">
            <span>Salesforce</span>
            <span>AI</span>
            <span>Career Growth</span>
            <span>Entrepreneurship</span>
          </div>
          </div>

          <div className="space-y-4 text-sm">
            <p className="font-semibold text-white">Explore</p>
            <Link href="/blog" className="block text-slate-300 hover:text-[#d8bc80]">
              Blog hub
            </Link>
            <Link href="/#roadmaps" className="block text-slate-300 hover:text-[#d8bc80]">
              Roadmaps
            </Link>
            <Link href="/#resources" className="block text-slate-300 hover:text-[#d8bc80]">
              Resources
            </Link>
            <Link
              href="/salesforce-coaching-ajmer"
              className="block text-slate-300 hover:text-[#d8bc80]"
            >
              Salesforce coaching
            </Link>
          </div>

          <div className="space-y-4 text-sm">
            <p className="font-semibold text-white">Connect</p>
            <a
              href="mailto:hello@thetechnologyfiction.com"
              className="block text-slate-300 hover:text-[#d8bc80]"
            >
              hello@thetechnologyfiction.com
            </a>
            <a
              href="https://wa.me/917976111087"
              target="_blank"
              rel="noreferrer"
              className="block text-slate-300 hover:text-[#d8bc80]"
            >
              WhatsApp
            </a>
            <Link
              href="/admin/login"
              className="block text-slate-300 hover:text-[#d8bc80]"
            >
              Admin login
            </Link>
          </div>
        </div>
      </Container>

      <Container className="relative mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 The Technology Fiction. All rights reserved.</p>
        <p className="flex flex-wrap items-center gap-2">
          <span>Client services delivered via</span>
          <a
            href="https://www.techfilabs.com"
            target="_blank"
            rel="noreferrer"
            className="font-semibold uppercase tracking-[0.18em] text-[#d8bc80] transition hover:text-white"
          >
            TechFi Labs
          </a>
        </p>
      </Container>
    </footer>
  );
}
