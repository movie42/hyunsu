import { getPostBySlug, renderMarkdown } from '$lib/server/posts';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const slug = params.slug;
	const post = getPostBySlug(slug);

	if (!post) {
		error(404, '페이지를 찾을 수 없습니다.');
	}

	const html = await renderMarkdown(post.content);

	return {
		title: post.title,
		date: post.date,
		tags: post.tags,
		content: html,
		slug: post.slug,
		description: post.content.slice(0, 100) + '...'
	};
}
