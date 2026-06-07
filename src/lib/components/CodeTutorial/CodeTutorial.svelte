<script module lang="ts">
	import { createHighlighter } from 'shiki';

	const highlighterPromise = createHighlighter({
		themes: ['github-light', 'github-dark'],
		langs: [
			'javascript',
			'typescript',
			'html',
			'css',
			'json',
			'bash',
			'shell',
			'markdown',
			'yaml',
			'jsx',
			'tsx',
			'svelte',
			'python',
			'go',
			'rust',
			'sql',
			'diff',
			'text'
		]
	});
</script>

<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { ShikiMagicMove } from 'shiki-magic-move/svelte';
	import 'shiki-magic-move/dist/style.css';

	type TutorialMode = 'tabs' | 'scroll';

	type LineHighlight = number | [number, number] | { start: number; end?: number };

	export type CodeTutorialStep = {
		title?: string;
		description?: string;
		code: string;
		lang?: string;
		filename?: string;
		/** 1-based line numbers or ranges to emphasize for this step. */
		highlightLines?: LineHighlight[];
	};

	interface Props {
		steps: CodeTutorialStep[];
		mode?: TutorialMode;
		lang?: string;
		theme?: 'github-light' | 'github-dark';
		initialStep?: number;
		stickyOffset?: number;
		lineNumbers?: boolean;
	}

	let {
		steps,
		mode = 'tabs',
		lang = 'typescript',
		theme = 'github-light',
		initialStep = 0,
		stickyOffset = 128,
		lineNumbers = true
	}: Props = $props();

	let activeStep = $state(0);
	let initialStepApplied = $state(false);
	let root: HTMLElement;

	$effect(() => {
		if (!initialStepApplied) {
			activeStep = Math.min(Math.max(initialStep, 0), Math.max(steps.length - 1, 0));
			initialStepApplied = true;
		}

		if (activeStep >= steps.length) activeStep = Math.max(steps.length - 1, 0);
	});
	let codePanel: HTMLElement;

	const active = $derived(steps[activeStep] ?? steps[0]);
	const activeCode = $derived(active?.code ?? '');
	const activeLang = $derived(active?.lang ?? lang);
	const activeHighlightLayers = $derived(formatHighlightLayers(active?.highlightLines));

	function normalizeHighlightLines(highlightLines: LineHighlight[] = []) {
		return highlightLines
			.map((highlight) => {
				if (typeof highlight === 'number') return { start: highlight, end: highlight };
				if (Array.isArray(highlight)) return { start: highlight[0], end: highlight[1] };
				return { start: highlight.start, end: highlight.end ?? highlight.start };
			})
			.map(({ start, end }) => ({ start: Math.max(1, start), end: Math.max(start, end) }))
			.filter(({ start, end }) => Number.isFinite(start) && Number.isFinite(end));
	}

	function formatHighlightLayers(highlightLines: LineHighlight[] = []) {
		const paddingTop = 1.8;
		const lineHeight = 2.45;
		const color = 'rgba(255, 209, 102, 0.24)';

		return normalizeHighlightLines(highlightLines)
			.map(({ start, end }) => {
				const from = paddingTop + (start - 1) * lineHeight;
				const to = paddingTop + end * lineHeight;
				return `linear-gradient(to bottom, transparent ${from}rem, ${color} ${from}rem, ${color} ${to}rem, transparent ${to}rem)`;
			})
			.join(', ');
	}

	function selectStep(index: number) {
		activeStep = index;
	}

	onMount(() => {
		if (mode !== 'scroll') return;

		let cleanup = () => {};
		let cancelled = false;

		async function setupScrollTrigger() {
			await tick();
			if (cancelled || !root) return;

			const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
				import('gsap'),
				import('gsap/ScrollTrigger')
			]);

			if (cancelled) return;

			gsap.registerPlugin(ScrollTrigger);

			const triggers = Array.from(root.querySelectorAll<HTMLElement>('[data-code-step]')).map(
				(el, index) =>
					ScrollTrigger.create({
						trigger: el,
						start: 'top center',
						end: 'bottom center',
						onEnter: () => selectStep(index),
						onEnterBack: () => selectStep(index)
					})
			);

			cleanup = () => triggers.forEach((trigger) => trigger.kill());
		}

		setupScrollTrigger();

		return () => {
			cancelled = true;
			cleanup();
		};
	});
</script>

<div bind:this={root} class="code-tutorial" class:scroll-mode={mode === 'scroll'}>
	<section class="code-area" style={`--sticky-offset: ${stickyOffset}px`} bind:this={codePanel}>
		<div class="code-meta">
			<span>{active?.filename ?? active?.title ?? 'example'}</span>
			<span>{activeLang}</span>
		</div>

		{#await highlighterPromise}
			<pre class="fallback"><code>{activeCode}</code></pre>
		{:then highlighter}
			<div
				class="code-frame"
				class:has-highlights={activeHighlightLayers.length > 0}
				style={`--code-highlight-layers: ${activeHighlightLayers || 'none'}`}
			>
				<ShikiMagicMove
					code={activeCode}
					lang={activeLang}
					{theme}
					{highlighter}
					options={{
						duration: 760,
						easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
						stagger: 0.08,
						delayMove: 0.12,
						delayEnter: 0.45,
						delayContainer: 0.2,
						lineNumbers,
						splitTokens: true,
						enhanceMatching: true
					}}
				/>
			</div>
		{:catch error}
			<pre class="fallback"><code>{activeCode}</code></pre>
		{/await}
	</section>

	{#if mode === 'tabs'}
		<div class="tabs" role="tablist" aria-label="Code tutorial steps">
			{#each steps as step, index}
				<button
					type="button"
					role="tab"
					aria-selected={activeStep === index}
					class:active={activeStep === index}
					onclick={() => selectStep(index)}
				>
					<span>{index + 1}</span>
					{step.title ?? `Step ${index + 1}`}
				</button>
			{/each}
		</div>

		{#if active?.description}
			<p class="step-description">{active.description}</p>
		{/if}
	{:else}
		<div class="steps">
			{#each steps as step, index}
				<article data-code-step class:active={activeStep === index}>
					<p class="step-index">STEP {index + 1}</p>
					<h3>{step.title ?? `Step ${index + 1}`}</h3>
					{#if step.description}
						<p>{step.description}</p>
					{/if}
				</article>
			{/each}
		</div>
	{/if}
</div>

<style>
	.code-tutorial {
		margin: 3.2rem 0;
		border: 1px solid rgba(64, 54, 46, 0.12);
		border-radius: 1.8rem;
		background: color-mix(in srgb, var(--color-cream) 82%, white);
		box-shadow: 0 18px 50px rgba(64, 54, 46, 0.08);
		overflow: clip;
	}

	.code-area {
		background: #ffffff;
		border-bottom: 1px solid rgba(64, 54, 46, 0.1);
	}

	.scroll-mode {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(24rem, 0.9fr);
		gap: 0;
		align-items: start;
	}

	.scroll-mode .code-area {
		position: sticky;
		top: var(--sticky-offset);
		border-right: 1px solid rgba(64, 54, 46, 0.1);
		border-bottom: 0;
	}

	.code-meta {
		display: flex;
		justify-content: space-between;
		gap: 1.6rem;
		padding: 1.2rem 1.6rem;
		border-bottom: 1px solid rgba(64, 54, 46, 0.08);
		color: var(--color-muted);
		font-size: 1.3rem;
		font-weight: 700;
	}

	.code-frame {
		--code-highlight-layers: none;
	}

	:global(.shiki-magic-move-container) {
		margin: 0 !important;
		padding: 1.8rem !important;
		background-color: #ffffff !important;
		font-size: 1.4rem;
		line-height: 1.75;
		overflow-x: auto;
	}

	.code-frame.has-highlights :global(.shiki-magic-move-container) {
		background-image: var(--code-highlight-layers) !important;
		background-repeat: no-repeat;
		transition: background-image 220ms ease;
	}

	:global(.shiki-magic-move-enter-from) {
		transform: translateY(0.35em) scale(0.98);
	}

	:global(.shiki-magic-move-leave-to) {
		transform: translateY(-0.25em) scale(0.98);
	}

	:global(.shiki-magic-move-move) {
		will-change: transform;
	}

	.fallback {
		padding: 1.8rem;
		font-size: 1.4rem;
		line-height: 1.75;
		overflow-x: auto;
	}

	.tabs {
		display: flex;
		gap: 0.8rem;
		padding: 1.4rem;
		overflow-x: auto;
	}

	.tabs button {
		display: inline-flex;
		align-items: center;
		gap: 0.7rem;
		border: 1px solid rgba(64, 54, 46, 0.12);
		border-radius: 999px;
		padding: 0.8rem 1.2rem;
		background: white;
		color: var(--color-basic);
		font-size: 1.35rem;
		font-weight: 700;
		cursor: pointer;
		white-space: nowrap;
		transition: 160ms ease;
	}

	.tabs button span {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		background: var(--color-cream);
		font-size: 1.15rem;
	}

	.tabs button:hover,
	.tabs button.active {
		border-color: var(--color-hl-light);
		background: var(--color-hl-light);
		color: white;
		transform: translateY(-1px);
	}

	.step-description {
		padding: 0 1.8rem 1.8rem;
		color: var(--color-basic);
		font-size: 1.55rem;
		line-height: 1.8;
	}

	.steps {
		padding: 1.6rem;
	}

	.steps article {
		min-height: 42vh;
		padding: 2rem;
		border-left: 3px solid rgba(64, 54, 46, 0.14);
		color: var(--color-muted);
		transition: 180ms ease;
	}

	.steps article.active {
		border-left-color: var(--color-hl-light);
		color: var(--color-basic);
		background: rgba(255, 255, 255, 0.64);
	}

	.step-index {
		margin-bottom: 0.8rem;
		color: var(--color-hl-light);
		font-size: 1.2rem;
		font-weight: 900;
		letter-spacing: 0.08em;
	}

	.steps h3 {
		margin-bottom: 0.8rem;
		font-size: 2rem;
	}

	.steps p {
		font-size: 1.55rem;
		line-height: 1.85;
	}

	@media (max-width: 820px) {
		.scroll-mode {
			display: block;
		}

		.scroll-mode .code-area {
			position: relative;
			top: auto;
			border-right: 0;
			border-bottom: 1px solid rgba(64, 54, 46, 0.1);
		}

		.steps article {
			min-height: auto;
		}
	}
</style>
