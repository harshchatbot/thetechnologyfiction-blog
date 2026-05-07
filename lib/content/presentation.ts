import type { Category } from "@/types/content";

export function getCategorySummary(category: Category) {
  const description = category.description?.trim();

  if (
    !description ||
    /^imported from wordpress category/i.test(description) ||
    /^category archive/i.test(description)
  ) {
    return `Sharp articles, practical guides, and technical commentary across ${category.name.toLowerCase()}.`;
  }

  return description;
}

export function getCategoryHubContent(category: Category) {
  const name = category.name.toLowerCase();
  const slug = category.slug.toLowerCase();
  const token = `${name} ${slug}`;

  if (/salesforce|software/.test(token)) {
    return {
      intro:
        "This hub is designed to connect implementation tutorials, career-building guidance, and deeper platform thinking for people growing in the Salesforce ecosystem.",
      bullets: [
        "Hands-on tutorials and implementation notes",
        "Career progression guidance for admins, developers, and architects",
        "Related reading paths into coaching, interviews, and long-tail problem solving"
      ],
      links: [
        { href: "/blog?q=salesforce", label: "Search Salesforce articles" },
        { href: "/salesforce-coaching-ajmer", label: "Explore Salesforce coaching" },
        { href: "/blog?q=career", label: "Browse career-focused posts" }
      ]
    };
  }

  if (/career|growth/.test(token)) {
    return {
      intro:
        "This category groups practical writing for people improving technical judgment, role positioning, interviews, and career leverage over time.",
      bullets: [
        "Career strategy for Salesforce and technical builders",
        "Interview, roadmap, and positioning guidance",
        "Cross-links into mentorship and adjacent implementation content"
      ],
      links: [
        { href: "/blog?q=career", label: "Search career articles" },
        { href: "/salesforce-coaching-ajmer", label: "View mentorship options" },
        { href: "/blog", label: "Explore all blog content" }
      ]
    };
  }

  return {
    intro:
      "This category acts as a topical entry point, helping readers move between related articles, practical guides, and deeper theme-specific exploration.",
    bullets: [
      "Editorial explainers and practical walkthroughs",
      "Related articles grouped for easier discovery",
      "Internal paths into adjacent categories and cornerstone content"
    ],
    links: [
      { href: `/blog?q=${encodeURIComponent(category.name)}`, label: `Search ${category.name} articles` },
      { href: "/blog", label: "Browse all articles" },
      { href: "/salesforce-coaching-ajmer", label: "Explore coaching and mentorship" }
    ]
  };
}
