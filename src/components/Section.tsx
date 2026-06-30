import type { PostSummary } from '@/lib/server/posts';
import { PostCard } from './PostCard';

interface SectionProps {
	sectionTitle: string;
	posts: PostSummary[];
}

export function Section({ sectionTitle, posts }: SectionProps) {
	return (
		<section className="mx-auto px-[2.4rem] pb-[6.4rem] sm:px-[4.8rem]">
			<h2 className="mb-[3.2rem] text-[3.2rem] font-bold text-basic">{sectionTitle}</h2>
			<ul className="grid grid-cols-1 gap-[2.4rem] md:grid-cols-2 lg:grid-cols-3">
				{posts.map((post) => (
					<li key={post.href} className="overflow-hidden rounded-[1.2rem] border border-border bg-white">
						<PostCard {...post} />
					</li>
				))}
			</ul>
		</section>
	);
}
