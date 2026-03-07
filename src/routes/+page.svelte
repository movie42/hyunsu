<script lang="ts">
	import Section from '$lib/components/Section/Section.svelte';
	import Nav from '$lib/components/Nav/Nav.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>현수의 블로그</title>
	<meta name="description" content="프론트엔드 개발자 고현수의 블로그입니다. 개발, 자바스크립 & 잡다한 이야기를 끄적거리는 곳입니다." />
</svelte:head>

<div>
	<Section sectionTitle="최근에 쓴 글" posts={data.posts} />
	<Nav />
</div>
