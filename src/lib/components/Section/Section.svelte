<script lang="ts">
	import PostCard from '$lib/components/Post/PostCard.svelte';

	interface PostData {
		slug?: string;
		title?: string;
		date?: string;
		tags?: string[];
		href: string;
	}
	interface Props {
		sectionTitle: string;
		posts: PostData[];
	}
	let { sectionTitle, posts }: Props = $props();
</script>

<section>
	<div class="p-8">
		<h1 class="text-[5rem] font-black text-hl">{sectionTitle}</h1>
	</div>
	<ul class="grid">
		{#each posts as post (post.slug ?? post.href)}
			{#if post.slug}
				<li class="border-b border-gray-DEFAULT first:border-t first:border-gray-DEFAULT">
					<PostCard
						href={post.href}
						title={post.title}
						date={post.date}
						tags={post.tags}
					/>
				</li>
			{/if}
		{/each}
	</ul>
</section>
