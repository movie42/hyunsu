<script lang="ts">
	import { base } from '$app/paths';
</script>

<header class="sticky top-0 z-[1050] flex items-center justify-between px-8 py-[1.2rem] bg-bg/80 backdrop-blur-[20px]">
	<h1>
		<a
			class="text-[2.5rem] font-bold text-hl p-2 hover:text-hl-dark"
			href="{base}/"
		>
			현수의 블로그
		</a>
	</h1>
	<div class="flex gap-[0.8rem]">
		<a
			class="inline-block text-[1.8rem] font-bold text-hl p-2 hover:text-white hover:bg-hl"
			href="{base}/feed.xml"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>
		</a>
		<a
			class="inline-block text-[1.8rem] font-bold text-basic p-2 hover:text-white hover:bg-basic"
			href="https://github.com/movie42"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
		</a>
	</div>
</header>
