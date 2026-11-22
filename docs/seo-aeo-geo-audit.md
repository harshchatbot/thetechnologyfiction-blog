# SEO / AEO / GEO audit and release checklist

## Implemented in this branch
- Default canonical origin is the production HTTPS domain when NEXT_PUBLIC_SITE_URL is unset; trailing slash normalized. **Vercel must still set NEXT_PUBLIC_SITE_URL=https://thetechnologyfiction.com** to avoid preview/production confusion.
- The /blog listing has an explicit /blog canonical rather than inheriting the homepage canonical.
- /blog?q=... and /blog?tag=... are noindex,follow: searchable UI states are not independent indexable landing pages.
- Category landing page text and links use theme-aware contrast, improving readability for both readers and crawlers.
- Homepage site description and metadata describe the site's actual Salesforce/AI/career focus.

## Already present (preserved)
- /robots.txt blocks /admin and /api; /sitemap.xml lists published posts and category URLs.
- Per-post title/description/canonical/OG/Twitter tags.
- BlogPosting and BreadcrumbList JSON-LD; Service schema on coaching.
- Semantic headings and server-rendered blog pages.

## Outstanding verification — do not claim complete until checked
1. **Google Search Console**: verify domain ownership, submit https://thetechnologyfiction.com/sitemap.xml, review Page indexing (excluded, duplicate, crawled-not-indexed) and inspect 5 priority URLs.
2. **Bing Webmaster Tools**: verify domain and submit sitemap.
3. **Production HTML**: inspect canonical, robots and JSON-LD in View Source for /, /blog, /blog?q=admin, /roadmap, /salesforce-coaching, and a post.
4. **Rich Results Test / Schema validator**: validate real post pages, correct publication dates, and author names; don't add FAQPage unless content and eligibility genuinely support it.
5. **Lighthouse / CrUX**: measure mobile LCP, INP and CLS before and after the redesign; pay attention to the 3D scroll scene, images and third-party ads.
6. **Content audit**: manually review top 10 Search Console landing pages. Add direct answers, examples, screenshots, sourced claims, current Salesforce release/version, and meaningful internal links. Do not auto-generate repetitive FAQs or unverified experience claims.
7. **Editorial authority**: add a verified About/Editorial policy and real author profile only after confirming public details and permission. Keep accurate original bylines for imported posts.
8. **Category taxonomy**: presentation-only AI/Admin/Developer/etc classification does not rewrite persisted categories. Audit accuracy; create curated landing pages only after editorial review, preserving legacy slugs and redirects.
9. **Conversion**: verify that public email and WhatsApp are valid and that newsletter signup really records subscribers. A mailto flow is not a mailing-list integration.
10. **Infrastructure**: check 301 for /salesforce-coaching-ajmer; check www/non-www, HTTP→HTTPS and canonical domain redirect. Ensure preview deployments aren't indexed.

## AEO / GEO content guidance
- Start each substantial tutorial with a clear, original 40–80 word answer to the user's question, followed by a worked example.
- Name exact Salesforce products/features and versions where relevant; cite official Salesforce documentation for volatile platform behavior.
- Use meaningful H2/H3 headings, accessible tables for comparisons, descriptive image alt text and links to prerequisite/follow-up tutorials.
- Attribute first-hand examples and update dates honestly. AI answer citations cannot be guaranteed through markup alone.

## Release
Run `npm run typecheck`, `npm run lint`, `npm run build` and mobile Lighthouse in a real browser. Verify actual Vercel environment variables before merge. No backend/auth/data migrations in this branch.
