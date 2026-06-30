import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/site';
import { Section } from '@/components/Section';
import { getAllPosts, toPostSummary } from '@/lib/server/posts';

export const metadata: Metadata = {
	title: SITE_NAME,
	description: SITE_DESCRIPTION,
	alternates: {
		canonical: '/'
	}
};

export default function HomePage() {
	const allPosts = getAllPosts();
	const heroPost = allPosts[0] ? toPostSummary(allPosts[0], { includeWordCount: true }) : null;
	const pastPosts = allPosts.slice(1, 9).map((post) => toPostSummary(post));

	return (
		<main className="text-basic">
			{heroPost ? (
				<section className="mx-auto border-b border-border px-[2.4rem] py-12 sm:px-[4.8rem]">
					<p className="text-[1.4rem] uppercase tracking-[0.2em] text-muted">Latest Post</p>
					<a href={heroPost.href} className="mt-4 block hover:text-hl">
						<h1 className="text-[4rem] font-bold leading-tight">{heroPost.title}</h1>
					</a>
					<p className="mt-4 text-[1.4rem] text-muted">{heroPost.date}</p>
					{heroPost.description ? <p className="mt-6 text-[1.8rem] leading-8">{heroPost.description}</p> : null}
				</section>
			) : null}
			<Nav />
			{pastPosts.length > 0 ? <Section sectionTitle="Past Issues" posts={pastPosts} /> : null}
		</main>
	);
}
