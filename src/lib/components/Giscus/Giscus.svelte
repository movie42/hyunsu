<script lang="ts">
	import { onMount } from 'svelte';

	let container: HTMLElement;

	onMount(() => {
		const script = document.createElement('script');
		script.src = 'https://giscus.app/client.js';
		script.async = true;
		script.crossOrigin = 'anonymous';
		script.setAttribute('data-repo', 'movie42/hyunsu');
		script.setAttribute('data-repo-id', 'R_kgDOJKwX2A');
		script.setAttribute('data-category', 'General');
		script.setAttribute('data-category-id', 'DIC_kwDOJKwX2M4CbPLg');
		script.setAttribute('data-mapping', 'pathname');
		script.setAttribute('data-strict', '0');
		script.setAttribute('data-reactions-enabled', '1');
		script.setAttribute('data-emit-metadata', '0');
		script.setAttribute('data-input-position', 'top');
		script.setAttribute('data-theme', 'noborder_light');
		script.setAttribute('data-lang', 'ko');
		script.setAttribute('data-loading', 'lazy');
		container.appendChild(script);
	});
</script>

<section bind:this={container}></section>
