<script lang="ts">
	import PostContent from '$lib/components/Post/PostContent.svelte';

	let { data } = $props();

	const modules = import.meta.glob('/src/content/markdown-pages/**/*.{mdx,md}', { eager: true }) as Record<string, any>;
	let Content = $derived(modules[data.filePath]?.default);
</script>

<svelte:head>
	<title>{data.title} | 현수의 블로그</title>
	<meta name="description" content={data.description} />
	<link rel="canonical" href="https://hyunsu.info/posts/movie/{data.slug}" />
</svelte:head>

<PostContent title={data.title} date={data.date} tags={data.tags}>
	{#if Content}
		<Content />
	{/if}
</PostContent>
