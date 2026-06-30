'use client';

import { RefObject, useEffect } from 'react';

export function useReveal<T extends HTMLElement>(ref: RefObject<T | null>, options: { delay?: number; threshold?: number } = {}) {
	const { delay = 0, threshold = 0.15 } = options;

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		node.style.opacity = '0';
		node.style.transform = 'translateY(24px)';
		node.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					node.style.opacity = '1';
					node.style.transform = 'translateY(0)';
					observer.unobserve(node);
				}
			},
			{ threshold }
		);

		observer.observe(node);

		return () => observer.disconnect();
	}, [delay, ref, threshold]);
}
