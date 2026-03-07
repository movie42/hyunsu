<script lang="ts">
	import type { Snippet } from 'svelte';
	import TOC from '$lib/components/TOC/TOC.svelte';
	import Giscus from '$lib/components/Giscus/Giscus.svelte';

	interface Props {
		title: string;
		date: string;
		tags: string[];
		children: Snippet;
	}
	let { title, date, tags, children }: Props = $props();
</script>

<div class="post-container px-[1.2rem] sm:px-8 max-w-[1080px] mx-auto">
	<TOC />
	<div>
		<div class="flex gap-[1.4rem]">
			{#each tags as tag}
				<span class="text-[1.6rem]">{tag}</span>
			{/each}
		</div>
		<span class="text-[1.6rem]">{date}</span>
		<a href="/" class="block text-hl text-[1.6rem] mt-2">뒤로가기</a>
	</div>
	<h1 class="text-hl font-black text-[16rem] max-[450px]:text-[4rem]" style="word-break: keep-all;">{title}</h1>
	<div class="post-content py-16">
		{@render children()}
		<Giscus />
	</div>
</div>

<style>
	:global(.post-content h1) {
		color: var(--color-hl);
		font-size: 4.2rem;
		font-weight: 800;
		word-spacing: -2px;
		margin: 2rem 0;
	}
	:global(.post-content h2) {
		font-size: 3.5rem;
		font-weight: 700;
		word-spacing: -2px;
		margin: 2rem 0;
	}
	:global(.post-content h3) {
		font-size: 3rem;
		font-weight: 700;
		word-spacing: -2px;
		margin: 2rem 0;
	}
	:global(.post-content h4) {
		font-size: 2.5rem;
		font-weight: 700;
		word-spacing: -2px;
		margin: 2rem 0;
	}
	:global(.post-content a) {
		display: block;
		color: var(--color-hl);
	}
	:global(.post-content p) {
		font-size: 1.9rem;
		line-height: 3.2rem;
		word-spacing: -2px;
		padding-bottom: 3rem;
	}
	:global(.post-content p a) {
		display: inline;
		color: var(--color-hl);
	}
	:global(.post-content p code) {
		color: var(--color-hl-light);
		background-color: var(--color-gray-light);
		padding: 0.4rem;
		border-radius: 0.5rem;
	}
	:global(.post-content img) {
		width: 100%;
		max-width: 1020px;
	}
	:global(.post-content ol) {
		margin-left: 2.2rem;
	}
	:global(.post-content ol li) {
		list-style: auto;
	}
	:global(.post-content ol li ul) {
		margin: 0;
		margin-left: 1.2rem;
	}
	:global(.post-content ol li ul li) {
		list-style: disc;
		padding-left: 2rem;
	}
	:global(.post-content ul),
	:global(.post-content ol) {
		margin-bottom: 3rem;
	}
	:global(.post-content ul li),
	:global(.post-content ol li) {
		font-size: 1.8rem;
		line-height: 3rem;
	}
	:global(.post-content ul li ul li),
	:global(.post-content ul li ol li),
	:global(.post-content ol li ul li),
	:global(.post-content ol li ol li) {
		padding-left: 1rem;
	}
	:global(.post-content blockquote) {
		position: relative;
		word-break: keep-all;
		margin: 3rem 1.2rem;
		padding: 1rem 4rem;
		border-radius: 0.2rem;
		background-color: var(--color-gray-light);
	}
	:global(.post-content blockquote p) {
		margin: 0;
		padding: 0;
	}
	:global(.post-content blockquote::after) {
		position: absolute;
		top: 0;
		left: 0;
		width: 0.8rem;
		height: 100%;
		background-color: var(--color-hl-light);
		content: '';
	}
	:global(.post-content p + blockquote) {
		margin-top: 0;
	}
	:global(.post-content code) {
		font-size: 1.6rem;
		letter-spacing: -0.01rem;
	}
	:global(.post-content .embeded-video) {
		width: 100%;
		margin: 0 auto;
		aspect-ratio: 16 / 9;
	}
	:global(.post-content .embeded-video iframe) {
		width: 100%;
		height: 100%;
	}

	@media (max-width: 450px) {
		:global(.post-content h1) { font-size: 3.8rem; line-height: 1.2; }
		:global(.post-content h2) { font-size: 3.4rem; line-height: 1.2; }
		:global(.post-content h3) { font-size: 3rem; line-height: 1.2; }
		:global(.post-content h4) { font-size: 2.4rem; line-height: 1.2; }
		:global(.post-content h5) { font-size: 1.8rem; line-height: 1.2; }
	}
</style>
