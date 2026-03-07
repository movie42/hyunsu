<script lang="ts">
	import { onMount } from 'svelte';

	let canvasEl: HTMLCanvasElement;

	onMount(() => {
		const position = { x: 60, y: 60 };
		const velocity = { x: 10, y: 10 };
		const rad = 30;

		canvasEl.width = 1000;
		canvasEl.height = 500;

		const innerWidth = canvasEl.width;
		const innerHeight = canvasEl.height;
		const context = canvasEl.getContext('2d');
		if (!context) return;

		const draw = () => {
			context.fillStyle = '#0efccc';
			context.beginPath();
			context.arc(position.x, position.y, rad, 0, 2 * Math.PI);
			context.fill();
		};

		const update = () => {
			if (position.x + rad > innerWidth || position.x - rad < 0) velocity.x = -velocity.x;
			if (position.y + rad > innerHeight || position.y - rad < 0) velocity.y = -velocity.y;
			position.x += velocity.x;
			position.y += velocity.y;
		};

		const animate = () => {
			requestAnimationFrame(animate);
			context.clearRect(0, 0, innerWidth, innerHeight);
			draw();
			update();
		};

		animate();
	});
</script>

<div class="w-full">
	<canvas class="bg-white" bind:this={canvasEl}></canvas>
</div>
