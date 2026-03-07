<script lang="ts">
	interface Props {
		title: string;
		date: string;
		tags: string[];
		description: string;
		wordCount: number;
		href: string;
	}
	let { title, date, tags, description, wordCount, href }: Props = $props();

	const readingTime = $derived(Math.max(1, Math.round(wordCount / 200)));
</script>

<section class="py-20 px-8 max-w-[1080px] mx-auto">
	<div class="flex items-center gap-4 text-[1.5rem] text-sub mb-6">
		<time>{date}</time>
		<span class="text-gray-dark">|</span>
		{#each tags.slice(0, 3) as tag}
			<span>{tag}</span>
		{/each}
		<span class="text-gray-dark">|</span>
		<span>{readingTime}min read</span>
	</div>
	<a {href} class="block no-underline text-inherit group">
		<h1
			class="text-[5rem] sm:text-[7rem] font-black text-basic leading-[1.1] mb-8 group-hover:text-hl transition-colors"
			style="word-break: keep-all;"
		>
			{title}
		</h1>
		{#if description}
			<p class="text-[2rem] text-sub leading-[1.6] max-w-[720px] mb-8">
				{description}
			</p>
		{/if}
		<span class="inline-block text-[1.6rem] text-hl font-semibold group-hover:underline">
			Read more →
		</span>
	</a>
</section>
