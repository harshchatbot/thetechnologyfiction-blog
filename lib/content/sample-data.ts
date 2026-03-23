import type { Author, Category, MediaItem, Post, Tag } from "@/types/content";

const author: Author = {
  id: "author-harsh",
  name: "Harshveer Singh Nirwan",
  role: "Founder, The Technology Fiction",
  bio: "Writing at the intersection of applied AI, enterprise software, and career strategy."
};

export const categories: Category[] = [
  {
    id: "cat-salesforce",
    name: "Salesforce",
    slug: "salesforce",
    description:
      "Implementation guides, architecture notes, automation patterns, and long-tail Salesforce growth content.",
    color: "#c96d42"
  },
  {
    id: "cat-ai",
    name: "AI",
    slug: "ai",
    description:
      "Applied AI strategy, product workflows, prompt systems, and technical breakdowns for builders.",
    color: "#0f766e"
  },
  {
    id: "cat-career-growth",
    name: "Career Growth",
    slug: "career-growth",
    description:
      "Practical frameworks for leveling up as a developer, architect, consultant, or founder.",
    color: "#4f46e5"
  },
  {
    id: "cat-entrepreneurship",
    name: "Entrepreneurship",
    slug: "entrepreneurship",
    description:
      "Execution notes on building modern internet businesses with systems, speed, and leverage.",
    color: "#166534"
  }
];

export const tags: Tag[] = [
  { id: "tag-agentforce", name: "Agentforce", slug: "agentforce" },
  { id: "tag-rag", name: "RAG", slug: "rag" },
  { id: "tag-productivity", name: "Productivity", slug: "productivity" },
  { id: "tag-content-seo", name: "Content SEO", slug: "content-seo" },
  { id: "tag-founders", name: "Founders", slug: "founders" },
  { id: "tag-career", name: "Career Strategy", slug: "career-strategy" }
];

const mediaLibrary: Record<string, MediaItem> = {
  hero: {
    id: "media-hero",
    title: "Editorial desk",
    alt: "Editorial workspace with laptop and warm lighting",
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    source: "external",
    createdAt: "2026-03-01T09:00:00.000Z",
    updatedAt: "2026-03-01T09:00:00.000Z"
  },
  ai: {
    id: "media-ai",
    title: "AI workflow board",
    alt: "Digital dashboard showing AI workflows and architecture notes",
    url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80",
    source: "external",
    createdAt: "2026-03-01T09:00:00.000Z",
    updatedAt: "2026-03-01T09:00:00.000Z"
  },
  salesforce: {
    id: "media-salesforce",
    title: "Enterprise systems",
    alt: "Abstract enterprise dashboard visual",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
    source: "external",
    createdAt: "2026-03-01T09:00:00.000Z",
    updatedAt: "2026-03-01T09:00:00.000Z"
  }
};

export const posts: Post[] = [
  {
    id: "post-agentforce-roadmap",
    slug: "agentforce-roadmap-for-salesforce-teams",
    title: "A Practical Agentforce Roadmap for Salesforce Teams",
    subtitle: "How to move from experimentation to reliable internal adoption",
    excerpt:
      "A production-minded framework for implementing Agentforce without turning your Salesforce estate into an AI science fair.",
    featuredImage: mediaLibrary.salesforce,
    category: categories[0],
    categories: [categories[0]],
    tags: [tags[0], tags[2]],
    tagIds: [tags[0].id, tags[2].id],
    author,
    status: "published",
    featured: true,
    readingTime: 8,
    publishedAt: "2026-03-14T08:00:00.000Z",
    updatedAt: "2026-03-19T11:30:00.000Z",
    createdAt: "2026-03-14T08:00:00.000Z",
    seo: {
      seoTitle: "Agentforce Roadmap for Salesforce Teams | The Technology Fiction",
      seoDescription:
        "Learn how to phase Agentforce adoption with governance, internal use cases, and a content strategy that compounds.",
      focusKeyword: "agentforce roadmap for salesforce teams"
    },
    content: [
      {
        type: "paragraph",
        text: "Most teams do not fail at AI because the model is weak. They fail because the operating model around the model is vague."
      },
      {
        type: "heading",
        level: 2,
        text: "Start with one workflow, not a platform fantasy"
      },
      {
        type: "paragraph",
        text: "The first release should remove friction from one internal workflow where latency, accuracy, and human review can all be measured."
      },
      {
        type: "callout",
        tone: "info",
        title: "Migration note",
        body: "If you are moving from WordPress, preserve your existing slug strategy now so your future redirects remain straightforward."
      },
      {
        type: "heading",
        level: 3,
        text: "What to instrument from day one"
      },
      {
        type: "bulletList",
        items: [
          "Prompt version and owner",
          "Knowledge sources involved",
          "Human approval checkpoints",
          "Latency and failure modes"
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "Build trust through observable output"
      },
      {
        type: "blockquote",
        text: "Adoption is a credibility problem before it is a capability problem.",
        citation: "The Technology Fiction"
      },
      {
        type: "codeBlock",
        language: "ts",
        code: "export function choosePilot(useCases: string[]) {\n  return useCases.find((item) => item.includes('review'));\n}"
      },
      {
        type: "image",
        src: mediaLibrary.salesforce.url,
        alt: "Salesforce architecture planning board",
        caption: "Keep the first AI workflow observable and easy to rollback."
      }
    ]
  },
  {
    id: "post-ai-content-engine",
    slug: "building-an-ai-assisted-content-engine-that-doesnt-sound-generic",
    title: "Building an AI-Assisted Content Engine That Does Not Sound Generic",
    subtitle: "Editorial systems for creators who care about quality and search visibility",
    excerpt:
      "A tactical publishing workflow for turning raw expertise into strong long-tail content without losing voice.",
    featuredImage: mediaLibrary.ai,
    category: categories[1],
    categories: [categories[1]],
    tags: [tags[1], tags[3], tags[5]],
    tagIds: [tags[1].id, tags[3].id, tags[5].id],
    author,
    status: "published",
    featured: true,
    readingTime: 10,
    publishedAt: "2026-03-18T07:30:00.000Z",
    updatedAt: "2026-03-21T10:15:00.000Z",
    createdAt: "2026-03-18T07:30:00.000Z",
    seo: {
      seoTitle:
        "Build an AI-Assisted Content Engine That Does Not Sound Generic",
      seoDescription:
        "Use AI as a structured editorial collaborator without publishing flat, interchangeable content.",
      focusKeyword: "ai assisted content engine"
    },
    content: [
      {
        type: "paragraph",
        text: "Generic content is usually the result of generic source material. The fix is not more prompting. The fix is better editorial inputs."
      },
      {
        type: "heading",
        level: 2,
        text: "Treat expertise as source material"
      },
      {
        type: "paragraph",
        text: "Your own implementation notes, objections, decisions, and mistakes are far more valuable than another scraped outline."
      },
      {
        type: "heading",
        level: 3,
        text: "A simple workflow that compounds"
      },
      {
        type: "orderedList",
        items: [
          "Capture raw voice notes or implementation logs.",
          "Convert them into structured outlines around search intent.",
          "Draft with AI and then aggressively enrich with specifics."
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "Design for clusters, not isolated wins"
      },
      {
        type: "paragraph",
        text: "The homepage, category pages, and article pages should reinforce one another through internal linking and shared topical depth."
      }
    ]
  },
  {
    id: "post-career-architect",
    slug: "how-to-think-like-a-full-stack-architect-early-in-your-career",
    title: "How to Think Like a Full-Stack Architect Early in Your Career",
    subtitle: "A systems mindset for developers who want more leverage",
    excerpt:
      "Architecture is not a job title first. It is the habit of connecting product, code, data, and operations.",
    featuredImage: mediaLibrary.hero,
    category: categories[2],
    categories: [categories[2]],
    tags: [tags[2], tags[5]],
    tagIds: [tags[2].id, tags[5].id],
    author,
    status: "published",
    featured: false,
    readingTime: 7,
    publishedAt: "2026-03-10T09:15:00.000Z",
    updatedAt: "2026-03-16T12:00:00.000Z",
    createdAt: "2026-03-10T09:15:00.000Z",
    seo: {
      seoTitle:
        "How to Think Like a Full-Stack Architect Early in Your Career",
      seoDescription:
        "Develop the decision-making habits that make engineers valuable beyond their current task board."
    },
    content: [
      {
        type: "paragraph",
        text: "The fastest way to grow is to stop seeing tickets as isolated implementation tasks and start seeing them as system decisions."
      },
      {
        type: "heading",
        level: 2,
        text: "Expand the frame around every task"
      },
      {
        type: "bulletList",
        items: [
          "Who owns this long term?",
          "What breaks when traffic grows?",
          "How will content, analytics, and SEO change the design?"
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "Communicate tradeoffs early"
      },
      {
        type: "paragraph",
        text: "Architectural trust comes from identifying non-obvious consequences before they become operational pain."
      }
    ]
  }
];
