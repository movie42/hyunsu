import type { PostSummary } from '@/lib/server/posts';
import { PostCard } from './PostCard';
import styles from './Section.module.css';

interface SectionProps {
	sectionTitle: string;
	posts: PostSummary[];
}

export function Section({ sectionTitle, posts }: SectionProps) {
	return (
		<section className={styles.section}>
			<h2 className={styles.title}>{sectionTitle}</h2>
			<ul className={styles.grid}>
				{posts.map((post) => (
					<li key={post.href} className={styles.item}>
						<PostCard {...post} />
					</li>
				))}
			</ul>
		</section>
	);
}
