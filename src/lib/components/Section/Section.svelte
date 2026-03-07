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

<section class="max-w-[1080px] mx-auto px-8 py-16">
	<h2 class="text-[3rem] font-bold text-basic mb-10">{sectionTitle}</h2>
	<ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each posts as post (post.slug ?? post.href)}
			{#if post.slug}
				<li class="border border-gray-DEFAULT rounded-lg overflow-hidden">
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
