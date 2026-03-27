import Link from "next/link";
import type { AdminUser } from "@/types/content";
import { Container } from "@/components/layout/container";
import { LogoutButton } from "@/components/admin/logout-button";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/comments", label: "Comments" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/tags", label: "Tags" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/settings", label: "Settings" }
];

export function AdminShell({
  user,
  title,
  description,
  children,
  currentPath
}: {
  user: AdminUser;
  title: string;
  description: string;
  children: React.ReactNode;
  currentPath: string;
}) {
  return (
    <div className="min-h-screen bg-[#f4efe5]">
      <Container className="py-8">
        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="rounded-[2rem] border border-slate-200 bg-white/80 p-5 shadow-soft">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Admin</p>
              <h2 className="mt-2 text-xl font-semibold text-ink">The Technology Fiction</h2>
              <p className="mt-2 text-sm text-slate-500">{user.email}</p>
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const active = currentPath === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                      active
                        ? "bg-ink text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-ink"
                    )}
                  >
                    <span aria-hidden="true" className="text-xs">
                      {active ? "●" : "○"}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-8">
              <LogoutButton />
            </div>
          </aside>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-soft">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold text-ink">{title}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{description}</p>
            </div>
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
}
