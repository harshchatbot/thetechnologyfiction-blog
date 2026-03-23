import Link from "next/link";
import { Container } from "@/components/layout/container";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 py-12">
      <Container className="grid gap-8 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-steel">
            The Technology Fiction
          </p>
          <p className="max-w-md text-sm leading-7 text-slate-600">
            A premium editorial platform on Salesforce, AI, career growth, and
            entrepreneurship. Built for topical authority, fast reading, and long-term growth.
          </p>
        </div>
        <div className="space-y-3 text-sm text-slate-600">
          <p className="font-medium text-ink">Explore</p>
          <Link href="/blog" className="block hover:text-accent">
            Blog hub
          </Link>
          <Link href="/category/ai" className="block hover:text-accent">
            AI
          </Link>
          <Link href="/category/salesforce" className="block hover:text-accent">
            Salesforce
          </Link>
        </div>
        <div className="space-y-3 text-sm text-slate-600">
          <p className="font-medium text-ink">Platform</p>
          <Link href="/admin" className="block hover:text-accent">
            Admin dashboard
          </Link>
          <a href="mailto:hello@thetechnologyfiction.com" className="block hover:text-accent">
            hello@thetechnologyfiction.com
          </a>
        </div>
      </Container>
    </footer>
  );
}
