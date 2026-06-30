import type { MDXComponents } from 'mdx/types';
import { Canvas } from '@/components/Canvas';
import { ImageComment } from '@/components/ImageComment';
import { Quotation } from '@/components/Quotation';
import { Tabs } from '@/components/Tabs';

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		Canvas,
		ImageComment,
		Quotation,
		Tabs,
		...components
	};
}

export const mdxComponents: MDXComponents = useMDXComponents({});
