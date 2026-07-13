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
	const bandBgRef = useRef<HTMLDivElement>(null);
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
			const bandBgEl = bandBgRef.current;
			let lastScrollY = window.scrollY;
			let headerY = 0;
			// Pull the band up by the site header's height so the title overlaps the
			// header. The band sits above the header (see CSS z-index) so the title
			// stays crisp and in front; its frosted background lives in a separate
			// layer that only spans the area below the header's bottom edge, keeping
			// the logo/icons unblurred.
			containerEl.style.marginTop = `-${headerH}px`;
			stickyHeaderEl.style.top = '-1px';
			if (bandBgEl) bandBgEl.style.top = `${headerH}px`;

			function onScroll() {
				const currentY = window.scrollY;
				const delta = currentY - lastScrollY;
				headerY = Math.max(-headerH, Math.min(0, headerY - delta));
				headerEl.style.transform = `translateY(${headerY}px)`;
				// Keep the frosted background pinned to the header's bottom edge as it
				// slides; once the header is fully hidden it covers the whole band.
				if (bandBgEl) bandBgEl.style.top = `${headerH + headerY}px`;
				lastScrollY = currentY;
			}
			window.addEventListener('scroll', onScroll, { passive: true });
			removeScrollListener = () => {
				window.removeEventListener('scroll', onScroll);
				headerEl.style.transform = '';
				stickyHeaderEl.style.top = '';
				containerEl.style.marginTop = '';
				if (bandBgEl) bandBgEl.style.top = '';
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

	// 앵커(각주·TOC·백링크) 점프가 sticky 제목 밴드에 가려지지 않도록,
	// 밴드의 실제 높이를 측정해 scroll-padding-top 을 동적으로 맞춘다.
	useEffect(() => {
		const stickyEl = stickyRef.current;
		if (!stickyEl) return;

		const GAP = 16;
		let frame = 0;

		const update = () => {
			frame = 0;
			const bottom = stickyEl.getBoundingClientRect().bottom;
			document.documentElement.style.scrollPaddingTop = `${Math.max(bottom + GAP, GAP)}px`;
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
			document.documentElement.style.scrollPaddingTop = '';
		};
	}, []);

	return (
		<div ref={containerRef} className={styles.container}>
			<TOC />
			<div ref={stickyRef} className={styles.stickyHeader} data-sticky-header>
				<div ref={bandBgRef} className={styles.bandBackground} aria-hidden="true" />
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
