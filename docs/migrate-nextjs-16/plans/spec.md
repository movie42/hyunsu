# SvelteKit 블로그 Next.js 16 마이그레이션 - 명세

## 화면/기능 흐름

- 전체 레이아웃: 사용자가 어느 페이지에 접근 → 공통 Header, 전역 스타일, favicon, RSS alternate 링크가 적용된다.
- 홈: 사용자가 `/` 접근 → 최신 글 1개를 대표 글로 사용하고, 이후 글 최대 8개를 Past Issues로 노출한다.
- 프로그래밍 목록: 사용자가 `/posts/programming` 접근 → `etc`, `movie` 태그가 없는 글 목록을 최신순으로 노출한다.
- 기타 목록: 사용자가 `/posts/etc` 접근 → `etc` 태그가 있는 글 목록을 최신순으로 노출한다.
- 영화 목록: 사용자가 `/posts/movie` 접근 → `movie` 태그가 있는 글 목록을 최신순으로 노출한다.
- 글 상세: 사용자가 `/posts/{category}/{slug}` 접근 → slug에 맞는 MDX/MD 글을 렌더링하고 제목, 날짜, 태그, TOC, 댓글, 관련 글을 표시한다.
- 존재하지 않는 글: 사용자가 없는 slug 접근 → Next.js 404 페이지를 반환한다.
- RSS: 사용자가 `/feed.xml` 접근 → 공개 글 전체를 RSS XML로 반환한다.
- sitemap: 사용자가 `/sitemap.xml` 접근 → 홈과 공개 글 전체 URL을 sitemap XML로 반환한다.
- 정적 자산: 페이지/MDX가 `/images/*`, `/font/*`, `/favicon.png`, `/robots.txt`를 요청 → 기존과 동일한 공개 경로로 제공된다.

## 상태 정의

| 상태 | 설명 |
| --- | --- |
| 공개 글 | frontmatter에 `draft: true`가 없고 목록/상세/RSS/sitemap에 포함되는 글 |
| 초안 글 | frontmatter에 `draft: true`가 있어 모든 공개 화면과 feed에서 제외되는 글 |
| 프로그래밍 글 | `tags`에 `etc`, `movie`가 없어 `/posts/programming/{slug}`로 연결되는 글 |
| 기타 글 | `tags`에 `etc`가 있어 `/posts/etc/{slug}`로 연결되는 글 |
| 영화 글 | `tags`에 `movie`가 있어 `/posts/movie/{slug}`로 연결되는 글 |
| MDX 커스텀 컴포넌트 글 | 본문에 `Tabs`, `Quotation`, `ImageComment`, `Canvas` 등 React 컴포넌트 매핑이 필요한 글 |
| 클라이언트 컴포넌트 | 브라우저 API, canvas, giscus, toast, 애니메이션처럼 서버 컴포넌트에서 직접 실행할 수 없는 UI |

## 엣지 케이스

- 중복 slug: 현재 `getPostBySlug`가 slug만으로 글을 찾으므로 카테고리 간 slug 충돌 시 잘못된 글이 렌더링될 수 있다. 마이그레이션 시 `category + slug` 기준 조회로 강화한다.
- 누락된 frontmatter: `title`, `date`, `tags`가 없으면 빌드 시 명확한 오류를 내거나 해당 글을 제외하도록 정책을 정한다.
- 날짜 파싱 실패: `dayjs`가 유효하지 않은 날짜를 받으면 정렬/lastmod가 깨질 수 있으므로 빌드 검증을 추가한다.
- MDX 컴포넌트 미매핑: 콘텐츠에서 사용하는 태그가 `mdx-components.tsx`에 없으면 렌더 오류가 발생하므로 사용 태그 목록을 먼저 스캔한다.
- Svelte 전용 문법: MDX 내부 또는 컴포넌트에 Svelte slot/action/event 문법이 남아 있으면 Next 빌드가 실패하므로 React 문법으로 변환한다.
- 브라우저 전용 코드: `window`, `document`, canvas, giscus script, GSAP 코드는 서버 컴포넌트에서 실행하지 않고 `use client` 또는 dynamic import로 분리한다.
- XML 특수문자: RSS/sitemap 생성 시 제목/설명/URL에 XML 특수문자가 포함되어도 올바르게 escape 또는 CDATA 처리한다.
- 코드 하이라이트 언어 미지원: Shiki에 등록되지 않은 언어는 기존처럼 `text` fallback으로 렌더링한다.
- 이미지 경로 변경: `static`에서 `public`으로 이동해도 Markdown 내 절대 경로 `/images/...`는 깨지지 않아야 한다.
- 정적 빌드: 모든 공개 상세 페이지가 `generateStaticParams()`에 포함되어 배포 환경에서 404가 되지 않아야 한다.

## 완료 기준

- `bun run build` 또는 합의한 Next 빌드 명령이 성공한다.
- 기존 주요 URL 구조가 유지된다.
- 홈/카테고리/상세/RSS/sitemap의 콘텐츠 수와 정렬이 기존과 일치한다.
- MDX 내 커스텀 컴포넌트가 React 버전으로 정상 렌더링된다.
- SvelteKit/Vite/Svelte 의존성과 설정 파일이 제거된다.
