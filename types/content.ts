export type PostStatus = "draft" | "published" | "archived";

export type HeadingLevel = 2 | 3;

export type RichTextNode =
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "heading";
      level: HeadingLevel;
      text: string;
      id?: string;
    }
  | {
      type: "bulletList";
      items: string[];
    }
  | {
      type: "orderedList";
      items: string[];
    }
  | {
      type: "blockquote";
      text: string;
      citation?: string;
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
  tags: Tag[];
  author: Author;
  content: RichTextNode[];
  status: PostStatus;
  featured: boolean;
  readingTime: number;
  publishedAt?: string;
  updatedAt: string;
  createdAt: string;
  seo: SeoFields;
};

export type AdminUser = {
  uid: string;
  email: string;
  displayName?: string;
  role: "admin";
};
