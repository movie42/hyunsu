<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		type: 'speak' | 'think';
		children: Snippet;
	}
	let { type, children }: Props = $props();
</script>

<blockquote class="m-0 py-[1.2rem] px-0 bg-transparent text-[1.8rem] leading-[1.7] text-basic italic inline">
	<span class="not-italic">{type === 'speak' ? '\u201C' : '\u2018'}</span><em>{@render children()}</em><span class="not-italic">{type === 'speak' ? '\u201D' : '\u2019'}</span>
</blockquote>
