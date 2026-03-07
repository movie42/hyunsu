<script lang="ts">
	import type { Snippet } from 'svelte';
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

<div class="post-container max-w-[1200px] mx-auto">
	<!-- Metadata bar: 날짜 좌측, 태그 우측 -->
	<div class="flex items-center justify-between px-[2.4rem] sm:px-[4.8rem] pt-[3.2rem] pb-[1.6rem] text-[1.3rem] text-[#999]">
		<div class="flex items-center gap-[1.6rem]">
			<time>{date}</time>
		</div>
		<div class="flex items-center gap-[1.2rem]">
			{#each tags as tag}
				<span>{tag}</span>
			{/each}
		</div>
	</div>
	<!-- 글 제목: 대형 중앙 정렬 -->
	<div class="text-center px-[2.4rem] sm:px-[4.8rem] py-[4.8rem]">
		<h1 class="text-basic font-black text-[6rem] sm:text-[8rem] leading-[1.1] max-w-[900px] mx-auto" style="word-break: keep-all; letter-spacing: -1px;">{title}</h1>
	</div>
	<!-- 구분선 -->
	<hr class="mx-[2.4rem] sm:mx-[4.8rem] border-[rgba(0,0,0,0.1)]" />
	<!-- Content body with Dia max-width -->
	<div class="post-content max-w-[800px] mx-auto px-[2.4rem] pb-[6.4rem]">
		{@render children()}
		<Giscus />
	</div>
	{#if relatedPosts.length > 0}
		<section class="px-[2.4rem] sm:px-[4.8rem] pt-[4.8rem] pb-[9.6rem] border-t-[2px] border-[rgba(0,0,0,0.1)]">
			<h2 class="text-[3.2rem] font-bold text-basic mb-[3.2rem]">다른 글 더 보기</h2>
			<ul class="grid grid-cols-1 md:grid-cols-3 gap-[2.4rem]">
				{#each relatedPosts as post (post.slug)}
					<li class="border border-[#e5e5e5] rounded-[1.2rem] overflow-hidden bg-white">
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
		color: var(--color-basic);
		font-size: 3.6rem;
		font-weight: 700;
		letter-spacing: -0.3px;
		margin: 6.4rem 0 2.4rem;
	}
	:global(.post-content h2) {
		font-size: 3.2rem;
		font-weight: 600;
		letter-spacing: -0.3px;
		margin: 6.4rem 0 2.4rem;
	}
	:global(.post-content h3) {
		font-size: 2.4rem;
		font-weight: 600;
		margin: 4.8rem 0 1.6rem;
	}
	:global(.post-content h4) {
		font-size: 2rem;
		font-weight: 600;
		margin: 3.2rem 0 1.6rem;
	}
	:global(.post-content a) {
		display: block;
		color: var(--color-hl);
	}
	:global(.post-content p) {
		font-size: 1.8rem;
		line-height: 1.7;
		color: #1a1a1a;
		margin-bottom: 2.4rem;
	}
	:global(.post-content p a) {
		display: inline;
		color: var(--color-hl);
	}
	:global(.post-content p code) {
		color: var(--color-hl-light);
		background-color: rgba(0,0,0,0.04);
		padding: 0.2rem 0.6rem;
		border-radius: 4px;
		font-size: 1.6rem;
	}
	:global(.post-content img) {
		width: 100%;
		border-radius: 1.2rem;
		margin-bottom: 3.2rem;
	}
	:global(.post-content ol) {
		margin-left: 2.4rem;
	}
	:global(.post-content ol li) {
		list-style: auto;
	}
	:global(.post-content ol li ul) {
		margin: 0;
		margin-left: 1.6rem;
	}
	:global(.post-content ol li ul li) {
		list-style: disc;
		padding-left: 1.6rem;
	}
	:global(.post-content ul),
	:global(.post-content ol) {
		margin-bottom: 2.4rem;
	}
	:global(.post-content ul li),
	:global(.post-content ol li) {
		font-size: 1.6rem;
		line-height: 1.7;
		margin-bottom: 0.8rem;
	}
	:global(.post-content ul li ul li),
	:global(.post-content ul li ol li),
	:global(.post-content ol li ul li),
	:global(.post-content ol li ol li) {
		padding-left: 1.2rem;
	}
	:global(.post-content blockquote) {
		word-break: keep-all;
		margin: 1.2rem 0 2.4rem;
		padding: 0;
		background: none;
		border: none;
		font-style: italic;
		font-size: 1.8rem;
		line-height: 1.7;
		color: var(--color-basic);
	}
	:global(.post-content blockquote p) {
		margin: 0;
		font-style: italic;
	}
	:global(.post-content pre) {
		padding: 2.4rem;
		border-radius: 1.2rem;
		overflow-x: auto;
		margin-bottom: 3.2rem;
		line-height: 1.7;
	}
	:global(.post-content pre code) {
		background-color: transparent;
		padding: 0;
		color: inherit;
	}
	:global(.post-content code) {
		font-size: 1.4rem;
		letter-spacing: -0.01rem;
	}
	:global(.post-content .embeded-video) {
		width: 100%;
		margin: 0 auto;
		aspect-ratio: 16 / 9;
		border-radius: 1.2rem;
		overflow: hidden;
		margin-bottom: 3.2rem;
	}
	:global(.post-content .embeded-video iframe) {
		width: 100%;
		height: 100%;
	}

	@media (max-width: 450px) {
		:global(.post-content h1) { font-size: 2.8rem; line-height: 1.2; }
		:global(.post-content h2) { font-size: 2.4rem; line-height: 1.2; }
		:global(.post-content h3) { font-size: 2rem; line-height: 1.2; }
		:global(.post-content h4) { font-size: 1.8rem; line-height: 1.2; }
		:global(.post-content h5) { font-size: 1.6rem; line-height: 1.2; }
	}
</style>
