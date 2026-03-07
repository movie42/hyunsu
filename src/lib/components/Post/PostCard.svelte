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

<a {href} class="block p-[2.4rem] no-underline text-inherit cursor-pointer group hover:-translate-y-[4px] transition-all duration-200 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)]">
	<div class="flex flex-wrap gap-[0.8rem] mb-[1.2rem]">
		{#each tags?.slice(0, 2) ?? [] as tag}
			<span class="text-[1.2rem] text-muted font-medium px-[0.8rem] py-[0.2rem] bg-[rgba(0,0,0,0.04)] rounded-[4px]">{tag}</span>
		{/each}
	</div>
	<h3 class="text-[2rem] leading-[1.4] font-bold overflow-hidden line-clamp-2 group-hover:text-hl transition-colors" style="word-spacing: -0.2rem;">
		{title}
	</h3>
	{#if description}
		<p class="text-[1.4rem] leading-[1.6] text-muted mt-[1.2rem] line-clamp-2">{description}</p>
	{/if}
	<div class="mt-[1.6rem]">
		<span class="text-[1.2rem] text-muted font-medium">{date}</span>
	</div>
</a>
