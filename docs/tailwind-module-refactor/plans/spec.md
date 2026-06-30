# Tailwind 인라인 클래스 CSS Module화 - 명세

## 화면/기능 흐름

- 컴포넌트 렌더링: React 컴포넌트가 렌더링됨 → 마크업의 `className`은 Tailwind 유틸리티 문자열이 아니라 `styles.*` 기반 의미 클래스명을 사용한다.
- CSS 적용: 각 컴포넌트/페이지가 자신의 `*.module.css`를 import함 → 기존과 동일한 레이아웃, 색상, 타이포그래피, hover/active 상태가 유지된다.
- MDX 본문 렌더링: 글 상세 페이지에서 MDX 콘텐츠가 렌더링됨 → 전역 본문 스타일은 유지되어 기존 markdown typography가 깨지지 않는다.
- 탭 인터랙션: 탭 버튼 클릭 → 활성 버튼 스타일과 코드 블록 표시/숨김 동작이 기존과 동일하게 유지된다.
- 목차 인터랙션: 스크롤로 현재 heading이 변경됨 → TOC 링크의 활성/비활성 스타일이 CSS Module 클래스 조합으로 반영된다.

## 상태 정의

| 상태 | 설명 |
| --- | --- |
| 기본 | 페이지/컴포넌트가 기존 디자인과 동일하게 표시되는 상태 |
| Hover | Header/Nav/PostCard/홈 hero/404 링크 등 상호작용 요소에 마우스를 올린 상태 |
| Active | TOC 현재 항목 또는 Tabs 현재 탭이 선택된 상태 |
| Responsive | `sm`, `md`, `lg`, `max-[1400px]` 등 기존 반응형 Tailwind 동작이 CSS Module에서도 동일하게 적용되는 상태 |
| Toast | PostContent에서 코드 복사 등으로 토스트 메시지가 표시되는 상태 |

## 엣지 케이스

- MDX 콘텐츠 내부 예제 코드의 `className`: 실제 UI 스타일이 아닌 글 내용이면 수정하지 않는다.
- 전역 셀렉터 의존 스타일: `.post-content`처럼 렌더링된 MDX HTML 하위 요소를 스타일링하는 규칙은 무리하게 module로 고립하지 않고 전역 스타일로 유지한다.
- CSS Module과 전역 클래스 연결: 기존 JS 로직이 문자열 클래스명으로 DOM을 찾는 경우 `styles.*` 참조 또는 `data-*` 속성 기반으로 안전하게 변경한다.
- Tailwind 임의값: `z-[1050]`, `backdrop-blur-[20px]`, `right-[calc(...)]`, `shadow-[...]` 같은 임의값은 CSS Module의 `@apply`가 실패할 수 있으면 일반 CSS 속성으로 치환한다.
- 조건부 클래스: 문자열 템플릿에 Tailwind 유틸리티를 직접 넣지 않고 CSS Module 클래스 조합으로 표현한다.
- 빌드 호환성: CSS Module에서 Tailwind `@apply` 사용이 제한되는 경우 일반 CSS 속성으로 대체해 빌드가 통과하도록 한다.
