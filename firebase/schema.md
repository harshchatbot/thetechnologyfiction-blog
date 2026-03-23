# Firestore Data Model

## Collections

### `users/{uid}`
```json
{
  "uid": "firebase-auth-uid",
  "email": "admin@example.com",
  "displayName": "Admin Name",
  "role": "admin",
  "createdAt": "2026-03-23T10:00:00.000Z",
  "updatedAt": "2026-03-23T10:00:00.000Z"
}
```

### `posts/{postId}`
```json
{
  "id": "post-agentforce-roadmap",
  "slug": "agentforce-roadmap-for-salesforce-teams",
  "title": "A Practical Agentforce Roadmap for Salesforce Teams",
  "subtitle": "How to move from experimentation to reliable internal adoption",
  "excerpt": "A production-minded framework...",
  "status": "published",
  "featured": true,
  "featuredImage": {
    "id": "media-salesforce",
    "url": "https://...",
    "alt": "Enterprise dashboard visual",
    "source": "external"
  },
  "author": {
    "id": "author-harsh",
    "name": "Harshveer Singh Nirwan",
    "role": "Founder, The Technology Fiction"
  },
  "category": {
    "id": "cat-salesforce",
    "slug": "salesforce",
    "name": "Salesforce"
  },
  "categories": [
    {
      "id": "cat-salesforce",
      "slug": "salesforce",
      "name": "Salesforce"
    }
  ],
  "tagIds": ["tag-agentforce", "tag-productivity"],
  "tags": [
    { "id": "tag-agentforce", "slug": "agentforce", "name": "Agentforce" }
  ],
  "content": [
    { "type": "heading", "level": 2, "text": "Start with one workflow" }
  ],
  "contentHtml": "<h2>Start with one workflow</h2><p>...</p>",
  "inlineImageUrls": ["https://thetechnologyfiction.com/blog/wp-content/uploads/..."],
  "readingTime": 8,
  "publishedAt": "2026-03-14T08:00:00.000Z",
  "updatedAt": "2026-03-19T11:30:00.000Z",
  "createdAt": "2026-03-14T08:00:00.000Z",
  "seo": {
    "seoTitle": "Agentforce Roadmap for Salesforce Teams",
    "seoDescription": "Learn how to phase Agentforce adoption...",
    "canonicalUrl": "",
    "focusKeyword": "agentforce roadmap for salesforce teams",
    "ogImage": "https://..."
  },
  "source": {
    "platform": "wordpress",
    "wordpressPostId": "745",
    "originalUrl": "https://thetechnologyfiction.com/blog/?p=745",
    "originalStatus": "publish"
  }
}
```

### `categories/{categoryId}`
```json
{
  "id": "cat-salesforce",
  "name": "Salesforce",
  "slug": "salesforce",
  "description": "Implementation guides...",
  "color": "#c96d42",
  "createdAt": "2026-03-23T10:00:00.000Z",
  "updatedAt": "2026-03-23T10:00:00.000Z"
}
```

### `tags/{tagId}`
```json
{
  "id": "tag-agentforce",
  "name": "Agentforce",
  "slug": "agentforce",
  "description": "Agentforce strategy and implementation",
  "createdAt": "2026-03-23T10:00:00.000Z",
  "updatedAt": "2026-03-23T10:00:00.000Z"
}
```

### `media/{mediaId}`
```json
{
  "id": "media-salesforce",
  "title": "Enterprise systems",
  "alt": "Abstract enterprise dashboard visual",
  "caption": "Keep the first AI workflow observable.",
  "url": "https://...",
  "storagePath": "media/2026/03/file.webp",
  "source": "firebase",
  "archived": false,
  "createdAt": "2026-03-23T10:00:00.000Z",
  "updatedAt": "2026-03-23T10:00:00.000Z"
}
```

### `settings/site`
```json
{
  "siteName": "The Technology Fiction",
  "siteUrl": "https://thetechnologyfiction.com",
  "siteDescription": "A modern technology publication...",
  "defaultSeoTitle": "The Technology Fiction",
  "defaultSeoDescription": "Premium editorial content...",
  "adsenseClientId": "ca-pub-xxxxxxxx",
  "adsenseAutoAdsEnabled": true,
  "organizationName": "The Technology Fiction",
  "organizationLogo": "https://...",
  "twitterHandle": "@technologyfiction",
  "updatedAt": "2026-03-23T10:00:00.000Z"
}
```

## Query Strategy

- Published blog hub: query `posts` where `status == "published"` ordered by `publishedAt desc`
- Slug lookup: query `posts` where `slug == "{slug}"` limit `1`
- Category archive: query `posts` where `status == "published"` and `category.slug == "{slug}"` ordered by `publishedAt desc`
- Related posts: first query same `category.slug`, then use `array-contains-any` on `tagIds`, then fallback to recent published posts
- Draft/admin list: query all posts ordered by `updatedAt desc`

## Recommended Composite Indexes

- `posts(status ASC, publishedAt DESC)`
- `posts(status ASC, category.slug ASC, publishedAt DESC)`
- `posts(status ASC, featured DESC, publishedAt DESC)`
- `posts(status ASC, tagIds ARRAY_CONTAINS, publishedAt DESC)` for related-post variants
- `posts(slug ASC)` if collection grows enough to warrant explicit support

## Migration-Aware Notes

- `slug` should remain stable once published to preserve future 301 mapping.
- `featuredImage.url` can point to Firebase Storage or legacy WordPress/GoDaddy-hosted assets.
- Add a future `redirects/{id}` collection to map old WordPress slugs to new destinations.
