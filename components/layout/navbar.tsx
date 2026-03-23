import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/category/ai", label: "AI" },
  { href: "/category/salesforce", label: "Salesforce" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-[#f7f2ea]/85 backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-sm font-semibold text-white">
            TF
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-steel">
              The Technology Fiction
            </div>
            <div className="text-sm text-slate-500">Editorial technology platform</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-steel hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/admin/login" className="hidden md:block">
            <Button variant="ghost">Admin</Button>
          </Link>
          <Link href="/blog">
            <Button>Read the blog</Button>
          </Link>
        </div>
      </Container>
    </header>
  );
}
