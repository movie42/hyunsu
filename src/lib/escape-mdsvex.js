/**
 * SvelteKit preprocessor that escapes { } and problematic < in markdown text
 * BEFORE mdsvex parses it. Only applies to .mdx/.md files.
 * Leaves code blocks (``` ... ```) and frontmatter (--- ... ---) untouched.
 */

const COMPONENT_LINE_RE =
	/^\s*<\/?(Quotation|Canvas|ImageComment|Tabs|script|div|iframe|img|br|a\s|a>)/;

const COMPONENT_IMPORTS = {
	Quotation: "import Quotation from '$lib/components/Quotation/Quotation.svelte';",
	Canvas: "import Canvas from '$lib/components/Canvas/Canvas.svelte';",
	ImageComment: "import ImageComment from '$lib/components/ImageComment/ImageComment.svelte';",
	Tabs: "import Tabs from '$lib/components/Tabs/Tabs.svelte';"
};

export function escapeMdsvex() {
	return {
		name: 'escape-mdsvex',
		markup({ content, filename }) {
			if (!filename || (!filename.endsWith('.mdx') && !filename.endsWith('.md'))) {
				return;
			}

			const lines = content.split('\n');
			const result = [];
			let inFrontmatter = false;
			let frontmatterCount = 0;
			let inCodeBlock = false;

			for (const line of lines) {
				// Track frontmatter
				if (line.trim() === '---') {
					frontmatterCount++;
					if (frontmatterCount === 1) inFrontmatter = true;
					if (frontmatterCount === 2) inFrontmatter = false;
					result.push(line);
					continue;
				}

				if (inFrontmatter) {
					result.push(line);
					continue;
				}

				// Track fenced code blocks
				if (line.trimStart().startsWith('```')) {
					inCodeBlock = !inCodeBlock;
					result.push(line);
					continue;
				}

				if (inCodeBlock) {
					result.push(line);
					continue;
				}

				// Skip lines that are component/HTML tag lines
				if (COMPONENT_LINE_RE.test(line)) {
					result.push(line);
					continue;
				}

				let escaped = line;

				// Escape curly braces
				escaped = escaped.replace(/\{/g, '\x00LB\x00').replace(/\}/g, '\x00RB\x00');
				escaped = escaped
					.replace(/\x00LB\x00/g, '{@html String.fromCharCode(123)}')
					.replace(/\x00RB\x00/g, '{@html String.fromCharCode(125)}');

				// Escape \< (markdown escaped angle bracket)
				escaped = escaped.replace(/\\</g, '&lt;');

				// Escape < followed by uppercase (generic types like <T>, <Element>)
				escaped = escaped.replace(/<(?=[A-Z][A-Za-z]*>)/g, '&lt;');

				// Escape < followed by space or digit (comparisons like < 0, < 10)
				escaped = escaped.replace(/<(?=\s*\d)/g, '&lt;');

				result.push(escaped);
			}

			let output = result.join('\n');

			// Auto-inject imports for custom components used in the MDX
			const usedImports = [];
			for (const [name, importStr] of Object.entries(COMPONENT_IMPORTS)) {
				if (output.includes(`<${name}`)) {
					usedImports.push(importStr);
				}
			}
			if (usedImports.length > 0) {
				const scriptBlock = `<script>\n${usedImports.join('\n')}\n</script>\n\n`;
				// Insert after frontmatter
				const fmEnd = output.indexOf('---', output.indexOf('---') + 3);
				if (fmEnd !== -1) {
					const insertPos = fmEnd + 3;
					output = output.slice(0, insertPos) + '\n\n' + scriptBlock + output.slice(insertPos);
				} else {
					output = scriptBlock + output;
				}
			}

			return { code: output };
		}
	};
}
