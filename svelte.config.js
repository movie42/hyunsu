import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { createHighlighter } from 'shiki';
import { escapeMdsvex } from './src/lib/escape-mdsvex.js';

const highlighter = await createHighlighter({
	themes: ['github-light'],
	langs: [
		'javascript',
		'typescript',
		'html',
		'css',
		'json',
		'bash',
		'shell',
		'markdown',
		'yaml',
		'jsx',
		'tsx',
		'svelte',
		'python',
		'go',
		'rust',
		'sql',
		'diff',
		'text'
	]
});

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.mdx', '.md'],
	remarkPlugins: [remarkGfm],
	rehypePlugins: [rehypeSlug],
	layout: {
		_: new URL('./src/lib/components/mdsvex/Layout.svelte', import.meta.url).pathname
	},
	highlight: {
		highlighter(code, lang) {
			const validLang = lang && highlighter.getLoadedLanguages().includes(lang) ? lang : 'text';
			const html = highlighter.codeToHtml(code, { lang: validLang, theme: 'github-light' });
			return `{@html \`${html.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`}`;
		}
	}
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.mdx', '.md'],
	preprocess: [escapeMdsvex(), vitePreprocess(), mdsvex(mdsvexOptions)],
	kit: {
		adapter: adapter(),
		alias: {
			$content: './src/content'
		},
		prerender: {
			handleHttpError: 'warn'
		}
	}
};

export default config;
