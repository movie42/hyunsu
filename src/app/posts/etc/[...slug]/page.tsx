import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostContent } from '@/components/PostContent';
import { renderMdx } from '@/lib/server/mdx';
import { getAllPosts, getPostByCategoryAndSlug, getPostsByCategory, toPostSummary } from '@/lib/server/posts';
import styles from './page.module.css';

type PageProps = { params: Promise<{ slug: string[] }> };

export const dynamicParams = false;

export function generateStaticParams() {
	return getPostsByCategory('etc').map((post) => ({ slug: [post.slug] }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug: slugParts } = await params;
	const slug = slugParts.join('/');
	const post = getPostByCategoryAndSlug('etc', slug);
	if (!post) return {};

	return {
		title: post.title,
		description: post.description,
		alternates: {
			canonical: `/posts/etc/${post.slug}`
		},
		openGraph: {
			type: 'article',
			title: post.title,
			description: post.description,
			url: `/posts/etc/${post.slug}`,
			publishedTime: post.date,
			tags: post.tags
		}
	};
}

export default async function EtcPostPage({ params }: PageProps) {
	const { slug: slugParts } = await params;
	const slug = slugParts.join('/');
	const post = getPostByCategoryAndSlug('etc', slug);

	if (!post) notFound();

	const relatedPosts = getAllPosts()
		.filter((item) => item.slug !== post.slug)
		.slice(0, 3)
		.map((item) => toPostSummary(item));
	const content = await renderMdx(post.content);

	return (
		<main className={styles.main}>
			<PostContent title={post.title} date={post.date} tags={post.tags} relatedPosts={relatedPosts}>
				{content}
			</PostContent>
		</main>
	);
}
