<script lang="ts">
	import Section from '$lib/components/Section/Section.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>영화 | 현수의 블로그</title>
</svelte:head>

<div>
	<Section sectionTitle="영화" posts={data.posts} />
</div>
