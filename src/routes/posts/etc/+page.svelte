<script lang="ts">
	import Section from '$lib/components/Section/Section.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>ETC | 현수의 블로그</title>
</svelte:head>

<div>
	<Section sectionTitle="ETC" posts={data.posts} />
</div>
