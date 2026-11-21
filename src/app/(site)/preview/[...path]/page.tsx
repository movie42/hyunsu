import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { generateUrl, getAllPostsIncludingDrafts, getPostBySourcePath } from '@/lib/server/posts';

type PageProps = { params: Promise<{ path: string[] }> };

export const dynamicParams = false;

export const metadata: Metadata = {
	robots: { index: false, follow: false }
};

export function generateStaticParams() {
	return getAllPostsIncludingDrafts().map((post) => ({ path: post.sourcePath.split('/') }));
}

export default async function PreviewPage({ params }: PageProps) {
	const { path } = await params;
	const post = getPostBySourcePath(path.map((part) => decodeURIComponent(part)).join('/'));
	if (!post) notFound();
	redirect(generateUrl({ slug: post.slug, tags: post.tags }));
}
