import type { Metadata } from 'next';
import { Section } from '@/components/Section';
import { getPostsByCategory, toPostSummary } from '@/lib/server/posts';

export const metadata: Metadata = {
	title: 'ETC',
	alternates: {
		canonical: '/posts/etc'
	}
};

export default function EtcPostsPage() {
	const posts = getPostsByCategory('etc').map((post) => toPostSummary(post));

	return (
		<main className="text-basic">
			<div className="px-[2.4rem] pt-12 sm:px-[4.8rem]">
				<h1 className="mb-[3.2rem] text-[3.2rem] font-bold">Etc</h1>
			</div>
			<Section sectionTitle="글 목록" posts={posts} />
		</main>
	);
}
