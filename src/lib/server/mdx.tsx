import { evaluate } from '@mdx-js/mdx';
import { fromHtml } from 'hast-util-from-html';
import * as runtime from 'react/jsx-runtime';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { codeToHtml } from 'shiki';
import { mdxComponents } from '@/mdx-components';

const SUPPORTED_LANGUAGE_ALIASES: Record<string, string> = {
	'choose-workspace.js': 'js',
	'text-command.js': 'js',
	'package.json': 'json',
	'Canvas.tsx': 'tsx',
	'Join.tsx': 'tsx',
	'useJoinForm.tsx': 'tsx',
	'ValidationLabel.tsx': 'tsx',
	'FormItemContainer.tsx': 'tsx',
	'Idea.tsx': 'tsx',
	shell: 'sh',
	zsh: 'sh'
};

interface HastNode {
	type?: string;
	tagName?: string;
	value?: string;
	properties?: Record<string, unknown>;
	children?: HastNode[];
}

function getText(node: HastNode): string {
	if (node.type === 'text') return node.value ?? '';
	return node.children?.map((child) => getText(child)).join('') ?? '';
}

function getLanguage(codeNode: HastNode): string {
	const className = codeNode.properties?.className;
	const classes = Array.isArray(className) ? className : [];
	const languageClass = classes.find((item): item is string => typeof item === 'string' && item.startsWith('language-'));
	const language = languageClass?.replace(/^language-/, '') ?? 'text';
	return SUPPORTED_LANGUAGE_ALIASES[language] ?? language;
}

async function highlight(code: string, lang: string): Promise<HastNode> {
	try {
		const html = await codeToHtml(code, { lang, theme: 'github-light' });
		return fromHtml(html, { fragment: true }).children[0] as HastNode;
	} catch {
		const html = await codeToHtml(code, { lang: 'text', theme: 'github-light' });
		return fromHtml(html, { fragment: true }).children[0] as HastNode;
	}
}

function rehypeShiki() {
	return async function transform(tree: HastNode) {
		async function walk(node: HastNode, parent?: HastNode, index?: number) {
			if (node.tagName === 'pre') {
				const codeNode = node.children?.find((child) => child.tagName === 'code');
				if (codeNode && parent && typeof index === 'number') {
					parent.children![index] = await highlight(getText(codeNode), getLanguage(codeNode));
					return;
				}
			}

			const children = node.children ?? [];
			for (let childIndex = 0; childIndex < children.length; childIndex += 1) {
				await walk(children[childIndex]!, node, childIndex);
			}
		}

		await walk(tree);
	};
}

export async function renderMdx(source: string) {
	const { default: MDXContent } = await evaluate(source, {
		...runtime,
		baseUrl: import.meta.url,
		remarkPlugins: [remarkGfm],
		rehypePlugins: [rehypeSlug, rehypeShiki]
	});

	return <MDXContent components={mdxComponents} />;
}
