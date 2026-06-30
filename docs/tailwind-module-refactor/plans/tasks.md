# Tailwind 인라인 클래스 CSS Module화

> 이슈: 없음
> 작업 종류: 기능 수정
> 상태: 완료
> 생성일: 2026-06-30

## 개요

현재 Next.js 기반 컴포넌트와 라우트 페이지에 Tailwind 유틸리티 클래스가 `className="..."` 형태로 인라인 작성되어 있다. 프로젝트 스타일링 규칙에 맞춰 컴포넌트/페이지별 `*.module.css` 파일을 만들고, 마크업에서는 의미 있는 CSS Module 클래스명만 참조하도록 변경한다.

범위는 `src/components/**`와 `src/app/**`의 UI 마크업에 직접 들어간 Tailwind 유틸리티 클래스 제거이다. MDX 본문 예제 코드나 콘텐츠 내부의 설명용 `className` 문자열은 글 내용이므로 이번 작업 범위에서 제외한다. 전역 마크다운 본문 스타일(`post-content`)처럼 콘텐츠 렌더링에 의존하는 전역 셀렉터는 필요 시 유지하되, 컴포넌트에서 참조하는 컨테이너 클래스는 CSS Module로 옮긴다.

## Phase 1: 공통 패턴과 컴포넌트 CSS Module 분리

- [x] Header 스타일을 CSS Module로 분리 (`src/components/Header.tsx`, `src/components/Header.module.css`)
  - 패턴: Tailwind v4 프로젝트이므로 CSS Module 내부에서 `@apply`로 기존 유틸리티를 보존하거나, 복잡한 임의값은 일반 CSS 속성으로 옮긴다.
- [x] Nav 스타일을 CSS Module로 분리 (`src/components/Nav.tsx`, `src/components/Nav.module.css`)
  - 패턴: 반복되는 링크/아이템 스타일은 의미 클래스(`item`, `link`)로 통합한다.
- [x] PostCard 스타일을 CSS Module로 분리 (`src/components/PostCard.tsx`, `src/components/PostCard.module.css`)
  - 패턴: `group-hover:*`, `line-clamp-*`, hover shadow/transform을 CSS Module 셀렉터와 `:hover`로 치환한다.
- [x] Section 스타일을 CSS Module로 분리 (`src/components/Section.tsx`, `src/components/Section.module.css`)
  - 재사용: `src/components/PostCard.tsx`
- [x] 단순 MDX 보조 컴포넌트 스타일을 CSS Module로 분리 (`src/components/Canvas.tsx`, `src/components/ImageComment.tsx`, `src/components/Quotation.tsx`)
  - 패턴: 단일 루트 요소도 컴포넌트별 module 파일을 둔다.

## Phase 2: 글 상세/목차/탭 스타일 분리

- [x] PostContent 레이아웃과 토스트 스타일을 CSS Module로 분리 (`src/components/PostContent.tsx`, `src/components/PostContent.module.css`)
  - 재사용: `src/components/PostCard.tsx`, `src/hooks/useReveal.ts`
  - 패턴: 전역 `.post-content` 하위 MDX 스타일은 `src/app/globals.css`에 남기고, 컴포넌트 컨테이너 클래스는 `:global(.post-content)` 또는 별도 전역 연결 방식을 검토한다.
- [x] TOC 스타일과 활성 상태 스타일을 CSS Module로 분리 (`src/components/TOC.tsx`, `src/components/TOC.module.css`)
  - 패턴: 조건부 클래스는 `styles.active` / `styles.inactive` 조합으로 표현한다.
- [x] Tabs 전역 클래스 스타일을 CSS Module로 이동 (`src/components/Tabs.tsx`, `src/components/Tabs.module.css`, `src/app/globals.css`)
  - 패턴: 현재 `tabs-container`, `tabs-header`, `tab-button`, `active`, `tabs-content`가 `globals.css`에 있으므로 컴포넌트 전용 module로 옮긴다. DOM 쿼리에서 클래스 문자열 의존이 있으면 module 클래스 참조로 갱신한다.

## Phase 3: App Router 페이지 CSS Module 분리

- [x] 홈 페이지 스타일을 CSS Module로 분리 (`src/app/page.tsx`, `src/app/page.module.css`)
  - 재사용: `src/components/Nav.tsx`, `src/components/Section.tsx`
- [x] 404 페이지 스타일을 CSS Module로 분리 (`src/app/not-found.tsx`, `src/app/not-found.module.css`)
- [x] 카테고리 목록 페이지 스타일을 CSS Module로 분리 (`src/app/posts/programming/page.tsx`, `src/app/posts/movie/page.tsx`, `src/app/posts/etc/page.tsx`, 각 `page.module.css`)
  - 패턴: 세 카테고리 페이지의 동일한 레이아웃은 동일한 CSS 클래스 구조로 유지한다.
- [x] 글 상세 라우트의 wrapper 스타일을 CSS Module로 분리 (`src/app/posts/programming/[...slug]/page.tsx`, `src/app/posts/movie/[...slug]/page.tsx`, `src/app/posts/etc/[...slug]/page.tsx`, 각 `page.module.css`)

## Phase 4: 검증과 정리

- [x] 남은 인라인 Tailwind 유틸리티 클래스 검색 및 정리 (`src/components/**`, `src/app/**`)
  - 패턴: `rg 'className="[^"]*(flex|grid|px-|py-|text-|bg-|border|rounded|...)' src/components src/app`로 점검한다.
- [x] `globals.css`에서 컴포넌트 전용 스타일 제거 및 전역 스타일만 유지 (`src/app/globals.css`)
  - 패턴: MDX 콘텐츠 스타일, 폰트, 테마 토큰, base reset, 전역 애니메이션처럼 전역 의미가 있는 스타일은 유지한다.
- [x] 타입/빌드 검증 실행 (`package.json`)
  - 패턴: 사용 가능한 명령 확인 후 `bun run check` 또는 Next.js 프로젝트에 맞는 `bun run build`를 실행한다.

## 진행 기록

### 2026-06-30

- 작업 내역: Tailwind 인라인 클래스 CSS Module화 계획 작성
- 블로커: 없음


### 2026-06-30 — Phase 1: 공통 패턴과 컴포넌트 CSS Module 분리

- 작업 내용: Header, Nav, PostCard, Section, Canvas, ImageComment, Quotation 컴포넌트의 인라인 Tailwind 클래스를 컴포넌트별 CSS Module로 이전
- 수정 파일: `src/components/Header.tsx`, `src/components/Header.module.css`, `src/components/Nav.tsx`, `src/components/Nav.module.css`, `src/components/PostCard.tsx`, `src/components/PostCard.module.css`, `src/components/Section.tsx`, `src/components/Section.module.css`, `src/components/Canvas.tsx`, `src/components/Canvas.module.css`, `src/components/ImageComment.tsx`, `src/components/ImageComment.module.css`, `src/components/Quotation.tsx`, `src/components/Quotation.module.css`
- 현재 상태: Phase 1 완료, 다음 Phase 2

### 2026-06-30 — Phase 2: 글 상세/목차/탭 스타일 분리

- 작업 내용: PostContent, TOC, Tabs 스타일을 CSS Module로 이전하고 Tabs 전역 클래스 의존을 `data-tabs-content` 기반으로 정리
- 수정 파일: `src/components/PostContent.tsx`, `src/components/PostContent.module.css`, `src/components/TOC.tsx`, `src/components/TOC.module.css`, `src/components/Tabs.tsx`, `src/components/Tabs.module.css`, `src/app/globals.css`
- 현재 상태: Phase 2 완료, 다음 Phase 3

### 2026-06-30 — Phase 3: App Router 페이지 CSS Module 분리

- 작업 내용: 홈, 404, 카테고리 목록, 글 상세 라우트의 인라인 Tailwind 클래스를 페이지별 CSS Module로 이전
- 수정 파일: `src/app/page.tsx`, `src/app/page.module.css`, `src/app/not-found.tsx`, `src/app/not-found.module.css`, `src/app/posts/programming/page.tsx`, `src/app/posts/programming/page.module.css`, `src/app/posts/movie/page.tsx`, `src/app/posts/movie/page.module.css`, `src/app/posts/etc/page.tsx`, `src/app/posts/etc/page.module.css`, `src/app/posts/programming/[...slug]/page.tsx`, `src/app/posts/programming/[...slug]/page.module.css`, `src/app/posts/movie/[...slug]/page.tsx`, `src/app/posts/movie/[...slug]/page.module.css`, `src/app/posts/etc/[...slug]/page.tsx`, `src/app/posts/etc/[...slug]/page.module.css`
- 현재 상태: Phase 3 완료, 다음 Phase 4

### 2026-06-30 — Phase 4: 검증과 정리

- 작업 내용: 남은 인라인 Tailwind 클래스 검색, Tabs 전역 스타일 제거, 타입 체크 및 프로덕션 빌드 검증 완료
- 수정 파일: `src/app/globals.css`, `package.json`
- 현재 상태: Phase 4 완료, 전체 작업 완료

### 2026-06-30 — 최종 완료

- 작업 내용: 모든 체크리스트 완료 및 `bun run check`, `bun run build` 성공 확인
- 현재 상태: 완료
