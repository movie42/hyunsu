import type { Metadata } from 'next';
import { Section } from '@/components/Section';
import { getPostsByCategory, toPostSummary } from '@/lib/server/posts';
import styles from './page.module.css';

export const metadata: Metadata = {
	title: '영화',
	alternates: {
		canonical: '/posts/movie'
	}
};

export default function MoviePostsPage() {
	const posts = getPostsByCategory('movie').map((post) => toPostSummary(post));

	return (
		<main className={styles.main}>
			<div className={styles.header}>
				<h1 className={styles.title}>Movie</h1>
			</div>
			<Section sectionTitle="글 목록" posts={posts} />
		</main>
	);
}
