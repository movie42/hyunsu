<script lang="ts">
	interface Props {
		href: string;
		title?: string;
		date?: string;
		tags?: string[];
		description?: string;
	}
	let { href, title, date, tags, description }: Props = $props();
</script>

<a {href} class="block p-8 no-underline text-inherit cursor-pointer group hover:-translate-y-1 transition-transform duration-200">
	<div class="flex gap-3 mb-3">
		{#each tags?.slice(0, 2) ?? [] as tag}
			<span class="text-[1.3rem] text-sub font-medium">{tag}</span>
		{/each}
	</div>
	<h3 class="text-[2.4rem] leading-[1.4] font-bold overflow-hidden line-clamp-2 group-hover:text-hl transition-colors" style="word-spacing: -0.2rem;">
		{title}
	</h3>
	{#if description}
		<p class="text-[1.5rem] leading-[1.5] text-sub mt-3 line-clamp-2">{description}</p>
	{/if}
	<div class="mt-4">
		<span class="text-[1.4rem] text-gray-dark">{date}</span>
	</div>
</a>
