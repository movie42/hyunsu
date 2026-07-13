'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './TOC.module.css';

interface TocItem {
	id: string;
	text: string | null;
	level: number;
}

export function TOC() {
	const [currentId, setCurrentId] = useState('');
	const [toc, setToc] = useState<TocItem[]>([]);
	const navRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const headings = Array.from(document.querySelectorAll<HTMLHeadingElement>('h1,h2,h3,h4,h5')).slice(1).filter((heading) => heading.id);
		setToc(headings.map((heading) => ({ id: heading.id, text: heading.textContent, level: Number.parseInt(heading.tagName.substring(1), 10) })));

		let direction = '';
		let prevYposition = 0;
		let isManuallyChanged = false;

		const checkScrollDirection = (prevY: number) => {
			if (window.scrollY === 0 && prevY === 0) return;
			direction = window.scrollY > prevY ? 'down' : 'up';
			prevYposition = window.scrollY ?? 0;
		};

		const observer = new IntersectionObserver(
			(entries) => {
				if (isManuallyChanged) return;
				entries.forEach((entry) => {
					checkScrollDirection(prevYposition);
					if ((direction === 'down' && !entry.isIntersecting) || (direction === 'up' && entry.isIntersecting)) {
						setCurrentId(entry.target.id);
					}
				});
			},
			{ threshold: 0.4 }
		);

		headings.forEach((heading) => observer.observe(heading));

		const onClick = (event: Event) => {
			const target = event.target as HTMLElement | null;
			const anchor = target?.closest<HTMLAnchorElement>('[data-toc-link]');
			if (!anchor) return;
			isManuallyChanged = true;
			setCurrentId(anchor.dataset.tocLink ?? '');
			window.setTimeout(() => {
				isManuallyChanged = false;
			}, 100);
		};
		document.addEventListener('click', onClick);

		return () => {
			observer.disconnect();
			document.removeEventListener('click', onClick);
		};
	}, []);

	useEffect(() => {
		const nav = navRef.current;
		const stickyHeader = document.querySelector<HTMLElement>('[data-sticky-header]');
		if (!nav || !stickyHeader) return;

		const GAP = 16;
		let frame = 0;

		const update = () => {
			frame = 0;
			const bottom = stickyHeader.getBoundingClientRect().bottom;
			nav.style.top = `${Math.max(bottom + GAP, GAP)}px`;
		};

		const requestUpdate = () => {
			if (frame) return;
			frame = window.requestAnimationFrame(update);
		};

		update();
		window.addEventListener('scroll', requestUpdate, { passive: true });
		window.addEventListener('resize', requestUpdate);

		return () => {
			window.removeEventListener('scroll', requestUpdate);
			window.removeEventListener('resize', requestUpdate);
			if (frame) window.cancelAnimationFrame(frame);
		};
	}, [toc]);

	if (toc.length === 0) return null;

	return (
		<nav ref={navRef} className={styles.nav} aria-label="글 목차">
			<ul className={styles.list}>
				{toc.map((item) => (
					<li key={item.id} style={{ marginLeft: `${(item.level - 1) * 1.2}rem` }}>
						<a href={`#${item.id}`} data-toc-link={item.id} className={`${styles.link} ${currentId === item.id ? styles.active : styles.inactive}`}>
							{item.text}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}
