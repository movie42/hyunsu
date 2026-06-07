<script lang="ts">
	import CodeTutorial from './CodeTutorial.svelte';
	import type { CodeTutorialStep } from './CodeTutorial.svelte';

	const openScript = '<script>';
	const closeScript = '</' + 'script>';

	const tabSteps: CodeTutorialStep[] = [
		{
			title: '일반 변수',
			description: '처음에는 단순한 변수로 count 값을 선언합니다.',
			filename: 'counter.ts',
			lang: 'ts',
			highlightLines: [1],
			code: ['const count = 0;', '', 'console.log(count);'].join('\n')
		},
		{
			title: 'Svelte 상태',
			description: 'Svelte 5의 $state rune으로 반응형 상태를 만듭니다.',
			filename: 'Counter.svelte',
			lang: 'svelte',
			highlightLines: [2, 5],
			code: [openScript, '\tlet count = $state(0);', closeScript, '', '<p>{count}</p>'].join('\n')
		},
		{
			title: '클릭 이벤트',
			description: '버튼을 누르면 count가 증가하도록 이벤트를 연결합니다.',
			filename: 'Counter.svelte',
			lang: 'svelte',
			highlightLines: [[5, 7]],
			code: [
				openScript,
				'\tlet count = $state(0);',
				closeScript,
				'',
				'<button onclick={() => count++}>',
				'\tcount: {count}',
				'</button>'
			].join('\n')
		}
	];

	const reactSteps: CodeTutorialStep[] = [
		{
			title: '컴포넌트 분리',
			description: 'React 컴포넌트 예시도 tsx/jsx 언어로 그대로 표시할 수 있습니다.',
			filename: 'Counter.tsx',
			lang: 'tsx',
			highlightLines: [2],
			code: `export function Counter() {
	return <button>count: 0</button>;
}`
		},
		{
			title: '상태 추가',
			description: 'useState를 추가하면 변경된 코드가 자연스럽게 애니메이션됩니다.',
			filename: 'Counter.tsx',
			lang: 'tsx',
			highlightLines: [1, 4, 6],
			code: `import { useState } from 'react';

export function Counter() {
	const [count, setCount] = useState(0);

	return <button>count: {count}</button>;
}`
		},
		{
			title: '이벤트 연결',
			description: '클릭 핸들러까지 추가한 최종 형태입니다.',
			filename: 'Counter.tsx',
			lang: 'tsx',
			highlightLines: [{ start: 7, end: 9 }],
			code: `import { useState } from 'react';

export function Counter() {
	const [count, setCount] = useState(0);

	return (
		<button onClick={() => setCount(count + 1)}>
			count: {count}
		</button>
	);
}`
		}
	];

	const scrollSteps: CodeTutorialStep[] = [
		{
			title: 'HTML 구조 작성',
			description: '먼저 카드의 의미 있는 마크업을 작성합니다.',
			filename: 'Card.svelte',
			lang: 'svelte',
			highlightLines: [[1, 4]],
			code: [
				'<article class="card">',
				'\t<h2>오늘의 메모</h2>',
				'\t<p>MDX 안에서 움직이는 코드 예제를 만들 수 있습니다.</p>',
				'</article>'
			].join('\n')
		},
		{
			title: '기본 스타일 추가',
			description: '카드가 글 본문 안에서 자연스럽게 보이도록 여백과 테두리를 추가합니다.',
			filename: 'Card.svelte',
			lang: 'svelte',
			highlightLines: [[6, 12]],
			code: [
				'<article class="card">',
				'\t<h2>오늘의 메모</h2>',
				'\t<p>MDX 안에서 움직이는 코드 예제를 만들 수 있습니다.</p>',
				'</article>',
				'',
				'<style>',
				'\t.card {',
				'\t\tpadding: 1.6rem;',
				'\t\tborder: 1px solid #e5e7eb;',
				'\t\tborder-radius: 1rem;',
				'\t}',
				'</style>'
			].join('\n')
		},
		{
			title: '상호작용 추가',
			description: '상태를 추가해서 버튼 클릭으로 내용을 바꿉니다. 스크롤 위치에 따라 왼쪽 코드가 변경됩니다.',
			filename: 'Card.svelte',
			lang: 'svelte',
			highlightLines: [2, [8, 10]],
			code: [
				openScript,
				'\tlet liked = $state(false);',
				closeScript,
				'',
				'<article class="card">',
				'\t<h2>오늘의 메모</h2>',
				'\t<p>MDX 안에서 움직이는 코드 예제를 만들 수 있습니다.</p>',
				'\t<button onclick={() => liked = !liked}>',
				"\t\t{liked ? '좋아요 취소' : '좋아요'}",
				'\t</button>',
				'</article>',
				'',
				'<style>',
				'\t.card {',
				'\t\tpadding: 1.6rem;',
				'\t\tborder: 1px solid #e5e7eb;',
				'\t\tborder-radius: 1rem;',
				'\t}',
				'</style>'
			].join('\n')
		}
	];
</script>

<h2>탭 방식 데모</h2>
<CodeTutorial steps={tabSteps} mode="tabs" />

<h2>React 예시</h2>
<CodeTutorial steps={reactSteps} mode="tabs" lang="tsx" />

<h2>스크롤 방식 데모</h2>
<CodeTutorial steps={scrollSteps} mode="scroll" stickyOffset={128} />
