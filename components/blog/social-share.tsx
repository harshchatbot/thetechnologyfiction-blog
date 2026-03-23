import { absoluteUrl } from "@/lib/utils/format";

export function SocialShare({ slug, title }: { slug: string; title: string }) {
  const url = absoluteUrl(`/blog/${slug}`);

  const links = [
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    }
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-slate-500">Share</span>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm text-steel hover:text-accent"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
