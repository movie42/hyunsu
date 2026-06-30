# SvelteKit 블로그 Next.js 16 마이그레이션

> 이슈: 없음
> 작업 종류: 기능 수정
> 상태: 완료
> 생성일: 2026-06-30

## 개요

현재 프로젝트는 SvelteKit 2 + Svelte 5 + mdsvex 기반 블로그이며, `src/content/markdown-pages`의 MDX/MD 글을 서버에서 읽어 홈/카테고리/상세/RSS/sitemap을 생성한다. 목표는 동일한 URL 구조와 콘텐츠/SEO 동작을 유지하면서 Next.js 16 App Router 기반으로 전환하는 것이다.

범위에는 Next.js 16 프로젝트 설정, 라우트 재구성, Svelte 컴포넌트의 React 컴포넌트 변환, MDX 렌더링 파이프라인 이전, 정적 생성/메타데이터/RSS/sitemap 복원이 포함된다. 디자인 전면 개편, 콘텐츠 대량 수정, 신규 기능 추가는 제외한다.

## Phase 1: 현행 기능 고정 및 마이그레이션 기준선 수립

- [x] 현재 SvelteKit 라우트/데이터 흐름 목록화 (`src/routes/**`)
  - 패턴: 홈은 `+page.server.ts`에서 최신 글 1개와 과거 글 8개를 반환하고, 카테고리는 `tags` 기준으로 `/posts/programming`, `/posts/etc`, `/posts/movie`에 분기한다.
  - 발견: 라우트는 홈, 3개 카테고리 목록, 3개 카테고리별 `[...slug]` 상세, `feed.xml`, `sitemap.xml`로 구성되어 있으며 `+layout.server.ts`에서 `prerender = true`를 설정한다.
  - 발견: 상세 라우트의 `entries()`는 카테고리별 정적 엔트리를 만들지만 `load()`는 `getPostBySlug(slug)`만 사용하므로 명세의 카테고리+slug 조회 강화가 필요하다.
  - 발견: 상세 페이지 관련 글은 카테고리와 무관하게 최신 글 중 현재 slug 제외 3개를 `generateUrl()`로 매핑한다.
- [x] 콘텐츠/프론트매터/MDX 커스텀 컴포넌트 사용 현황 정리 (`src/content/markdown-pages/**/*.{mdx,md}`)
  - 재사용: `src/lib/server/posts.ts`
  - 패턴: `gray-matter`, `dayjs`, `tags`, `draft`, `description`, `date`, `title` 필드를 기준으로 글 목록과 slug를 생성한다.
  - 발견: 콘텐츠는 총 64개이고 모든 파일에 `title`, `date`, `tags`가 있으며 `draft: true`는 2개다. `description`은 1개 파일에만 존재하고, 기존 `Post.description`은 대부분 빈 문자열 fallback 또는 본문 100자 fallback에 의존한다.
  - 발견: 커스텀 컴포넌트 태그는 `<Tabs>` 2개, `<ImageComment>` 1개, `<Quotation>` 2개, `<Canvas>` 1개 파일에서 확인되었다.
  - 발견: 일부 MDX는 React식 `className`과 iframe/img 접근성 누락 경고를 포함하며, Next MDX 전환 시 `className`은 그대로 호환 가능하지만 Svelte 전용 `{@html ...}`는 변환 검토가 필요하다.
- [x] 현재 빌드/검증 스냅샷 확보 (`package.json`, `README.md`)
  - 패턴: `bun` 기반 lockfile이 있고 `vite build`, `svelte-check` 스크립트를 사용한다.
  - 발견: `package.json`은 `dev/build/preview`를 Vite로, `check`를 `svelte-kit sync && svelte-check`로 실행한다.
  - 발견: `bun run check`는 `src/lib/escape-mdsvex.js` implicit any 2건과 `src/lib/components/Post/PostContent.svelte`의 `toast.remove()` 타입 오류 1건으로 실패하고, Header 링크 aria-label 경고 2건이 있다.
  - 발견: `bun run build`는 성공하지만 MDX `className`, iframe title, img alt, Header aria-label 경고와 `/posts/funtionalProgramming` 404 로그가 발생한다.

## Phase 2: Next.js 16 기반 프로젝트 골격 전환

- [x] SvelteKit/Vite 설정을 Next.js 16 설정으로 교체 (`package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`)
  - 패턴: Tailwind CSS 4와 typography 플러그인을 유지한다.
  - 발견: `bun install` 결과 Next.js 16.2.9, React 19.2.7, `@tailwindcss/postcss` 기반으로 lockfile이 갱신되었다.
  - 결정: Next의 workspace root 오탐 경고를 막기 위해 `next.config.ts`에 `turbopack.root = process.cwd()`를 명시했다.
- [x] App Router 기본 파일 구성 생성 (`src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`)
  - 재사용: `src/routes/layout.css`
  - 발견: `src/routes/layout.css`를 `src/app/globals.css`로 복사해 Tailwind CSS 4 theme/token과 typography 플러그인 선언을 유지했다.
  - 결정: Phase 4 전까지는 React 변환된 Header 컴포넌트가 없으므로 `layout.tsx`에 최소 헤더/내비게이션을 임시 구성했다.
- [x] 정적 자산 경로 이전/검증 (`static/**` → `public/**`)
  - 패턴: `/favicon.png`, `/images/*`, `/font/*`, `/robots.txt` 공개 경로를 유지한다.
  - 발견: `public`에 35개 정적 파일을 복사했으며 `/favicon.png`, `/images/*`, `/font/*`, `/robots.txt` 경로 구조를 유지했다.
  - 발견: `bun run check`와 `bun run build`가 Next.js 기준으로 통과한다.

## Phase 3: 콘텐츠 데이터 계층 이전

- [x] Svelte 서버 유틸을 Next 서버 유틸로 변환 (`src/lib/server/posts.ts`)
  - 패턴: Node `fs/path`, `gray-matter`, 날짜 정렬, `draft` 제외, `generateUrl`, `getCategory` 로직은 유지한다.
  - 발견: `Category`, `PostSummary`, `category` 필드, `getPostsByCategory()`, `getPostByCategoryAndSlug()`, `toPostSummary()`를 추가해 Next 서버 컴포넌트에서 재사용할 수 있게 했다.
  - 결정: slug 충돌 엣지 케이스 대응을 위해 상세 페이지는 `category + slug` 기준으로 조회한다.
- [x] Next 정적 파라미터 생성 로직 구현 (`src/app/posts/programming/[...slug]/page.tsx`, `src/app/posts/etc/[...slug]/page.tsx`, `src/app/posts/movie/[...slug]/page.tsx`)
  - 패턴: SvelteKit `entries()`는 Next의 `generateStaticParams()`로 대체한다.
  - 발견: 현재 공개 글 기준 카테고리 수는 programming 41개, etc 21개, movie 0개다.
  - 결정: `output: 'export'`에서는 정적 파라미터가 0개인 catch-all 라우트가 빌드 오류를 유발해, Phase 3에서는 `generateStaticParams()` 기반 SSG를 유지하되 `next.config.ts`의 `output: 'export'`는 제거했다.
- [x] 홈/카테고리 서버 렌더링 데이터 매핑 구현 (`src/app/page.tsx`, `src/app/posts/programming/page.tsx`, `src/app/posts/etc/page.tsx`, `src/app/posts/movie/page.tsx`)
  - 재사용: `src/routes/+page.server.ts`, `src/routes/posts/*/+page.server.ts`
  - 발견: 홈은 최신 글 1개와 이후 8개를 매핑하고, 카테고리 목록은 기존 `tags` 분류와 동일한 `getCategory()` 결과를 사용한다.
  - 발견: `bun run check`와 `bun run build`가 통과하며 상세 라우트는 programming 41개, etc 21개를 SSG로 생성한다.

## Phase 4: UI 컴포넌트 React 변환

- [x] 공통 레이아웃/네비게이션 컴포넌트 변환 (`src/components/Header.tsx`, `src/components/Nav.tsx`, `src/components/Section.tsx`, `src/components/PostCard.tsx`)
  - 재사용: `src/lib/components/Header/Header.svelte`, `src/lib/components/Nav/Nav.svelte`, `src/lib/components/Section/Section.svelte`, `src/lib/components/Post/PostCard.svelte`
  - 결정: `Header`를 `src/app/layout.tsx`에 연결하고 홈/카테고리 목록은 `Nav`, `Section`, `PostCard`를 재사용하도록 정리했다.
- [x] 글 상세 UI 및 TOC/댓글/탭/인용 컴포넌트 변환 (`src/components/PostContent.tsx`, `src/components/TOC.tsx`, `src/components/Giscus.tsx`, `src/components/Tabs.tsx`, `src/components/Quotation.tsx`)
  - 재사용: `src/lib/components/Post/PostContent.svelte`, `src/lib/components/TOC/TOC.svelte`, `src/lib/components/Giscus/Giscus.svelte`, `src/lib/components/Tabs/Tabs.svelte`, `src/lib/components/Quotation/Quotation.svelte`
  - 결정: DOM 관찰, Giscus 스크립트 삽입, 코드 복사, GSAP ScrollTrigger 사용부는 `use client` 컴포넌트로 분리했다.
  - 발견: Phase 5 전까지 상세 페이지는 `PostContent` 레이아웃 안에 MDX placeholder를 렌더링해 UI 연결만 검증한다.
- [x] 브라우저 API/애니메이션 의존 컴포넌트 클라이언트 컴포넌트로 분리 (`src/components/Canvas.tsx`, `src/components/ImageComment.tsx`, `src/lib/actions/reveal.ts`)
  - 패턴: Svelte action/reveal과 GSAP 사용부는 React hook 또는 `use client` 컴포넌트로 이전한다.
  - 결정: `Canvas`는 `requestAnimationFrame` 정리를 포함한 클라이언트 컴포넌트로 변환하고, Svelte `reveal` action은 `src/hooks/useReveal.ts`로 대체했다.

## Phase 5: MDX 렌더링 파이프라인 이전

- [x] MDX 컴파일/렌더링 전략 확정 및 설정 (`next.config.ts`, `src/mdx-components.tsx`)
  - 패턴: 기존 mdsvex의 `remark-gfm`, `rehype-slug`, `shiki` 코드 하이라이트를 Next MDX/MDX remote 파이프라인으로 대체한다.
  - 결정: 로컬 콘텐츠 문자열을 `@mdx-js/mdx` `evaluate()`로 서버에서 컴파일하고, `remark-gfm`, `rehype-slug`, Shiki 기반 rehype 플러그인을 적용하는 `src/lib/server/mdx.tsx`를 추가했다.
  - 결정: Shiki HTML을 HAST로 되돌리기 위해 `hast-util-from-html`을 추가했다.
- [x] MDX 내부 Svelte 컴포넌트 문법을 React MDX 문법으로 변환 (`src/content/markdown-pages/**/*.mdx`)
  - 패턴: 현재 사용 확인된 커스텀 태그는 `<Tabs>`, `<ImageComment>`, `<Quotation>`, `<Canvas />`이다.
  - 발견: 현재 MDX 커스텀 태그는 React MDX JSX 형태로 이미 호환되어 콘텐츠 파일 수정 없이 `src/mdx-components.tsx` 매핑으로 처리했다.
  - 결정: `Quotation`은 기존 `<Quotation>` 무속성 사용을 지원하도록 `type="speak"` 기본값을 둔다.
- [x] 글 상세 페이지에서 MDX 본문 렌더링 연결 (`src/app/posts/*/[...slug]/page.tsx`)
  - 패턴: 기존 `import.meta.glob` + `filePath` 방식은 Next 서버 컴파일/동적 import/remote render 방식으로 대체한다.
  - 발견: `bun run check`와 `bun run build`가 통과하며 공개 상세 페이지 62개가 MDX 본문 포함 SSG로 생성된다.

## Phase 6: SEO, 피드, 정적 배포 동등성 복원

- [x] 페이지별 metadata/canonical 구현 (`src/app/**/page.tsx`)
  - 패턴: 홈 title/description, 상세 title/description/canonical을 기존 `<svelte:head>`와 동일하게 유지한다.
  - 결정: 공통 사이트 상수는 `src/lib/site.ts`에 분리하고, 루트/홈/카테고리/상세 페이지에 Next `metadata` 및 `generateMetadata()`를 적용했다.
  - 발견: 상세 페이지 canonical은 카테고리와 slug 기준으로 `/posts/{category}/{slug}`를 생성한다.
- [x] RSS와 sitemap 라우트 핸들러 구현 (`src/app/feed.xml/route.ts`, `src/app/sitemap.xml/route.ts`)
  - 재사용: `src/routes/feed.xml/+server.ts`, `src/routes/sitemap.xml/+server.ts`
  - 결정: XML 특수문자는 escape 처리하고 RSS 제목/설명은 CDATA로 감싸며, 두 route handler 모두 `force-static`으로 정적 생성되도록 했다.
- [x] 404/robots/favicon/font/image 동작 검증 (`src/app/not-found.tsx`, `public/**`)
  - 발견: `/favicon.png`, `/robots.txt`, `/images/*`, `/font/*`는 `public/**`에 존재한다.
  - 결정: SUIT 폰트는 CSS `@font-face`에서 `/font/SUIT-Variable.woff2`를 직접 참조하도록 연결하고, 공통 `not-found.tsx`를 추가했다.

## Phase 7: 검증 및 Svelte 잔재 제거

- [x] 타입/린트/빌드 스크립트 정리 및 실행 (`package.json`)
  - 패턴: `svelte-check`, `vite`, `@sveltejs/*`, `mdsvex`, `svelte-sonner` 제거 후 Next/React용 검증으로 대체한다.
  - 발견: 현재 `package.json`은 Next/React/MDX 런타임과 `tsc --noEmit` 기반 `check`만 사용하며 SvelteKit/Vite/mdsvex 의존성은 남아 있지 않다.
  - 발견: `bun run check`와 `bun run build`가 통과한다.
- [x] 주요 URL 수동 회귀 테스트 (`/`, `/posts/programming`, `/posts/etc`, `/posts/movie`, `/posts/{category}/{slug}`, `/feed.xml`, `/sitemap.xml`)
  - 발견: 로컬 `next start`에서 `/`, `/posts/programming`, `/posts/etc`, `/posts/movie`, `/posts/programming/fsd`, `/posts/etc/251005`, `/feed.xml`, `/sitemap.xml`이 모두 200을 반환했다.
  - 발견: `/favicon.png`, `/robots.txt`, `/images/why.png`, `/font/SUIT-Variable.woff2` 공개 자산도 200을 반환했다.
- [x] 미사용 Svelte 파일/설정 제거 (`svelte.config.js`, `vite.config.ts`, `src/routes/**`, `src/lib/components/**/*.svelte`, `src/app.html`)
  - 결정: `src/routes`, `src/lib/components`, `src/lib/actions`, `svelte.config.js`, `vite.config.ts`, `src/app.html`, `src/app.d.ts`, `src/lib/escape-mdsvex.js`, `src/lib/assets`를 제거했다.
  - 결정: `tsconfig.json`의 Svelte 제외/별칭 설정과 `.gitignore`의 SvelteKit/Vite 잔재도 정리했다.

## 진행 기록

### 2026-06-30 — 최종 완료

- 작업 내용: 모든 Phase 체크리스트 완료를 확인하고, Next.js 16 App Router 마이그레이션의 타입 검사/빌드/주요 URL 회귀 검증을 완료했다.
- 수정 파일: `docs/migrate-nextjs-16/plans/tasks.md`
- 현재 상태: 전체 완료

### 2026-06-30 — Phase 7: 검증 및 Svelte 잔재 제거

- 작업 내용: SvelteKit/Vite/Svelte 잔재 파일과 설정을 제거하고, TypeScript 설정 및 gitignore를 Next 기준으로 정리했으며 주요 URL과 공개 자산을 로컬 서버에서 검증했다.
- 수정 파일: `package.json`, `bun.lock`, `tsconfig.json`, `.gitignore`, `svelte.config.js`, `vite.config.ts`, `src/routes/**`, `src/lib/components/**`, `src/lib/actions/**`, `src/app.html`, `src/app.d.ts`, `src/lib/escape-mdsvex.js`, `src/lib/assets/**`, `docs/migrate-nextjs-16/plans/tasks.md`
- 현재 상태: Phase 7 완료, 전체 완료

### 2026-06-30 — Phase 6: SEO, 피드, 정적 배포 동등성 복원

- 작업 내용: 루트/홈/카테고리/상세 metadata와 canonical을 구현하고, RSS/sitemap route handler 및 공통 404 페이지를 추가했으며 폰트 공개 경로를 전역 CSS에 연결했다.
- 수정 파일: `src/lib/site.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/posts/programming/page.tsx`, `src/app/posts/etc/page.tsx`, `src/app/posts/movie/page.tsx`, `src/app/posts/programming/[...slug]/page.tsx`, `src/app/posts/etc/[...slug]/page.tsx`, `src/app/posts/movie/[...slug]/page.tsx`, `src/app/feed.xml/route.ts`, `src/app/sitemap.xml/route.ts`, `src/app/not-found.tsx`, `src/app/globals.css`, `docs/migrate-nextjs-16/plans/tasks.md`
- 현재 상태: Phase 6 완료, 다음 Phase 7

### 2026-06-30 — Phase 5: MDX 렌더링 파이프라인 이전

- 작업 내용: `@mdx-js/mdx` 기반 서버 MDX 렌더링 유틸을 추가하고, 커스텀 MDX 컴포넌트 매핑과 Shiki/remark/rehype 플러그인을 연결했으며 상세 페이지 placeholder를 실제 MDX 본문으로 교체했다.
- 수정 파일: `package.json`, `bun.lock`, `src/mdx-components.tsx`, `src/lib/server/mdx.tsx`, `src/components/Quotation.tsx`, `src/app/posts/programming/[...slug]/page.tsx`, `src/app/posts/etc/[...slug]/page.tsx`, `src/app/posts/movie/[...slug]/page.tsx`, `docs/migrate-nextjs-16/plans/tasks.md`
- 현재 상태: Phase 5 완료, 다음 Phase 6

### 2026-06-30 — Phase 4: UI 컴포넌트 React 변환

- 작업 내용: 공통 레이아웃/목록/상세/MDX 커스텀 UI를 React 컴포넌트로 변환하고, 브라우저 API와 GSAP/Giscus/Canvas/TOC/Tabs 사용부를 클라이언트 컴포넌트로 분리했다.
- 수정 파일: `src/components/Header.tsx`, `src/components/Nav.tsx`, `src/components/Section.tsx`, `src/components/PostCard.tsx`, `src/components/PostContent.tsx`, `src/components/TOC.tsx`, `src/components/Giscus.tsx`, `src/components/Tabs.tsx`, `src/components/Quotation.tsx`, `src/components/Canvas.tsx`, `src/components/ImageComment.tsx`, `src/hooks/useReveal.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/posts/programming/page.tsx`, `src/app/posts/etc/page.tsx`, `src/app/posts/movie/page.tsx`, `src/app/posts/programming/[...slug]/page.tsx`, `src/app/posts/etc/[...slug]/page.tsx`, `src/app/posts/movie/[...slug]/page.tsx`, `src/app/globals.css`, `docs/migrate-nextjs-16/plans/tasks.md`
- 현재 상태: Phase 4 완료, 다음 Phase 5

### 2026-06-30 — Phase 3: 콘텐츠 데이터 계층 이전

- 작업 내용: 게시글 서버 유틸을 Next 서버 컴포넌트에서 사용할 수 있도록 확장하고, 홈/카테고리/상세 라우트에 기존 데이터 매핑과 `generateStaticParams()`를 연결했다.
- 수정 파일: `src/lib/server/posts.ts`, `src/app/page.tsx`, `src/app/posts/programming/page.tsx`, `src/app/posts/etc/page.tsx`, `src/app/posts/movie/page.tsx`, `src/app/posts/programming/[...slug]/page.tsx`, `src/app/posts/etc/[...slug]/page.tsx`, `src/app/posts/movie/[...slug]/page.tsx`, `next.config.ts`, `docs/migrate-nextjs-16/plans/tasks.md`
- 현재 상태: Phase 3 완료, 다음 Phase 4

### 2026-06-30 — Phase 2: Next.js 16 기반 프로젝트 골격 전환

- 작업 내용: Next.js 16/React 19 의존성 및 스크립트로 전환하고, App Router 기본 레이아웃/홈/전역 스타일을 생성했으며 정적 자산을 `public`으로 복사했다.
- 수정 파일: `package.json`, `bun.lock`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `next-env.d.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `public/**`, `docs/migrate-nextjs-16/plans/tasks.md`
- 현재 상태: Phase 2 완료, 다음 Phase 3

### 2026-06-30 — Phase 1: 현행 기능 고정 및 마이그레이션 기준선 수립

- 작업 내용: SvelteKit 라우트/데이터 흐름, 콘텐츠 프론트매터/커스텀 MDX 컴포넌트, 현재 검증/빌드 상태를 기준선으로 정리했다.
- 수정 파일: `docs/migrate-nextjs-16/plans/tasks.md`
- 현재 상태: Phase 1 완료, 다음 Phase 2

### 2026-06-30

- SvelteKit 라우트, 콘텐츠 유틸, MDX 커스텀 컴포넌트, 정적 자산 구조를 확인했다.
- Next.js 16 App Router 전환을 위한 단계별 계획과 명세 문서를 작성했다.
- 블로커: MDX 콘텐츠 내부의 Svelte 컴포넌트 문법을 React MDX 호환 문법으로 변환해야 하며, 일부 컴포넌트는 클라이언트 컴포넌트로 분리 필요.
