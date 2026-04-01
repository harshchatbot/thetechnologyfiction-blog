# The Technology Fiction

The Technology Fiction is a production-oriented Next.js editorial platform built for a premium technology brand. It combines a fast SEO-first public website with a Firebase-backed admin CMS for creating, editing, publishing, and organizing articles without touching code.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Zod
- React Hook Form
- Tiptap rich text editor

## Routes

- `/` brand homepage
- `/blog` editorial blog hub
- `/blog/[slug]` article detail page
- `/category/[slug]` category archive
- `/admin` admin dashboard
- `/admin/posts` post management
- `/admin/posts/new` create post
- `/admin/posts/[id]/edit` edit post
- `/admin/media` media library
- `/admin/categories` category management
- `/admin/tags` tag management
- `/admin/settings` SEO and AdSense settings scaffold

## Project Structure

```text
app/
components/
features/
lib/
types/
firebase/
public/
```

Public rendering, SEO utilities, Firebase services, editor logic, and admin forms are intentionally separated so the public site stays server-first and lightweight.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.example .env.local
```

3. Fill in the Firebase and site variables.

4. Start the app:

```bash
npm run dev
```

## Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_SESSION_COOKIE_NAME=ttf_admin_session
FIREBASE_SESSION_EXPIRES_IN=432000000
ADMIN_EMAILS=you@example.com
NEXT_PUBLIC_ADSENSE_CLIENT_ID=
NEXT_PUBLIC_ADSENSE_AUTO_ADS_ENABLED=false
NEXT_PUBLIC_ADSENSE_SLOT_BLOG_HUB_SIDEBAR=
NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_INLINE=
NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_SIDEBAR=
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-RE4QVT0Q1X
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_BING_SITE_VERIFICATION=
```

## Website Analytics

- Google Analytics 4 is now wired into the app through `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- The current configured measurement ID is `G-RE4QVT0Q1X`.
- Page views are tracked across App Router route changes, so homepage, blog hub, article pages, category pages, and admin page transitions can all be seen in GA4.
- The app also mirrors page views and key custom events into Firestore via `analytics_events` for a lightweight internal dashboard at `/admin/analytics`.
- To view traffic stats, go to your GA4 property and check:
  - `Reports > Realtime` for live visitors
  - `Reports > Engagement > Pages and screens` for page views
  - `Reports > Acquisition` for traffic sources
  - `Explore` for deeper custom analysis
- For SEO click and query data, continue using Google Search Console alongside GA4.
- Internal dashboard metrics currently include:
  - page views
  - unique visitors
  - article clicks
  - blog searches
  - WhatsApp clicks
  - newsletter clicks
  - comment submissions

## Firebase Setup

### Authentication

- Enable Email/Password sign-in in Firebase Authentication.
- Create your admin user in Firebase Auth.
- Add that email to `ADMIN_EMAILS`.
- The login UI exchanges the client ID token for a server-side session cookie at `/api/auth/session`.

### Firestore

- Firestore schema guidance lives in [firebase/schema.md](/Users/harshveersinghnirwan/Downloads/thetechnologyfiction-blog/thetechnologyfiction-blog/firebase/schema.md).
- Index definitions live in [firebase/firestore.indexes.json](/Users/harshveersinghnirwan/Downloads/thetechnologyfiction-blog/thetechnologyfiction-blog/firebase/firestore.indexes.json).
- Rules live in [firebase/firestore.rules](/Users/harshveersinghnirwan/Downloads/thetechnologyfiction-blog/thetechnologyfiction-blog/firebase/firestore.rules).

Main collections:

- `users`
- `posts`
- `categories`
- `tags`
- `media`
- `settings`

### Storage

- Firebase Storage is used for uploaded images.
- Storage rules live in [firebase/storage.rules](/Users/harshveersinghnirwan/Downloads/thetechnologyfiction-blog/thetechnologyfiction-blog/firebase/storage.rules).
- Media records can also point to external URLs, which is useful for existing GoDaddy or WordPress-hosted assets.

## Admin Workflow

- Log in at `/admin/login`.
- Create or edit content under `/admin/posts`.
- Drafts, published posts, and archived posts all use the same typed content model.
- The editor supports headings, bold, italic, underline, links, blockquotes, code blocks, inline images, and insertion from the media library.
- The editor stores structured JSON, which drives:
  - safe rendering
  - automatic H2/H3 table of contents generation
  - reading time calculation
  - related-post logic
- The editor also saves `contentHtml` so imported and newly authored content remain migration-friendly.
- The publish panel blocks live publishing when key editorial checks are missing, such as excerpt length, featured image, headings, focus keyword, or SEO description.
- The SEO checklist gives a practical score for title length, meta description, heading usage, keyword placement, and overuse.
- Categories and tags are managed from their own admin screens.
- The media library supports both:
  - Firebase Storage uploads
  - external image URLs

## SEO Foundation

Implemented in this MVP:

- semantic public pages
- dynamic metadata utilities
- canonical URLs
- Open Graph and Twitter metadata
- JSON-LD for organization, website, breadcrumbs, category pages, and articles
- `robots.txt`
- `sitemap.xml`
- internal linking between homepage, category archives, and blog posts

## Search Console And Bing Setup

The site is now ready for both Google Search Console and Bing Webmaster Tools verification through environment variables.

Add these values in `.env.local` after you get the verification tokens from each platform:

```bash
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_google_token
NEXT_PUBLIC_BING_SITE_VERIFICATION=your_bing_token
```

What this does:

- injects the Google verification meta tag for Search Console
- injects the Bing `msvalidate.01` verification meta tag
- keeps the setup deploy-friendly without hardcoding tokens in source

Recommended setup flow:

1. Deploy the site with your final production domain configured as `NEXT_PUBLIC_SITE_URL=https://thetechnologyfiction.com`
2. Open Google Search Console and add the property for `https://thetechnologyfiction.com`
3. Choose the HTML tag verification method and copy the content token into `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
4. Open Bing Webmaster Tools and add the same site
5. Choose the meta-tag verification method and copy the content token into `NEXT_PUBLIC_BING_SITE_VERIFICATION`
6. Redeploy
7. Verify both properties
8. Submit the sitemap:
   - `https://thetechnologyfiction.com/sitemap.xml`

Also verify these URLs publicly after deployment:

- `https://thetechnologyfiction.com/robots.txt`
- `https://thetechnologyfiction.com/sitemap.xml`
- `https://thetechnologyfiction.com/ads.txt`

After verification, monitor:

- indexing coverage
- top queries
- pages with impressions but low CTR
- mobile usability issues
- Core Web Vitals and crawl issues

The platform is intentionally designed for topical authority and long-tail query coverage, not unrealistic broad-keyword promises.

## AdSense Configuration

- Set `NEXT_PUBLIC_ADSENSE_CLIENT_ID` to your real AdSense publisher ID.
- Set `NEXT_PUBLIC_ADSENSE_AUTO_ADS_ENABLED=true` to load the site-wide Auto Ads script.
- The app now works cleanly with Auto Ads only, so Google can decide placements site-wide without manual slot IDs.
- Manual placements are scaffolded via `components/ads/ad-slot.tsx` for a later optimization pass.
- Add real manual slot IDs only if you want visible managed placements in the blog UI later:
  - `NEXT_PUBLIC_ADSENSE_SLOT_BLOG_HUB_SIDEBAR`
  - `NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_INLINE`
  - `NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_SIDEBAR`
- The current project is preconfigured for Auto Ads with `ca-pub-4871923530747843`.
- Auto Ads alone often will not appear reliably in localhost previews, so verify live ads on your deployed domain.

## Media and WordPress Migration Notes

- Post slugs are explicit and can preserve your existing WordPress URLs where appropriate.
- Featured and inline images can use Firebase Storage or external URLs.
- This is helpful for phased migration from:
  - GoDaddy-hosted media
  - WordPress uploads paths
- Add a future `redirects` collection when you are ready to manage 301 mappings.
- The current content model is importer-friendly because post bodies are structured JSON rather than tightly coupled page-builder HTML.

### WordPress XML Migration Flow

The repo now includes a WordPress XML to Firestore migration pipeline under [`scripts/migrate`](/Users/harshveersinghnirwan/Downloads/thetechnologyfiction-blog/thetechnologyfiction-blog/scripts/migrate).

Files:

- [`scripts/migrate/wp-xml-parser.cjs`](/Users/harshveersinghnirwan/Downloads/thetechnologyfiction-blog/thetechnologyfiction-blog/scripts/migrate/wp-xml-parser.cjs)
- [`scripts/migrate/import-wordpress-json.cjs`](/Users/harshveersinghnirwan/Downloads/thetechnologyfiction-blog/thetechnologyfiction-blog/scripts/migrate/import-wordpress-json.cjs)
- Intermediate output: `scripts/migrate/output/wordpress-posts.json`

What the parser preserves:

- title
- slug
- excerpt
- original WordPress HTML in `contentHtml`
- transformed rich content blocks for app rendering
- published and updated dates
- WordPress status plus mapped Firestore status
- categories and tags
- featured image URL if available
- inline image URLs
- WordPress media URLs normalized to the exported blog base path when content uses root `/wp-content/uploads/...` paths

The importer:

- imports only published posts by default
- supports `--dry-run`
- supports `--limit`
- supports duplicate handling with `--on-duplicate=skip|update`
- creates missing category and tag documents
- preserves old WordPress image URLs unchanged
- writes migration metadata into the Firestore `posts` documents
- deep-cleans write payloads so Firestore never receives `undefined` values
- can be followed by a Firebase Storage media migration so old WordPress images no longer need to be served from legacy hosting

Recommended workflow:

1. Parse the XML into JSON:

```bash
npm run migrate:parse
```

2. Inspect the generated JSON at `scripts/migrate/output/wordpress-posts.json`.

3. Test with the first 3 published posts in dry-run mode:

```bash
npm run migrate:import -- --dry-run --limit=3
```

4. Import the first 3 published posts for real after Firebase env vars are set:

```bash
npm run migrate:import -- --limit=3
```

5. Import the remaining published posts later:

```bash
npm run migrate:import
```

Useful options:

```bash
npm run migrate:parse -- --limit=3
npm run migrate:import -- --dry-run --limit=3
npm run migrate:import -- --dry-run --limit=3 --debug-env
npm run migrate:import -- --dry-run --limit=3 --use-firestore
npm run migrate:import -- --all-statuses --dry-run
npm run migrate:import -- --on-duplicate=update
npm run migrate:images -- --source=/absolute/path/to/uploads.zip --dry-run --limit=3
npm run migrate:images -- --source=/absolute/path/to/uploads --limit=10
npm run migrate:images -- --source=/absolute/path/to/uploads.zip --post=your-post-slug
```

Standalone migration scripts load `.env.local` automatically using Next's env loader, so you do not need to manually export `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, or `FIREBASE_PRIVATE_KEY` in your shell first.

If you want to confirm the importer can see the Firebase Admin env vars without printing secrets, run:

```bash
npm run migrate:import -- --dry-run --limit=3 --debug-env
```

That prints only `present` or `missing` for:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

By default, `--dry-run` stays local and does not contact Firestore. If you want duplicate checks against the live database during a dry run, add:

```bash
npm run migrate:import -- --dry-run --limit=3 --use-firestore
```

### WordPress image migration to Firebase Storage

The repo also includes a Firebase Storage migration script for imported WordPress media:

- [`scripts/migrate/migrate-wordpress-images-to-firebase.cjs`](/Users/harshveersinghnirwan/Downloads/thetechnologyfiction-blog/thetechnologyfiction-blog/scripts/migrate/migrate-wordpress-images-to-firebase.cjs)

This script:

- reads imported WordPress posts from Firestore
- accepts a local WordPress `uploads` folder or `uploads.zip` as the source of truth
- matches legacy URLs like `/wp-content/uploads/...` and `/blog/wp-content/uploads/...` to local files
- uploads those files into deterministic Firebase Storage paths under `wordpress-imports/...`
- rewrites featured image URLs, inline image URLs, rich content image nodes, and `contentHtml`
- updates Firestore posts so article images can be served from Firebase only
- writes success, failure, and summary reports to `scripts/migrate/output`

Recommended flow:

```bash
npm run migrate:images -- --source=/Users/harshveersinghnirwan/Downloads/uploads.zip --dry-run --limit=3
npm run migrate:images -- --source=/Users/harshveersinghnirwan/Downloads/uploads.zip --post=salesforce-spring-25-new-flow-features
npm run migrate:images -- --source=/Users/harshveersinghnirwan/Downloads/uploads.zip --limit=10
npm run migrate:images -- --source=/Users/harshveersinghnirwan/Downloads/uploads.zip
```

Useful flags:

- `--dry-run`
- `--limit=3`
- `--post=slug-or-id`
- `--debug`
- `--debug-env`

Reports are generated here:

- `scripts/migrate/output/media-migration-success-*.json`
- `scripts/migrate/output/media-migration-failures-*.json`
- `scripts/migrate/output/media-migration-summary-*.json`

This is the preferred long-term path if you want Firebase to become the only storage/database layer and stop depending on old WordPress or GoDaddy-hosted media.

## Deploying to Vercel

1. Push the repository to GitHub.
2. Create a Vercel project pointing to this repo.
3. Add the same environment variables from `.env.local`.
4. Set your production `NEXT_PUBLIC_SITE_URL`.
5. If using Firebase Admin in production, ensure the private key is stored exactly with newline escaping intact.

For a custom domain later, attach your domain in Vercel and then update:

- `NEXT_PUBLIC_SITE_URL`
- Firebase auth authorized domains
- any AdSense domain validation settings

## Notes on the Current MVP

- Public pages work immediately with the bundled sample content fallback.
- Admin writes require Firebase Admin credentials and a configured project.
- Search and advanced pagination are scaffolded in the UI but not yet backed by a dedicated query layer.
- A full WordPress importer is not included yet, but the repository structure is prepared for it.
