<script lang="ts">
	interface Props {
		href: string;
		title?: string;
		date?: string;
		tags?: string[];
	}
	let { href, title, date, tags }: Props = $props();
</script>

<a {href} class="block p-8 no-underline text-black cursor-pointer hover:bg-hl hover:text-white group">
	<h3 class="text-[2.8rem] leading-[1.5] font-light overflow-hidden line-clamp-2 group-hover:font-black" style="word-spacing: -0.2rem;">
		{title}
	</h3>
	<div class="flex gap-[0.4rem] mt-2">
		<span class="text-[1.8rem]">{tags ? tags.join(', ') : ''}</span>
	</div>
	<div class="mt-2 self-end">
		<span class="text-[1.6rem]">{date}</span>
	</div>
</a>
