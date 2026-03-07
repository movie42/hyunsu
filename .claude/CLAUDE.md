# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev          # Dev server (NODE_ENV=develop)
yarn build        # Production build
yarn start        # Start production server
yarn lint         # ESLint
```

## Architecture

Next.js 13.4 App Router blog with TypeScript, styled-components, and MDX content.

### Content Pipeline

Blog posts are MDX files in `src/app/markdown-pages/[topic]/` with gray-matter frontmatter:

```yaml
slug: "/post-name"
date: "YYYY-MM-DD"
title: "Post Title"
tags: ["javascript", "react"] # Tags determine routing category
draft: false # Optional, hides post when true
```

**Post resolution flow:** `getAllPosts()` globs all `.mdx` files → `getPost()` parses each with gray-matter → `getData()` finds by slug → rendered via `next-mdx-remote` (RSC).

### Routing & Categories

Posts route to one of three categories based on tags (see `src/app/libs/generateUrl.ts`):

- Tags include "etc" → `/posts/etc/[slug]`
- Tags include "movie" → `/posts/movie/[slug]`
- Everything else → `/posts/programming/[slug]`

All three `[slug]/page.tsx` files share the same pattern: `getData()` → `<DynamicPostContent>`.

### Styling

- **styled-components 6 (RC)** with SSR via `StyledComponentsRegistry` (`src/app/libs/registry.tsx`)
- Theme defined in `src/app/styles/theme.ts` — accessed via `${props => props.theme.hlColor}` pattern
- `Providers.tsx` wraps app with `ThemeProvider` + `StyledComponentsRegistry`
- Path alias: `@/*` maps to `./src/*`

### MDX Components

Custom component mappings in `src/app/mdxComponets.tsx`:

- Code blocks use **Bright** library with `github-dark-dimmed` theme, line numbers, and extensions (focus, collapse, file icons)
- Links converted to Next.js `<Link>`
- Custom components available in MDX: `Quotation`, `Canvas`, `Tabs`, `ImageComment`, `TestContainer`

### Key Libraries

- `bright` for code syntax highlighting (not react-syntax-highlighter, which is also installed but Bright is primary)
- `framer-motion` for animations
- `giscus` for GitHub Discussions-based comments
- `dayjs` for date formatting

## 계획 문서 관리 규칙

**CRITICAL**: 모든 계획 문서(PRD, 기능 계획, 리팩토링 계획 등)는 **반드시** 프로젝트 경로에 있는 `.claude/plans/` 폴더에 `.md` 파일로 저장하세요.
**절대 다른 경로(루트, apps/, docs/ 등)에 계획 문서를 생성하지 마세요.**

- 계쇡 문서 작성하고 바로 구현 금지 사용자에게 계획을 검토하고 구현 계획 승인되면 구현 시작하기.
- 완료하면 todo check와 완료한 내용 기록하기
  - 어떤 파일을 변경했나.
  - 핵심 변경은 무엇인가?
  - 이 변경으로 어떤 효과가 있는가
  - 그밖에 기타 전달하고 싶은 내용

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
