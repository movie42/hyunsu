<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}
	let { children }: Props = $props();

	let container: HTMLDivElement;
	let tabs: { title: string; el: HTMLElement }[] = $state([]);
	let activeIndex = $state(0);

	function extractTitle(pre: HTMLElement): string {
		const firstLine = pre.querySelector('.line');
		if (!firstLine) return 'Code';
		const text = firstLine.textContent || '';
		const match = text.match(/^(?:\/\/|#)\s*title\s+(.+)/);
		if (match) {
			firstLine.remove();
			return match[1].trim();
		}
		return 'Code';
	}

	$effect(() => {
		if (!container) return;
		const pres = Array.from(container.querySelectorAll(':scope > pre, :scope > :not(.tabs-header) pre'));
		const seen = new Set<HTMLElement>();
		const result: { title: string; el: HTMLElement }[] = [];
		for (const pre of pres) {
			if (seen.has(pre as HTMLElement)) continue;
			seen.add(pre as HTMLElement);
			const wrapper = pre.closest('.tabs-content') ? pre : pre;
			result.push({ title: extractTitle(pre as HTMLElement), el: pre as HTMLElement });
		}
		tabs = result;
		if (result.length > 0) {
			updateVisibility(0);
		}
	});

	function updateVisibility(index: number) {
		activeIndex = index;
		for (let i = 0; i < tabs.length; i++) {
			tabs[i].el.style.display = i === index ? '' : 'none';
		}
	}
</script>

<div class="tabs-container" bind:this={container}>
	{#if tabs.length > 0}
		<div class="tabs-header">
			{#each tabs as tab, i}
				<button
					class="tab-button"
					class:active={activeIndex === i}
					onclick={() => updateVisibility(i)}
				>
					{tab.title}
				</button>
			{/each}
		</div>
	{/if}
	<div class="tabs-content">
		{@render children()}
	</div>
</div>

<style>
	.tabs-container {
		margin-bottom: 3rem;
	}
	.tabs-header {
		display: flex;
		gap: 0;
		border-bottom: 2px solid var(--color-gray-dark);
	}
	.tab-button {
		padding: 0.8rem 1.6rem;
		font-size: 1.4rem;
		font-weight: 600;
		border: none;
		background: transparent;
		cursor: pointer;
		color: var(--color-basic);
		border-bottom: 2px solid transparent;
		margin-bottom: -2px;
		transition: all 0.15s;
	}
	.tab-button:hover {
		color: var(--color-hl);
	}
	.tab-button.active {
		color: var(--color-hl);
		border-bottom-color: var(--color-hl);
	}
	.tabs-content :global(pre) {
		border-radius: 0 0 0.8rem 0.8rem !important;
		margin-bottom: 0 !important;
	}
</style>
