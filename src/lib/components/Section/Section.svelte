<script lang="ts">
	import PostCard from '$lib/components/Post/PostCard.svelte';

	interface PostData {
		slug?: string;
		title?: string;
		date?: string;
		tags?: string[];
		description?: string;
		href: string;
	}
	interface Props {
		sectionTitle: string;
		posts: PostData[];
	}
	let { sectionTitle, posts }: Props = $props();
</script>

<section class="max-w-[1200px] mx-auto px-[2.4rem] sm:px-[4.8rem] pt-[4.8rem] pb-[6.4rem] border-t-[2px] border-[rgba(0,0,0,0.1)]">
	<h2 class="text-[3.2rem] font-bold text-basic mb-[3.2rem]">{sectionTitle}</h2>
	<ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2.4rem]">
		{#each posts as post (post.slug ?? post.href)}
			{#if post.slug}
				<li class="border border-[#e5e5e5] rounded-[1.2rem] overflow-hidden bg-white">
					<PostCard
						href={post.href}
						title={post.title}
						date={post.date}
						tags={post.tags}
						description={post.description}
					/>
				</li>
			{/if}
		{/each}
	</ul>
</section>
