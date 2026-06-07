<script lang="ts">
	import Section from '$lib/components/Section/Section.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>일반 | 현수의 블로그</title>
</svelte:head>

<div>
	<Section sectionTitle="일반" posts={data.posts} />
</div>
