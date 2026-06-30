'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import styles from './Tabs.module.css';

interface TabItem {
	title: string;
	el: HTMLElement;
}

export function Tabs({ children }: { children: ReactNode }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [tabs, setTabs] = useState<TabItem[]>([]);
	const [activeIndex, setActiveIndex] = useState(0);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		function extractTitle(pre: HTMLElement): string {
			const firstLine = pre.querySelector('.line');
			if (!firstLine) return 'Code';
			const text = firstLine.textContent || '';
			const match = text.match(/^(?:\/\/|#)\s*title\s+(.+)/);
			if (match) {
				firstLine.remove();
				return match[1]?.trim() ?? 'Code';
			}
			return 'Code';
		}

		const pres = Array.from(container.querySelectorAll<HTMLElement>(':scope > pre, :scope > [data-tabs-content] pre'));
		const seen = new Set<HTMLElement>();
		const result: TabItem[] = [];
		for (const pre of pres) {
			if (seen.has(pre)) continue;
			seen.add(pre);
			result.push({ title: extractTitle(pre), el: pre });
		}
		setTabs(result);
		result.forEach((tab, index) => {
			tab.el.style.display = index === 0 ? '' : 'none';
		});
	}, [children]);

	const updateVisibility = (index: number) => {
		setActiveIndex(index);
		tabs.forEach((tab, tabIndex) => {
			tab.el.style.display = tabIndex === index ? '' : 'none';
		});
	};

	return (
		<div className={styles.container} ref={containerRef}>
			{tabs.length > 0 ? (
				<div className={styles.header}>
					{tabs.map((tab, index) => (
						<button key={`${tab.title}-${index}`} className={`${styles.button} ${activeIndex === index ? styles.active : ''}`} type="button" onClick={() => updateVisibility(index)}>
							{tab.title}
						</button>
					))}
				</div>
			) : null}
			<div className={styles.content} data-tabs-content>{children}</div>
		</div>
	);
}
