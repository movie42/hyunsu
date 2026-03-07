# mdsvex 기반 렌더링 마이그레이션

## 배경

현재 블로그 포스트는 `src/content/markdown-pages/`의 MDX 파일을 gray-matter로 파싱 후 unified 파이프라인(`renderMarkdown()`)으로 HTML 문자열 변환 → `{@html}`로 렌더링하고 있음.

**문제점:**
- 코드 블록에 구문 강조가 없음
- MDX 안의 커스텀 컴포넌트(`<Quotation>`, `<Canvas>`, `<ImageComment>`, `<Tabs>`)가 렌더링되지 않음 (5개 파일 해당)
- mdsvex가 설정되어 있지만 실제로 사용되지 않음

## 구현 완료

### Phase 1: mdsvex 동적 import 기반 렌더링

- [x] 1-1. `src/lib/server/posts.ts`에서 `renderMarkdown()` 제거, `filePath` 반환 추가
- [x] 1-2. `+page.server.ts`(detail 3개)에서 `content` HTML 대신 `filePath`/메타만 반환
- [x] 1-3. `+page.svelte`(detail 3개)에서 Vite `import.meta.glob({ eager: true })`로 MDX 파일을 Svelte 컴포넌트로 로드
- [x] 1-4. `{@html data.content}` → `<Content />` 컴포넌트 렌더링으로 변경

### Phase 2: 코드 하이라이팅

- [x] 2-1. `svelte.config.js`의 mdsvex highlight 옵션에 shiki 설정 (`github-dark-dimmed` 테마)
- [x] 2-2. `PostContent.svelte`의 `pre`/`code` 블록 스타일 추가

### Phase 3: 커스텀 컴포넌트 연결

- [x] 3-1. `escape-mdsvex.js` preprocessor에서 MDX 파일에 필요한 컴포넌트를 자동 import 삽입
- [x] 3-2. `<Quotation>`, `<Canvas>`, `<ImageComment>` 사용 가능 확인

### Phase 4: 정리

- [x] 4-1. unified 관련 미사용 의존성 제거 (`unified`, `remark-parse`, `remark-rehype`, `rehype-stringify`, `rehype-autolink-headings`, `@shikijs/rehype`, `unist-util-visit`)
- [x] 4-2. 빌드 테스트 통과
- [x] 4-3. 주요 포스트 렌더링 확인

## 변경 파일 요약

| 파일 | 변경 |
|------|------|
| `svelte.config.js` | shiki highlighter 설정, `escapeMdsvex` preprocessor 추가, Layout 절대경로 |
| `src/lib/escape-mdsvex.js` | **신규** - `{}`/`<` escape + 커스텀 컴포넌트 auto-import preprocessor |
| `src/lib/server/posts.ts` | `renderMarkdown()` 제거, `filePath` 필드 추가, unified 의존성 제거 |
| `src/routes/posts/*/[...slug]/+page.server.ts` (3개) | HTML content 반환 제거, filePath 반환 |
| `src/routes/posts/*/[...slug]/+page.svelte` (3개) | `import.meta.glob` eager + `<Content />` 렌더링 |
| `src/lib/components/Post/PostContent.svelte` | pre 블록 스타일 추가 |
| `src/lib/components/mdsvex/Layout.svelte` | 단순 wrapper로 정리 |
| `package.json` | shiki 추가, unused 패키지 7개 제거 |

## 핵심 변경

- **렌더링 엔진**: unified HTML 문자열 → mdsvex Svelte 컴포넌트
- **코드 하이라이팅**: 없음 → shiki `github-dark-dimmed`
- **커스텀 컴포넌트**: 미동작 → 자동 import로 동작
- **콘텐츠 파일**: 위치/형식 변경 없음
