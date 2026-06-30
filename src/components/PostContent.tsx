'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PostSummary } from '@/lib/server/posts';
import { Giscus } from './Giscus';
import { PostCard } from './PostCard';
import { TOC } from './TOC';
import styles from './PostContent.module.css';

interface PostContentProps {
	title: string;
	date: string;
	tags: string[];
	relatedPosts?: PostSummary[];
	children: ReactNode;
}

export function PostContent({ title, date, tags, relatedPosts = [], children }: PostContentProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const stickyRef = useRef<HTMLDivElement>(null);
	const titleWrapRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const [toastMessage, setToastMessage] = useState('');

	useEffect(() => {
		const containerEl = containerRef.current;
		const stickyEl = stickyRef.current;
		const titleWrapEl = titleWrapRef.current;
		const titleEl = titleRef.current;
		const contentEl = contentRef.current;
		if (!containerEl || !stickyEl || !titleWrapEl || !titleEl || !contentEl) return;

		function onCodeClick(e: MouseEvent) {
			const pre = (e.target as HTMLElement).closest('pre');
			if (!pre) return;
			const code = pre.querySelector('code');
			const text = code?.textContent ?? pre.textContent ?? '';
			void navigator.clipboard.writeText(text);
			setToastMessage('복사되었습니다.');
			window.setTimeout(() => setToastMessage(''), 1400);
		}
		contentEl.addEventListener('click', onCodeClick);
		gsap.registerPlugin(ScrollTrigger);

		const header = document.querySelector('header') as HTMLElement | null;
		let removeScrollListener: (() => void) | undefined;

		if (header) {
			const headerEl = header;
			const stickyHeaderEl = stickyEl;
			const headerH = headerEl.offsetHeight;
			let lastScrollY = window.scrollY;
			let headerY = 0;
			stickyHeaderEl.style.top = `${headerH - 1}px`;

			function onScroll() {
				const currentY = window.scrollY;
				const delta = currentY - lastScrollY;
				headerY = Math.max(-headerH, Math.min(0, headerY - delta));
				headerEl.style.transform = `translateY(${headerY}px)`;
				stickyHeaderEl.style.top = `${headerH + headerY - 1}px`;
				lastScrollY = currentY;
			}
			window.addEventListener('scroll', onScroll, { passive: true });
			removeScrollListener = () => {
				window.removeEventListener('scroll', onScroll);
				headerEl.style.transform = '';
				stickyHeaderEl.style.top = '';
			};
		}

		const titleH = titleWrapEl.offsetHeight;
		const st = { trigger: containerEl, start: 'top top', end: '+=300', scrub: true };
		gsap.to(titleEl, { scale: 0.375, transformOrigin: 'center top', ease: 'none', scrollTrigger: st });
		gsap.to(titleWrapEl, { height: titleH * 0.375, ease: 'none', scrollTrigger: { ...st } });

		return () => {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
			contentEl.removeEventListener('click', onCodeClick);
			removeScrollListener?.();
		};
	}, []);

	return (
		<div ref={containerRef} className={styles.container}>
			<TOC />
			<div ref={stickyRef} className={styles.stickyHeader}>
				<div ref={titleWrapRef} className={styles.titleWrapper}>
					<h1 ref={titleRef} className={styles.title}>
						{title}
					</h1>
				</div>
				<div className={styles.meta}>
					<div className={styles.metaGroup}><time>{date}</time></div>
					<div className={styles.tags}>{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
				</div>
				<hr className={styles.divider} />
			</div>
			<div ref={contentRef} className={`post-content ${styles.content}`}>
				{children}
				<Giscus />
			</div>
			{relatedPosts.length > 0 ? (
				<section className={styles.related}>
					<h2 className={styles.relatedTitle}>다른 글 더 보기</h2>
					<ul className={styles.relatedGrid}>
						{relatedPosts.map((post) => (
							<li key={post.href} className={styles.relatedItem}><PostCard {...post} /></li>
						))}
					</ul>
				</section>
			) : null}
			{toastMessage ? <div className={styles.toast}>{toastMessage}</div> : null}
		</div>
	);
}
