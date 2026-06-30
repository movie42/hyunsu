# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev           # Dev server (vite dev)
bun run build     # Production build (vite build)
bun run preview   # Preview production build
bun run check     # svelte-kit sync + svelte-check
```

## Architecture

SvelteKit blog with Svelte 5, TypeScript, Tailwind CSS 4, and mdsvex for MDX content.

### Content Pipeline

Blog posts are MDX/MD files in `src/content/markdown-pages/[topic]/` with gray-matter frontmatter:

```yaml
title: "Post Title"
date: "YYYY-MM-DD"
tags: ["javascript", "react"] # Tags determine routing category
draft: false # Optional, hides post when true
```

**Post resolution flow:** `getAllPosts()` recursively globs `.mdx`/`.md` files → `getPost()` parses each with gray-matter → slug derived from filename → sorted by date descending.

- Posts module: `src/lib/server/posts.ts`
- MDX preprocessing: `mdsvex` in `svelte.config.js` with remark-gfm + rehype-slug
- MDX layout wrapper: `src/lib/components/mdsvex/Layout.svelte`

### Routing & Categories

Posts route to one of three categories based on tags (see `generateUrl()` in `src/lib/server/posts.ts`):

- Tags include "etc" → `/posts/etc/[slug]`
- Tags include "movie" → `/posts/movie/[slug]`
- Everything else → `/posts/programming/[slug]`

Each category has `+page.server.ts` (list) and `[...slug]/+page.server.ts` (detail).

### Styling

- **Tailwind CSS 4** with `@tailwindcss/typography` plugin
- Global styles in `src/routes/layout.css`
- No styled-components (removed during migration)
- **Tailwind CSS 유틸리티를 컴포넌트 마크업에 인라인(`class="..."`)으로 직접 작성하지 마세요.** 디버깅과 유지보수를 쉽게 하기 위해 컴포넌트별 `*.module.css`(style module)를 반드시 사용하고, 마크업에서는 의미 있는 클래스명만 참조하세요.

### Components

Svelte 5 components using `$props()` runes in `src/lib/components/`:

- `Header/` — site header + navigation
- `Nav/` — navigation links
- `Post/PostCard.svelte` — post list card
- `Post/PostContent.svelte` — post detail view
- `TOC/` — table of contents
- `Giscus/` — GitHub Discussions comments
- `Quotation/`, `Canvas/`, `ImageComment/` — custom MDX components
- `Section/` — section wrapper

### Key Libraries

- `mdsvex` for MDX/MD preprocessing in Svelte
- `gray-matter` for frontmatter parsing
- `unified` + `remark-*` + `rehype-*` for markdown processing
- `dayjs` for date formatting
- `giscus` for GitHub Discussions-based comments

### Aliases

- `$lib` → `src/lib/` (SvelteKit default)
- `$content` → `src/content/` (custom alias in svelte.config.js)

### Deployment

- Adapter: `@sveltejs/adapter-auto` (Vercel)
- Prerender with `handleHttpError: 'warn'`
- `+layout.server.ts` exports `prerender = true`

## 계획 수립 규칙

새로운 기능 구현, 리팩토링, 버그 수정 전략, 아키텍처 변경처럼 구조화된 계획이 필요한 작업은 `/task-plan`을 사용해 계획을 세우세요.

- 직접 임의의 계획 문서를 만들지 말고 task-plan 워크플로우를 따릅니다.
- 계획을 작성한 뒤 바로 구현하지 말고, 사용자가 계획을 검토하고 승인하면 구현을 시작합니다.
- 계획 기반 구현은 `/implement` 워크플로우를 사용합니다.
