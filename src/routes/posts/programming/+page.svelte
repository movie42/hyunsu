<script lang="ts">
	import Section from '$lib/components/Section/Section.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>프로그래밍 | 현수의 블로그</title>
</svelte:head>

<div>
	<Section sectionTitle="프로그래밍" posts={data.posts} />
</div>
