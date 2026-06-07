<script lang="ts">
	import Section from '$lib/components/Section/Section.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>쓰레기통 | 현수의 블로그</title>
</svelte:head>

<div>
	<Section sectionTitle="쓰레기통" posts={data.posts} />
</div>
