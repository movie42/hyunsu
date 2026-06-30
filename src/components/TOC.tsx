'use client';

import { useEffect, useState } from 'react';

interface TocItem {
	id: string;
	text: string | null;
	level: number;
}

export function TOC() {
	const [currentId, setCurrentId] = useState('');
	const [toc, setToc] = useState<TocItem[]>([]);

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

	if (toc.length === 0) return null;

	return (
		<nav className="fixed top-[7rem] right-[calc((100vw-1080px)/2-320px)] max-w-[300px] max-[1400px]:hidden" aria-label="글 목차">
			<ul className="flex flex-col gap-[0.7rem]">
				{toc.map((item) => (
					<li key={item.id} style={{ marginLeft: `${(item.level - 1) * 1.2}rem` }}>
						<a href={`#${item.id}`} data-toc-link={item.id} className={`rounded-sm p-2 text-[1.4rem] ${currentId === item.id ? 'bg-hl text-white' : 'text-gray-dark'}`}>
							{item.text}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}
