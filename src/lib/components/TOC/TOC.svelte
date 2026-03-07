<script lang="ts">
	import { onMount } from 'svelte';

	let currentId = $state('');
	let toc = $state<{ id: string; text: string | null; level: number }[]>([]);
	let isManuallyChanged = false;

	onMount(() => {
		const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5')).slice(1);

		toc = headings.map((heading) => ({
			id: heading.id,
			text: heading.textContent,
			level: parseInt(heading.tagName.substring(1))
		}));

		let direction = '';
		let prevYposition = 0;

		const checkScrollDirection = (prevY: number) => {
			if (window.scrollY === 0 && prevY === 0) return;
			else if (window.scrollY > prevY) direction = 'down';
			else direction = 'up';
			prevYposition = window.scrollY ?? 0;
		};

		const observer = new IntersectionObserver(
			(entries) => {
				if (isManuallyChanged) return;
				entries.forEach((entry) => {
					checkScrollDirection(prevYposition);
					if (
						(direction === 'down' && !entry.isIntersecting) ||
						(direction === 'up' && entry.isIntersecting)
					) {
						currentId = entry.target.id;
					}
				});
			},
			{ threshold: 0.4 }
		);

		headings.forEach((h) => observer.observe(h));

		return () => observer.disconnect();
	});

	function handleClick(id: string) {
		isManuallyChanged = true;
		currentId = id;
		setTimeout(() => {
			isManuallyChanged = false;
		}, 100);
	}
</script>

<nav class="fixed top-[7rem] right-[calc((100vw-1080px)/2-320px)] max-w-[300px] max-[1400px]:hidden">
	<ul class="flex flex-col gap-[0.7rem]">
		{#each toc as item, index}
			<li style="margin-left: {(item.level - 1) * 1.2}rem">
				<a
					href="#{item.id}"
					class="text-[1.4rem] p-2 {currentId === item.id ? 'bg-hl2 text-white' : 'text-gray-dark'}"
					onclick={() => handleClick(item.id)}
				>
					{item.text}
				</a>
			</li>
		{/each}
	</ul>
</nav>
