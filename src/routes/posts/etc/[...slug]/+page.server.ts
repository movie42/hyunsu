import { getAllPosts, getPostBySlug, getCategory } from '$lib/server/posts';
import { error } from '@sveltejs/kit';

export function entries() {
	return getAllPosts()
		.filter((p) => getCategory(p.tags) === 'etc')
		.map((p) => ({ slug: p.slug }));
}

export async function load({ params }) {
	const slug = params.slug;
	const post = getPostBySlug(slug);

	if (!post) {
		error(404, '페이지를 찾을 수 없습니다.');
	}

	return {
		title: post.title,
		date: post.date,
		tags: post.tags,
		slug: post.slug,
		filePath: post.filePath,
		description: post.content.slice(0, 100) + '...'
	};
}
