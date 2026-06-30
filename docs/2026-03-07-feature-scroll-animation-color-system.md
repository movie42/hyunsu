# 스크롤 애니메이션 + Dia 컬러 시스템 정밀 적용

> 현재 브랜치: `feature/blog-redesign-dia-style`
> 기존 계획 `2026-03-07-feature-blog-redesign-dia-style.md`의 후속 작업

---

## Phase A: Dia 컬러 시스템 정밀 적용

### TODO

- [x] A-1. `layout.css` 컬러 변수 정밀 조정
- [x] A-2. 컴포넌트별 컬러 매핑 업데이트

### 상세

**현재 vs Dia 실제 컬러 비교:**

| 용도 | 현재 값 | Dia 실제 값 | 변경 |
|------|---------|-------------|------|
| 배경 (`--color-bg`) | `#faf9f6` | `#faf9f6` | 유지 (이미 일치) |
| 기본 텍스트 (`--color-basic`) | `#1a1a2e` | `#40362e` (웜 차콜) | 변경 |
| 보조 텍스트 | `#999` (하드코딩) | `#8f775d` (웜 브라운) | 변경 |
| 메인 강조 (`--color-hl`) | `#2c34fc` | `#2c34fc` | 유지 (일치) |
| 서브 컬러 (`--color-sub`) | `#607caa` | `#607caa` | 유지 (일치) |
| 웜 악센트 (`--color-comp`) | `#e28b33` | `#f2a25c` | 미세 조정 |
| 크림 (`--color-cream`) | `#fcf4c4` | `#fcf8f1` (더 연한 크림) | 변경 |
| 카드 보더 | `#e5e5e5` (하드코딩) | `rgba(0,0,0,0.06)` | 변경 |
| 구분선 | `rgba(0,0,0,0.08~0.1)` | `rgba(0,0,0,0.06)` | 미세 조정 |
| 다크 배경 (푸터 등) | 없음 | `#1c2c67` (딥 네이비) | 신규 추가 |

**컬러 변수 추가/변경 (`layout.css`):**
```css
@theme {
  --color-basic: #40362e;         /* 웜 차콜 (Dia 본문) */
  --color-basic-dark: #1a1a2e;    /* 딥 네이비 (강조 헤딩) */
  --color-muted: #8f775d;         /* 웜 브라운 (보조 텍스트) */
  --color-cream: #fcf8f1;         /* 연한 크림 (Dia 배경) */
  --color-comp: #f2a25c;          /* 웜 오렌지 (Dia 악센트) */
  --color-border: rgba(0,0,0,0.06); /* 보더/구분선 */
  --color-dark-bg: #1c2c67;       /* 딥 네이비 배경 */
}
```

**컴포넌트 하드코딩 색상 → 변수로 교체:**
- `PostContent.svelte`: `#999` → `var(--color-muted)`, `#1a1a1a` → `var(--color-basic)`
- `PostCard.svelte`: `#666` → `var(--color-muted)`, `#999` → `var(--color-muted)`
- `Section.svelte`: `#e5e5e5` → `var(--color-border)`
- `Hero.svelte`: `#666` → `var(--color-muted)`

---

## Phase B: 스크롤 애니메이션 구현

### TODO

- [x] B-1. `src/lib/actions/reveal.ts` — Svelte action 생성 (IntersectionObserver 기반)
- [x] B-2. `layout.css` — 애니메이션 CSS 클래스 추가
- [x] B-3. `Hero.svelte` — 페이지 로드 시 순차 fade-in 적용
- [x] B-4. `Section.svelte` + `PostCard.svelte` — 스크롤 시 staggered fade-in
- [x] B-5. `PostContent.svelte` — 상세 페이지 제목/관련글 fade-in

### 상세

**B-1. Svelte Action (`use:reveal`)**

```typescript
// src/lib/actions/reveal.ts
export function reveal(node: HTMLElement, options?: { delay?: number; threshold?: number }) {
  const { delay = 0, threshold = 0.15 } = options ?? {};

  node.style.opacity = '0';
  node.style.transform = 'translateY(24px)';
  node.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        node.style.opacity = '1';
        node.style.transform = 'translateY(0)';
        observer.unobserve(node);
      }
    },
    { threshold }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    }
  };
}
```

**B-2. 애니메이션 CSS (layout.css에 추가)**

```css
/* 페이지 로드 시 fade-in (Hero용) */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease forwards;
}

/* 딜레이 유틸리티 */
.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
.delay-400 { animation-delay: 400ms; }
```

**B-3. Hero 적용 예시:**
```svelte
<!-- 메타 → 제목 → 설명 → CTA 순차 등장 -->
<div class="animate-fade-in-up">메타데이터</div>
<h1 class="animate-fade-in-up delay-100">제목</h1>
<p class="animate-fade-in-up delay-200">설명</p>
<span class="animate-fade-in-up delay-300">Read more →</span>
```

**B-4. 카드 Staggered 적용 예시:**
```svelte
{#each posts as post, i}
  <li use:reveal={{ delay: i * 100 }}>
    <PostCard ... />
  </li>
{/each}
```

**B-5. 상세 페이지:**
- 제목 영역: CSS `animate-fade-in-up`
- 관련 글 섹션: `use:reveal` 로 스크롤 시 등장

---

## 영향받는 파일

| 파일 | 변경 유형 |
|------|-----------|
| `src/routes/layout.css` | 수정 (컬러 변수 + 애니메이션 CSS) |
| `src/lib/actions/reveal.ts` | **신규** (스크롤 reveal action) |
| `src/lib/components/Hero/Hero.svelte` | 수정 (컬러 + 로드 애니메이션) |
| `src/lib/components/Post/PostCard.svelte` | 수정 (컬러 변수화) |
| `src/lib/components/Section/Section.svelte` | 수정 (컬러 + staggered reveal) |
| `src/lib/components/Post/PostContent.svelte` | 수정 (컬러 + 애니메이션) |

## 구현 순서

1. Phase A (컬러) → Phase B (애니메이션) 순서로 진행
2. 각 Phase 완료 시 커밋
