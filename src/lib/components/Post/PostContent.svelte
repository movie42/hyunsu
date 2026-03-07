<script lang="ts">
	import type { Snippet } from 'svelte';
	import TOC from '$lib/components/TOC/TOC.svelte';
	import Giscus from '$lib/components/Giscus/Giscus.svelte';
	import PostCard from '$lib/components/Post/PostCard.svelte';

	interface RelatedPost {
		slug: string;
		title: string;
		date: string;
		tags: string[];
		description: string;
		href: string;
	}
	interface Props {
		title: string;
		date: string;
		tags: string[];
		relatedPosts?: RelatedPost[];
		children: Snippet;
	}
	let { title, date, tags, relatedPosts = [], children }: Props = $props();
</script>

<div class="post-container px-[1.2rem] sm:px-8 max-w-[1080px] mx-auto">
	<TOC />
	<header class="pt-20 pb-12">
		<div class="flex items-center gap-4 text-[1.5rem] text-sub mb-6">
			<time>{date}</time>
			<span class="text-gray-dark">|</span>
			{#each tags as tag}
				<span>{tag}</span>
			{/each}
		</div>
		<h1 class="text-basic font-black text-[5rem] sm:text-[6rem] leading-[1.1]" style="word-break: keep-all;">{title}</h1>
		<a href="/" class="inline-block text-hl text-[1.5rem] mt-6 hover:underline">← 홈으로</a>
	</header>
	<div class="post-content py-12">
		{@render children()}
		<Giscus />
	</div>
	{#if relatedPosts.length > 0}
		<section class="py-16 border-t border-gray-DEFAULT">
			<h2 class="text-[3rem] font-bold text-basic mb-10">다른 글 더 보기</h2>
			<ul class="grid grid-cols-1 md:grid-cols-3 gap-6">
				{#each relatedPosts as post (post.slug)}
					<li class="border border-gray-DEFAULT rounded-lg overflow-hidden">
						<PostCard
							href={post.href}
							title={post.title}
							date={post.date}
							tags={post.tags}
							description={post.description}
						/>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</div>

<style>
	:global(.post-content h1) {
		color: var(--color-hl);
		font-size: 4.2rem;
		font-weight: 900;
		word-spacing: -2px;
		margin: 4rem 0 2rem;
	}
	:global(.post-content h2) {
		font-size: 3.5rem;
		font-weight: 800;
		word-spacing: -2px;
		margin: 4rem 0 2rem;
	}
	:global(.post-content h3) {
		font-size: 3rem;
		font-weight: 700;
		word-spacing: -2px;
		margin: 3rem 0 1.5rem;
	}
	:global(.post-content h4) {
		font-size: 2.5rem;
		font-weight: 700;
		word-spacing: -2px;
		margin: 3rem 0 1.5rem;
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
		width: calc(100% + 4rem);
		max-width: 1120px;
		margin-left: -2rem;
		border-radius: 0.8rem;
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
		border-radius: 0.6rem;
		background-color: var(--color-cream);
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
		border-radius: 0.6rem 0 0 0.6rem;
		background-color: var(--color-comp);
		content: '';
	}
	:global(.post-content p + blockquote) {
		margin-top: 0;
	}
	:global(.post-content pre) {
		padding: 2rem;
		border-radius: 0.8rem;
		overflow-x: auto;
		margin-bottom: 3rem;
		line-height: 1.7;
	}
	:global(.post-content pre code) {
		background-color: transparent;
		padding: 0;
		color: inherit;
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
