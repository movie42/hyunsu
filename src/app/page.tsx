import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/site';
import { Section } from '@/components/Section';
import { getAllPosts, toPostSummary } from '@/lib/server/posts';
import styles from './page.module.css';

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
		<main className={styles.main}>
			{heroPost ? (
				<section className={styles.hero}>
					<p className={styles.eyebrow}>Latest Post</p>
					<a href={heroPost.href} className={styles.heroLink}>
						<h1 className={styles.heroTitle}>{heroPost.title}</h1>
					</a>
					<p className={styles.date}>{heroPost.date}</p>
					{heroPost.description ? <p className={styles.description}>{heroPost.description}</p> : null}
				</section>
			) : null}
			<Nav />
			{pastPosts.length > 0 ? <Section sectionTitle="Past Issues" posts={pastPosts} /> : null}
		</main>
	);
}
