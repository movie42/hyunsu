# 블로그 리디자인 - Dia Browser 스타일 적용

> 참고: `.claude/documents/2026-03-07-blog-redesign-plan.md` 기반
> 현재 스택: SvelteKit + Svelte 5 + Tailwind CSS 4 + mdsvex

---

## Phase 1: 컬러/타이포그래피 테마 업데이트

### TODO

- [ ] 1-1. `src/routes/layout.css` 컬러 팔레트 변경
- [ ] 1-2. 폰트 사이즈/웨이트 시스템 조정
- [ ] 1-3. 여백 시스템 업데이트 (섹션 간 48-80px)

### 상세

**컬러 변경 (layout.css `@theme` 블록):**

| 현재 변수 | 현재 값 | 변경 값 | 용도 |
|---|---|---|---|
| `--color-basic` | `#303030` | `#1a1a2e` | 기본 텍스트 (더 깊은 네이비 블랙) |
| `--color-hl` | `#1352ED` | `#2c34fc` | 주 강조색 (Dia 네이비) |
| `--color-hl-dark` | `#0D37A1` | `#1e24b0` | 어두운 강조 |
| `--color-hl-light` | `#1464FF` | `#395699` | 밝은 강조 (Dia 블루) |
| `--color-comp` | `#FA4200` | `#e28b33` | 보조 악센트 (Dia 웜 오렌지) |
| 신규 `--color-comp-light` | - | `#f2a25c` | 밝은 웜 악센트 |
| 신규 `--color-cream` | - | `#fcf4c4` | 크림 배경 |
| 신규 `--color-bg` | - | `#faf9f6` | 메인 배경 (약간 웜한 화이트) |

**타이포그래피 변경:**
- 헤딩: 더 대담한 웨이트 (`font-black` → `font-[900]`), 사이즈 유지하되 `letter-spacing: -0.02em` 추가
- 본문: 현재 `1.9rem`/`3.2rem` 유지 (이미 적절)
- 섹션 간 여백: 현재 `py-4` 수준 → `py-12` ~ `py-20`으로 확대

---

## Phase 2: 메인 페이지 리디자인

### TODO

- [ ] 2-1. `src/routes/+page.server.ts` - 최신 글 1개 + 나머지 분리 로딩
- [ ] 2-2. Hero 컴포넌트 신규 작성 (`src/lib/components/Hero/Hero.svelte`)
- [ ] 2-3. `src/lib/components/Post/PostCard.svelte` 리디자인 (카드 그리드 스타일)
- [ ] 2-4. `src/lib/components/Section/Section.svelte` 리디자인 (Past Issues 그리드)
- [ ] 2-5. `src/lib/components/Nav/Nav.svelte` 디자인 세련화
- [ ] 2-6. `src/routes/+page.svelte` 전체 레이아웃 재구성

### 상세

**2-1. 데이터 로딩 변경 (`+page.server.ts`):**
```typescript
// 현재: posts 4개만 반환
// 변경: heroPost (최신 1개) + pastPosts (나머지 5~8개)
return {
  heroPost: posts[0],  // 최신 글 Hero용
  pastPosts: posts.slice(1, 9),  // Past Issues 카드용
};
```

**2-2. Hero 컴포넌트 (`Hero.svelte`):**
- 최신 글 1개를 크게 피처링
- 큰 제목 (4rem~6rem, font-black)
- 메타데이터: 날짜, 태그, 읽기 시간(wordCount 기반)
- 서브 설명 텍스트 (description 필드 활용)
- "Read more →" CTA 링크
- 넉넉한 상하 패딩 (py-16 ~ py-24)

**2-3. PostCard 리디자인:**
- 현재: 리스트 형태 (제목 + 태그 + 날짜, 호버시 배경 변경)
- 변경: 카드 그리드 형태
  - 큰 제목 (2rem, font-bold)
  - 날짜 + 태그 메타데이터
  - description 표시 (있는 경우)
  - 호버시 미세한 lift 효과 (`hover:-translate-y-1 transition`)
  - 하단에 구분선 또는 카드 배경

**2-4. Section 리디자인:**
- "Past Issues" 또는 "최근 글" 헤딩
- 2~3열 그리드 레이아웃 (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`)
- 카드 간 충분한 간격

**2-5. Nav 세련화:**
- 현재 거대한 텍스트 링크 → 더 작고 세련된 카테고리 필터 버튼 스타일
- 또는 Dia 스타일로 섹션 하단에 배치

**2-6. 메인 페이지 구성:**
```
[Header]
[Hero - 최신 글 피처링]
[Past Issues 그리드 - 나머지 글들]
[카테고리 Nav]
[Footer (선택)]
```

---

## Phase 3: 상세 페이지 리디자인

### TODO

- [ ] 3-1. `src/lib/components/Post/PostContent.svelte` - Hero 헤더 영역 리디자인
- [ ] 3-2. 본문 타이포그래피/여백 업데이트
- [ ] 3-3. 이미지 와이드 표시 스타일링
- [ ] 3-4. 하단 "Past Issues" 관련 글 섹션 추가
- [ ] 3-5. 상세 페이지 `[...slug]/+page.server.ts` - 관련 글 데이터 추가
- [ ] 3-6. TOC 스타일 업데이트

### 상세

**3-1. PostContent Hero 영역:**
- 현재: 16rem 초대형 제목 + 기본 메타데이터
- 변경:
  - 제목 사이즈 조정 (4rem~6rem, 더 읽기 좋은 크기)
  - 메타데이터 배치: 날짜 | 태그 | 읽기 시간 (가로 나열)
  - 상단 여백 확대 (Hero 느낌)
  - `letter-spacing: -0.02em` 적용

**3-2. 본문 스타일:**
- `max-w-[1080px]` 유지
- 단락 간 여백 살짝 조정
- 헤딩 앞 여백 확대 (`margin-top: 4rem`)
- blockquote 스타일 변경 (Dia 스타일 - 크림 배경 + 웜 악센트 보더)

**3-3. 와이드 이미지:**
- `.post-content img` 가 본문 폭을 넘어서 표시
- `width: calc(100% + 4rem)`, `margin-left: -2rem` 또는
- 특정 클래스(`.wide`) 부여시 `max-w-[1200px]`까지 확장

**3-4. 하단 관련 글:**
- "다른 글 더 보기" 섹션
- PostCard 3개를 그리드로 표시
- 같은 카테고리 또는 최신 글 기반

**3-5. 관련 글 데이터:**
```typescript
// [...slug]/+page.server.ts에 추가
const allPosts = getAllPosts();
const relatedPosts = allPosts
  .filter(p => p.slug !== slug)
  .slice(0, 3)
  .map(p => ({ slug: p.slug, title: p.title, date: p.date, tags: p.tags, href: generateUrl(...) }));
return { ...postData, relatedPosts };
```

**3-6. TOC 스타일:**
- 현재 빨간색 하이라이트 → 네이비/블루 하이라이트로 변경
- 폰트 사이즈 살짝 조정

---

## Phase 4: 공통 및 선택적 작업

### TODO

- [ ] 4-1. `+layout.svelte` 전체 배경색 적용
- [ ] 4-2. Header 스타일 업데이트 (Dia 스타일 헤더)
- [ ] 4-3. Footer 컴포넌트 추가 (선택)
- [ ] 4-4. 카테고리 리스트 페이지 (`/posts/programming/` 등) 리디자인
- [ ] 4-5. MDX frontmatter에 `description` 필드 활용 확인

### 상세

**4-1. 배경색:**
- `body` 또는 레이아웃에 `bg-[var(--color-bg)]` 적용 (웜 화이트)

**4-2. Header:**
- 현재 스타일 유지하되 컬러 테마에 맞춤
- 블러 배경 유지

**4-4. 카테고리 리스트 페이지:**
- 현재 `Section` + `Nav` 구조
- Past Issues 그리드 스타일 적용 (메인 페이지와 동일한 카드 레이아웃)

**4-5. Description 활용:**
- 이미 `PostMatter`에 `description?: string` 존재
- Hero, PostCard에서 표시
- 없는 글은 본문 첫 문장 자동 추출 또는 빈 상태 허용

---

## 구현 순서 요약

1. **Phase 1** (테마) → 기반 작업, 전체에 영향
2. **Phase 2** (메인) → 가장 눈에 띄는 변화
3. **Phase 3** (상세) → 콘텐츠 읽기 경험 개선
4. **Phase 4** (공통) → 마무리 및 일관성

## 영향받는 파일 목록

| 파일 | 변경 유형 |
|---|---|
| `src/routes/layout.css` | 수정 (컬러, 타이포, 여백) |
| `src/routes/+page.svelte` | 수정 (레이아웃 재구성) |
| `src/routes/+page.server.ts` | 수정 (데이터 구조 변경) |
| `src/lib/components/Hero/Hero.svelte` | **신규** |
| `src/lib/components/Post/PostCard.svelte` | 수정 (카드 스타일) |
| `src/lib/components/Post/PostContent.svelte` | 수정 (Hero + 타이포 + 관련글) |
| `src/lib/components/Section/Section.svelte` | 수정 (그리드 레이아웃) |
| `src/lib/components/Nav/Nav.svelte` | 수정 (디자인 세련화) |
| `src/lib/components/TOC/TOC.svelte` | 수정 (컬러 변경) |
| `src/routes/+layout.svelte` | 수정 (배경색) |
| `src/lib/components/Header/Header.svelte` | 수정 (컬러 맞춤) |
| `src/routes/posts/*/+page.svelte` | 수정 (카드 그리드 적용) |
| `src/routes/posts/*/[...slug]/+page.server.ts` | 수정 (관련글 데이터) |
| `src/routes/posts/*/[...slug]/+page.svelte` | 수정 (관련글 표시) |
