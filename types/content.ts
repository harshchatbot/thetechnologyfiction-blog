export type PostStatus = "draft" | "published" | "archived";
export type CommentStatus = "pending" | "approved" | "rejected" | "spam";

export type HeadingLevel = 2 | 3;
export type TextAlign = "left" | "center" | "right" | "justify";

export type RichTextNode =
  | {
      type: "paragraph";
      text: string;
      align?: TextAlign;
      color?: string;
    }
  | {
      type: "heading";
      level: HeadingLevel;
      text: string;
      id?: string;
      align?: TextAlign;
      color?: string;
    }
  | {
      type: "bulletList";
      items: string[];
      color?: string;
    }
  | {
      type: "orderedList";
      items: string[];
      color?: string;
    }
  | {
      type: "blockquote";
      text: string;
      citation?: string;
      align?: TextAlign;
      color?: string;
    }
  | {
      type: "codeBlock";
      code: string;
      language?: string;
    }
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
    }
  | {
      type: "video";
      src: string;
      title: string;
      caption?: string;
      mimeType?: string;
    }
  | {
      type: "callout";
      tone: "info" | "warning" | "success";
      title: string;
      body: string;
    };

export type TocItem = {
  id: string;
  text: string;
  level: HeadingLevel;
};

export type SiteSettings = {
  siteName: string;
  siteUrl: string;
  siteDescription: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  adsenseClientId?: string;
  adsenseAutoAdsEnabled: boolean;
  gaMeasurementId?: string;
  googleSiteVerification?: string;
  bingSiteVerification?: string;
  adsenseSlots?: {
    blogHubSidebar?: string;
    articleInline?: string;
    articleSidebar?: string;
  };
  organizationName: string;
  organizationLogo?: string;
  twitterHandle?: string;
};

export type Author = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  bio?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  color?: string;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

export type MediaItem = {
  id: string;
  title: string;
  alt: string;
  caption?: string;
  url: string;
  mediaType?: "image" | "video";
  mimeType?: string;
  storagePath?: string;
  source: "firebase" | "external";
  archived?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SeoFields = {
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  focusKeyword?: string;
  ogImage?: string;
  noIndex?: boolean;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  featuredImage?: MediaItem;
  category: Category;
  categories: Category[];
  tags: Tag[];
  tagIds?: string[];
  author: Author;
  content: RichTextNode[];
  contentHtml?: string;
  excerptHtml?: string;
  inlineImageUrls?: string[];
  status: PostStatus;
  featured: boolean;
  readingTime: number;
  publishedAt?: string;
  updatedAt: string;
  createdAt: string;
  seo: SeoFields;
  source?: {
    platform: "wordpress";
    wordpressPostId: string;
    originalUrl?: string;
    originalStatus?: string;
    importedAt?: string;
    exporterFile?: string;
  };
};

export type AdminUser = {
  uid: string;
  email: string;
  displayName?: string;
  role: "admin";
};

export type Comment = {
  id: string;
  postId: string;
  postSlug: string;
  postTitle: string;
  authorName: string;
  authorEmail: string;
  content: string;
  status: CommentStatus;
  spamScore: number;
  moderationNotes?: string;
  submittedAt: string;
  updatedAt: string;
  approvedAt?: string;
  source: "public-form";
};

export type AnalyticsEvent = {
  id: string;
  eventName: string;
  path: string;
  pageTitle?: string;
  visitorId: string;
  sessionId: string;
  referrer?: string;
  userAgent?: string;
  createdAt: string;
  params?: Record<string, string | number | boolean>;
};
