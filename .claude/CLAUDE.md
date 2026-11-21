# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev                          # Dev server (next dev); /keystatic edits files locally
bun run build                    # Production build (next build)
bun run start                    # Serve the production build
bun run check                    # tsc --noEmit
node scripts/compare-mdx.mjs [ref]  # Compare every post's parsed MDX tree and frontmatter with a git ref (default HEAD)
```

## Architecture

Next.js 16 App Router blog with React 19, TypeScript, Tailwind CSS 4, and MDX content rendered at build time. Posts are written either in the Keystatic editor at `/keystatic` or directly as files.

### Content Pipeline

Posts are `.mdx` files in `src/content/markdown-pages/[topic]/` with frontmatter:

```yaml
title: Post Title
date: 2026-11-21
tags:
  - react
draft: false # true hides the post from lists, RSS and sitemap; the page still builds with noindex
```

- Loader: `src/lib/server/posts.ts`. `getAllPosts()` returns published posts only; `getAllPostsIncludingDrafts()` and `getPostByCategoryAndSlug()` include drafts.
- The URL slug is the file name without the topic folder. `sourcePath` (`topic/file`) is what Keystatic calls the slug.
- MDX rendering: `src/lib/server/mdx.tsx` (`@mdx-js/mdx` evaluate + remark-gfm + rehype-slug + Shiki).
- MDX components available in posts: `src/mdx-components.tsx`. Every component there must also be registered in `keystatic.config.ts` (`postComponents`), or the editor cannot open posts that use it.

### Keystatic Editor

- Config: `keystatic.config.ts`. Admin UI: `src/app/keystatic/`. API: `src/app/api/keystatic/[...params]/route.ts`.
- Storage is `local` under `next dev` and `github` (`movie42/hyunsu`) in production. Saving in production commits to the repository and Vercel redeploys.
- Production needs `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`. Without the first three the API route answers 404 so the build still passes.
- The preview button opens `/preview/<topic>/<file>`, which redirects to the post's category URL.
- Keystatic rewrites a file in its own format on save and cannot represent: GFM footnotes, task lists, table column alignment, and raw HTML elements (`<img>`, `<a>`, `<div>`, `<details>` ...). Posts using these must be edited as files, not in the editor.

### Routing & Categories

`src/app/(site)/` holds the blog pages and their layout (header, `globals.css`); `src/app/keystatic/` has no blog chrome. Posts route by tags (`generateUrl()` in `src/lib/server/posts.ts`):

- Tags include "etc" → `/posts/etc/[slug]`
- Tags include "movie" → `/posts/movie/[slug]`
- Everything else → `/posts/programming/[slug]`

### Styling

- Tailwind CSS 4 with `@tailwindcss/typography`; global styles in `src/app/globals.css`.
- Do not write Tailwind utilities inline in component markup (`class="..."`). Use a per-component `*.module.css` and reference meaningful class names only, so styles stay easy to debug and maintain.

### Components

React components in `src/components/`, each with its own `*.module.css`: `Header`, `Nav`, `PostCard`, `PostContent`, `TOC`, `Giscus` (GitHub Discussions comments), `Section`, and the MDX components `Quotation`, `ImageComment`, `Tabs`, `Canvas`, `BezierCasteljau`, `EasingShowcase`, `YouTube`.

### Aliases

- `@/*` → `src/*`

### Deployment

Vercel. Pages are statically generated; only `/keystatic` and `/api/keystatic` are dynamic.

## Planning Rules

Use `/task-plan` for work that needs a structured plan: new features, refactors, bug-fix strategies, architecture changes.

- Do not create ad-hoc plan documents; follow the task-plan workflow.
- Do not implement right after writing a plan; start once the user has reviewed and approved it.
- Use the `/implement` workflow for plan-based implementation.
