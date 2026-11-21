import type { Metadata } from 'next';
import { Section } from '@/components/Section';
import { getPostsByCategory, toPostSummary } from '@/lib/server/posts';
import styles from './page.module.css';

export const metadata: Metadata = {
	title: '프로그래밍',
	alternates: {
		canonical: '/posts/programming'
	}
};

export default function ProgrammingPostsPage() {
	const posts = getPostsByCategory('programming').map((post) => toPostSummary(post));

	return (
		<main className={styles.main}>
			<div className={styles.header}>
				<h1 className={styles.title}>Programming</h1>
			</div>
			<Section sectionTitle="글 목록" posts={posts} />
		</main>
	);
}
