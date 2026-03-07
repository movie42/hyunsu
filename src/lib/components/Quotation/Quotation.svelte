<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		type: 'speak' | 'think';
		children: Snippet;
	}
	let { type, children }: Props = $props();
</script>

<div class="flex justify-center items-center py-40 pb-48">
	<blockquote class="m-0 p-0 bg-transparent text-[2.8rem] italic text-basic" style="font-family: 'NotoSerifKR', serif;">
		<span class="text-gray-dark italic" style="font-family: 'Times New Roman', Times, serif;">{type === 'speak' ? '"' : "'"}</span>
		{@render children()}
		<span class="text-gray-dark italic" style="font-family: 'Times New Roman', Times, serif;">{type === 'speak' ? '"' : "'"}</span>
	</blockquote>
</div>
