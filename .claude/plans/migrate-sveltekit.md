# Next.js → SvelteKit + Bun + Tailwind CSS 마이그레이션 계획

## 현재 스택 → 목표 스택

| 항목 | 현재 | 목표 |
|------|------|------|
| 프레임워크 | Next.js 13.4 (App Router) | SvelteKit |
| 런타임/패키지매니저 | Node.js / yarn | Bun |
| 스타일링 | styled-components 6 RC | Tailwind CSS |
| MDX | next-mdx-remote + gray-matter | mdsvex |
| 코드 하이라이팅 | Bright | Shiki (SvelteKit 빌트인 지원) |
| 애니메이션 | framer-motion | svelte/transition + svelte/motion |
| 댓글 | giscus (React) | giscus (웹 컴포넌트) |

## 마이그레이션 단계

### Phase 1: 프로젝트 초기화
- [ ] Bun으로 SvelteKit 프로젝트 생성
- [ ] Tailwind CSS 설정
- [ ] 기본 레이아웃 구조 생성
- [ ] 테마/색상 변수 → Tailwind config로 이전

### Phase 2: 콘텐츠 파이프라인
- [ ] mdsvex 설정 (MDX → mdsvex)
- [ ] markdown-pages/ 폴더 복사
- [ ] frontmatter 파싱 로직 구현
- [ ] 카테고리 라우팅 로직 (programming/etc/movie)
- [ ] generateStaticParams → entries() 변환

### Phase 3: 페이지 & 라우팅
- [ ] / (홈) 페이지
- [ ] /posts/programming 목록
- [ ] /posts/etc 목록
- [ ] /posts/movie 목록
- [ ] /posts/[category]/[...slug] 동적 페이지

### Phase 4: 컴포넌트 변환
- [ ] Header → Svelte 컴포넌트
- [ ] Post (카드) → Svelte 컴포넌트
- [ ] Section (목록) → Svelte 컴포넌트
- [ ] TOC (목차 + 스크롤 트래킹) → Svelte
- [ ] Giscus → 웹 컴포넌트 직접 사용
- [ ] Quotation → Svelte 컴포넌트
- [ ] Canvas → Svelte 컴포넌트
- [ ] Tabs → Svelte 컴포넌트
- [ ] ImageComment → Svelte 컴포넌트
- [ ] Nav → Svelte 컴포넌트

### Phase 5: 기능 구현
- [ ] RSS feed (/feed.xml)
- [ ] Sitemap
- [ ] SEO 메타데이터
- [ ] 코드 하이라이팅 (Shiki)
- [ ] 다크모드 (선택)

### Phase 6: 정리
- [ ] 빌드 확인
- [ ] 기존 Next.js 파일 제거
- [ ] 배포 설정

## 라우팅 매핑

```
Next.js (App Router)              →  SvelteKit
/                                 →  src/routes/+page.svelte
/posts/programming                →  src/routes/posts/programming/+page.svelte
/posts/programming/[slug]         →  src/routes/posts/programming/[...slug]/+page.svelte
/posts/etc                        →  src/routes/posts/etc/+page.svelte
/posts/etc/[slug]                 →  src/routes/posts/etc/[...slug]/+page.svelte
/posts/movie                      →  src/routes/posts/movie/+page.svelte
/posts/movie/[slug]               →  src/routes/posts/movie/[...slug]/+page.svelte
/feed.xml                         →  src/routes/feed.xml/+server.ts
/sitemap.xml                      →  src/routes/sitemap.xml/+server.ts
```

## 테마 색상 → Tailwind Config

```js
colors: {
  basic: "#303030",
  gray: { DEFAULT: "#E0E0E0", light: "#F7F7F7", dark: "#C2C2C2" },
  hl: { DEFAULT: "#1352ED", dark: "#0D37A1", light: "#1464FF" },
  sub: "#4C3BFA",
  comp: "#FA4200",
}
```

## MDX → mdsvex 변환 포인트

- `.mdx` → `.svx` 또는 `.md` (mdsvex는 둘 다 지원)
- frontmatter 형식은 동일 (gray-matter 호환)
- 커스텀 컴포넌트는 mdsvex layout으로 주입
- remark-gfm, rehype-slug 플러그인 유지
