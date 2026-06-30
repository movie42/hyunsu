'use client';

import { useEffect, useRef } from 'react';

export function Canvas() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const position = { x: 60, y: 60 };
		const velocity = { x: 10, y: 10 };
		const rad = 30;

		canvas.width = 1000;
		canvas.height = 500;

		const innerWidth = canvas.width;
		const innerHeight = canvas.height;
		const context = canvas.getContext('2d');
		if (!context) return;

		let frameId = 0;
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
			frameId = requestAnimationFrame(animate);
			context.clearRect(0, 0, innerWidth, innerHeight);
			draw();
			update();
		};
		animate();

		return () => cancelAnimationFrame(frameId);
	}, []);

	return (
		<div className="w-full">
			<canvas className="bg-white" ref={canvasRef} />
		</div>
	);
}
