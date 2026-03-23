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
```

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
- The editor stores structured JSON, which drives:
  - safe rendering
  - automatic H2/H3 table of contents generation
  - reading time calculation
  - related-post logic
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

The platform is intentionally designed for topical authority and long-tail query coverage, not unrealistic broad-keyword promises.

## AdSense Configuration

- Set `NEXT_PUBLIC_ADSENSE_CLIENT_ID` to your real AdSense publisher ID.
- Set `NEXT_PUBLIC_ADSENSE_AUTO_ADS_ENABLED=true` to load the site-wide Auto Ads script.
- Manual placements are scaffolded via `components/ads/ad-slot.tsx`.
- Placeholder states are rendered when AdSense is not configured, so layout does not break during development.

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
