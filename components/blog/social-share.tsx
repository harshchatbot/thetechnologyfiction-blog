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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-steel">Share this article</p>
        <p className="mt-2 text-sm leading-6 text-steel">
          If this helped, share it with someone working through the same problem.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 sm:justify-end">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="ttf-button"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
