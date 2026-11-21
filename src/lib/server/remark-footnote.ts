import type { BlockContent, DefinitionContent, FootnoteDefinition, FootnoteReference, Paragraph, Parent, Root, RootContent } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { gfm } from 'micromark-extension-gfm';
import { visit } from 'unist-util-visit';

const COMPONENT_NAME = 'Footnote';

interface JsxAttribute {
	type: string;
	name?: string;
	value?: string | null | { value: string; data?: { estree?: unknown } };
}

interface JsxElement {
	type: 'mdxJsxTextElement' | 'mdxJsxFlowElement';
	name: string | null;
	attributes: JsxAttribute[];
	children: RootContent[];
}

interface EstreeLiteralProgram {
	body?: { expression?: { type?: string; value?: unknown; quasis?: { value: { cooked?: string } }[] } }[];
}

function isFootnoteElement(node: unknown): node is JsxElement {
	const element = node as JsxElement;
	return (
		(element.type === 'mdxJsxTextElement' || element.type === 'mdxJsxFlowElement') && element.name === COMPONENT_NAME
	);
}

function readStringAttribute(element: JsxElement, name: string): string | undefined {
	const attribute = element.attributes.find((item) => item.type === 'mdxJsxAttribute' && item.name === name);
	const value = attribute?.value;

	if (typeof value === 'string') return value;

	if (value && typeof value === 'object') {
		const program = value.data?.estree as EstreeLiteralProgram | undefined;
		const expression = program?.body?.[0]?.expression;
		if (expression?.type === 'Literal' && typeof expression.value === 'string') return expression.value;
		if (expression?.type === 'TemplateLiteral' && expression.quasis?.length === 1) {
			return expression.quasis[0]!.value.cooked ?? '';
		}
	}

	return undefined;
}

function buildNoteContent(note: string, link: string | undefined): Array<BlockContent | DefinitionContent> {
	if (link) {
		return [{ type: 'paragraph', children: [{ type: 'link', url: link, children: [{ type: 'text', value: note }] }] }];
	}

	const tree = fromMarkdown(note, {
		extensions: [gfm()],
		mdastExtensions: [gfmFromMarkdown()]
	});
	return tree.children as Array<BlockContent | DefinitionContent>;
}

function withReference(element: JsxElement, reference: FootnoteReference): RootContent[] {
	if (element.type === 'mdxJsxTextElement') return [...element.children, reference];

	const children = [...element.children];
	const last = children.at(-1);
	if (last?.type === 'paragraph') {
		children[children.length - 1] = { ...last, children: [...last.children, reference] };
		return children;
	}
	const paragraph: Paragraph = { type: 'paragraph', children: [reference] };
	return [...children, paragraph];
}

export function remarkFootnote() {
	return function transform(tree: Root) {
		const usedIdentifiers = new Set<string>();
		visit(tree, (node) => {
			if (node.type === 'footnoteDefinition' || node.type === 'footnoteReference') {
				usedIdentifiers.add(node.identifier);
			}
		});

		let counter = 0;
		function nextIdentifier() {
			do {
				counter += 1;
			} while (usedIdentifiers.has(String(counter)));
			const identifier = String(counter);
			usedIdentifiers.add(identifier);
			return identifier;
		}

		const definitions: FootnoteDefinition[] = [];

		visit(tree, (node, index, parent: Parent | undefined) => {
			if (!isFootnoteElement(node) || !parent || typeof index !== 'number') return;

			const note = readStringAttribute(node, 'note')?.trim();
			if (!note) {
				console.warn(`<${COMPONENT_NAME}> without a "note" was rendered as plain text`);
				parent.children.splice(index, 1, ...node.children);
				return index;
			}

			const identifier = nextIdentifier();
			const reference: FootnoteReference = { type: 'footnoteReference', identifier, label: identifier };
			const link = readStringAttribute(node, 'link')?.trim() || undefined;
			definitions.push({ type: 'footnoteDefinition', identifier, label: identifier, children: buildNoteContent(note, link) });

			const replacement = withReference(node, reference);
			parent.children.splice(index, 1, ...replacement);
			return index;
		});

		tree.children.push(...definitions);
	};
}
