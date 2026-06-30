'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { PostSummary } from '@/lib/server/posts';
import { Giscus } from './Giscus';
import { PostCard } from './PostCard';
import { TOC } from './TOC';

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
		<div ref={containerRef} className="post-container mx-auto">
			<TOC />
			<div ref={stickyRef} className="sticky -top-px z-[1040] bg-bg/80 backdrop-blur-[20px]">
				<div ref={titleWrapRef} className="flex justify-center overflow-hidden px-[2.4rem] py-[1.6rem] sm:px-[4.8rem]">
					<h1 ref={titleRef} className="max-w-[900px] text-center text-[8rem] font-black leading-[1.1] text-basic" style={{ wordBreak: 'keep-all', letterSpacing: '-1px' }}>
						{title}
					</h1>
				</div>
				<div className="flex items-center justify-between px-[2.4rem] pb-[1.2rem] text-[1.3rem] text-muted sm:px-[4.8rem]">
					<div className="flex items-center gap-[1.6rem]"><time>{date}</time></div>
					<div className="flex items-center gap-[1.2rem]">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
				</div>
				<hr className="border-border" />
			</div>
			<div ref={contentRef} className="post-content mx-auto max-w-[800px] px-[2.4rem] pb-[6.4rem]">
				{children}
				<Giscus />
			</div>
			{relatedPosts.length > 0 ? (
				<section className="border-t-2 border-border px-[2.4rem] pt-[4.8rem] pb-[9.6rem] sm:px-[4.8rem]">
					<h2 className="mb-[3.2rem] text-[3.2rem] font-bold text-basic">다른 글 더 보기</h2>
					<ul className="grid grid-cols-1 gap-[2.4rem] md:grid-cols-3">
						{relatedPosts.map((post) => (
							<li key={post.href} className="overflow-hidden rounded-[1.2rem] border border-border bg-white"><PostCard {...post} /></li>
						))}
					</ul>
				</section>
			) : null}
			{toastMessage ? <div className="fixed right-6 bottom-6 z-[2000] rounded-md bg-basic px-5 py-3 text-[1.4rem] text-white shadow-lg">{toastMessage}</div> : null}
		</div>
	);
}
