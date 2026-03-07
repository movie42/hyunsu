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

## 계획 문서 관리 규칙

**CRITICAL**: 모든 계획 문서(PRD, 기능 계획, 리팩토링 계획 등)는 **반드시** 프로젝트 경로에 있는 `.claude/plans/` 폴더에 `.md` 파일로 저장하세요.
**절대 다른 경로(루트, apps/, docs/ 등)에 계획 문서를 생성하지 마세요.**

- 계획 문서 작성하고 바로 구현 금지 사용자에게 계획을 검토하고 구현 계획 승인되면 구현 시작하기.

### 계획 문서 작성 시점

- 새로운 기능 구현 계획
- 리팩토링 계획
- 버그 수정 전략
- 아키텍처 변경 제안

### 관리자 기능 계획

관리자 관련 PRD는 `.claude/plans/admin/` 폴더에 저장하며, 새로운 PRD를 추가하면 **반드시** `.claude/plans/admin/index.md` 목차 파일에도 항목을 추가하세요.

### 파일 명명 규칙

```
.claude/plans/
├── YYYY-MM-DD-feature-{기능명}.md      # 기능 구현 계획
├── YYYY-MM-DD-refactor-{대상}.md       # 리팩토링 계획
├── YYYY-MM-DD-bugfix-{이슈번호}.md     # 버그 수정 계획
└── YYYY-MM-DD-architecture-{주제}.md   # 아키텍처 결정
```

### 왜 plans 폴더를 사용하나요?

- `.claude/rules/`는 자동 로드되어 토큰을 소비함
- `plans/`는 필요할 때만 참조하므로 효율적
- 세션 재개 시 `/resume`으로 컨텍스트 유지 가능
- 작업 완료 후 기록으로 보관

### 계획 문서 기반으로 구현할때

- 완료하면 todo check와 완료한 내용 기록하기
  - 어떤 파일을 변경했나.
  - 핵심 변경은 무엇인가?
  - 이 변경으로 어떤 효과가 있는가
  - 그밖에 기타 전달하고 싶은 내용

- 새로운 브랜치를 생성하고 거기에서 진행하고 진행을 나중에 추적할수 있게 Phase를 변경할때마다 의미있는 변경사항이라고 생각되면 커밋을하고 수정사항을 진행하도록해줘
