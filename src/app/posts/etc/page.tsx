import type { Metadata } from 'next';
import { Section } from '@/components/Section';
import { getPostsByCategory, toPostSummary } from '@/lib/server/posts';
import styles from './page.module.css';

export const metadata: Metadata = {
	title: 'ETC',
	alternates: {
		canonical: '/posts/etc'
	}
};

export default function EtcPostsPage() {
	const posts = getPostsByCategory('etc').map((post) => toPostSummary(post));

	return (
		<main className={styles.main}>
			<div className={styles.header}>
				<h1 className={styles.title}>Etc</h1>
			</div>
			<Section sectionTitle="글 목록" posts={posts} />
		</main>
	);
}
