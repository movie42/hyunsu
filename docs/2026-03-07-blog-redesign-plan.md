# 블로그 리디자인 계획 - Dia Browser 스타일 적용

> 참고 URL
> - 메인 페이지: https://www.diabrowser.com/release-notes/latest
> - 상세 페이지: https://www.diabrowser.com/release-notes/1-20-0-little-moments-big-feeling

## 현재 블로그 vs Dia Browser 디자인 비교

| | 현재 블로그 | Dia 메인 | Dia 상세 |
|---|---|---|---|
| **레이아웃** | 단순 포스트 리스트 + 카테고리 Nav | Hero 섹션 + 최신 글 하이라이트 + Past Issues 카드 그리드 | 대형 헤드라인 + 메타데이터 + 모듈형 콘텐츠 블록 |
| **타이포그래피** | 기본적 | 대담한 헤딩, 넉넉한 여백 | 에디토리얼 스타일, 강조 텍스트 |
| **비주얼** | 텍스트 위주 | 큰 썸네일 카드, 비디오 | 와이드 이미지/비디오, 교차 레이아웃 |
| **컬러** | 블루/화이트 | 네이비, 크림, 웜 악센트 | 뉴트럴 + 블루/오렌지 악센트 |

## 구현 방안

### 1. 메인 페이지 (`src/app/page.tsx`)

현재는 `Section` + `Nav`만 있는 단순 구조. Dia 스타일로 바꾸려면:

- **Hero 섹션**: 최신 글 1개를 크게 피처링 (큰 제목 + 날짜/메타데이터 + 대표 이미지)
- **Past Issues 그리드**: 나머지 글들을 썸네일 카드 형태로 표시 (이미지 + 제목 + 날짜)
- **카테고리 Nav**: 유지하되 디자인 세련화

**필요 작업:**
- MDX frontmatter에 `thumbnail` 필드 추가 (대표 이미지)
- Hero 컴포넌트 새로 작성
- PostCard 컴포넌트 리디자인 (큰 썸네일 + 메타데이터)
- 전체 컬러/타이포그래피 테마 업데이트

### 2. 상세 페이지 (`DynamicPostContent`)

현재는 TOC 사이드바 + 본문 + 댓글 구조. Dia 스타일로 바꾸려면:

- **Hero 영역**: 큰 제목 + 메타데이터 (날짜, 태그, 읽기 시간)
- **본문**: 더 넓은 max-width, 에디토리얼 타이포그래피, 이미지는 와이드하게
- **Past Issues 섹션**: 하단에 관련 글 / 이전 글 카드 추가
- **TOC**: 현재 사이드바 방식 유지 or 상단 고정 방식으로 변경

**필요 작업:**
- PostHeader 컴포넌트 리디자인 (큰 헤드라인 스타일)
- 본문 타이포그래피/여백 리스타일링 (`PostContainer` 수정)
- 하단 관련 글 카드 섹션 추가
- 이미지가 본문 폭을 넘어 와이드하게 표시되는 스타일링

### 3. 공통 작업

- **테마 컬러 업데이트**: 네이비/크림/웜 악센트 팔레트로
- **폰트 조정**: 헤딩에 더 대담한 사이즈와 웨이트
- **여백 시스템**: 섹션 간 더 넉넉한 스페이싱 (48-80px)
- **framer-motion 활용**: 이미 의존성에 있으므로 스크롤 애니메이션 추가 가능

### 4. 선택적 확장

- MDX에 `description` (서브헤딩), `thumbnail` 필드 추가
- OG 이미지 자동 생성
- 다크모드 대응

---

## Dia Browser 디자인 상세 분석

### 메인 페이지 (release-notes/latest)

**헤더**: Dia 로고(좌) + 네비게이션 + "Download Dia" CTA 버튼(우). 상단 배너 메시지 포함.

**Hero/타이틀 섹션**: 큰 헤딩("Dia gets there first") + 서브헤딩 설명 텍스트 + 릴리즈 메타데이터(날짜, 위치, 이슈 번호, 앱 버전).

**피처 쇼케이스**: 와이드 비디오/이미지 에셋 + 교차 컬럼 레이아웃으로 아이템 나열. 각 아이템에 팀 멤버 사진(192x192px), 이름, 인용문 포함.

**Past Issues 섹션**: 이전 릴리즈 3개를 큰 썸네일 카드로 표시 + "View All Release Notes +" 링크.

**푸터**: 5개 컬럼 그룹(Product, Resources, Company, Connect) + 상태 라인 + 크레딧.

**컬러**: 네이비(#2c34fc), 블루(#395699), 웜 악센트(#e28b33, #f2a25c), 크림(#fcf4c4).

**타이포**: 산세리프, 헤딩 28-32px 볼드, 본문 16px, 라인하이트 1.5, 섹션 간 여백 24-48px.

### 상세 페이지 (release-notes/1-20-0)

**Hero**: "Little moments. Big feeling." 대형 헤드라인 + 메타데이터(날짜, 위치, 이슈 번호, 버전).

**콘텐츠 구조** (모듈형):
- Release Note Header: 주제 소개
- Text Blocks: 피처 설명 (제목 + 본문)
- Wide Asset Sections: 비디오/이미지 (Mux 플레이어, 1024x539 비율, 오토플레이)
- Note Blocks: 보충 설명 + 작은 비디오 에셋
- List Items: 그룹 피처, 세로 비디오, reverse-column 레이아웃 옵션

**Past Issues 섹션**: 하단에 이전 3개 릴리즈 카드 (날짜, 이슈번호, 버전, 제목, 썸네일).

**컬러**: 블루(#607caa), 오렌지(#f2a25c), 옐로우(#fcdc71).

---

## 현재 블로그 기술 스택

- **프레임워크**: Next.js 13.4.3 (App Router)
- **스타일링**: styled-components 6.0.0-rc.2
- **콘텐츠**: MDX + gray-matter + next-mdx-remote
- **애니메이션**: framer-motion 11.3.8
- **아이콘**: react-feather, @radix-ui/react-icons
- **댓글**: Giscus (GitHub Discussions)
- **코드 하이라이팅**: Bright 0.8.2

### 주요 파일 경로

- 메인 페이지: `src/app/page.tsx`
- 상세 페이지: `src/app/posts/programming/[slug]/page.tsx`
- 포스트 렌더러: `src/app/components/Content/DynamicPostContent`
- 포스트 카드: `src/app/components/Post/`
- 테마: `src/app/styles/theme.ts`
- 글로벌 스타일: `src/app/styles/globalStyle.ts`
- MDX 컴포넌트: `src/app/mdxComponets.tsx`
- TOC: `src/app/components/TOC/`
