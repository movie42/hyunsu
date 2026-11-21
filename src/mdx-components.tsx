import type { MDXComponents } from 'mdx/types';
import { BezierCasteljau } from '@/components/BezierCasteljau';
import { Canvas } from '@/components/Canvas';
import { EasingShowcase } from '@/components/EasingShowcase';
import { ImageComment } from '@/components/ImageComment';
import { Quotation } from '@/components/Quotation';
import { Tabs } from '@/components/Tabs';
import { YouTube } from '@/components/YouTube';

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		BezierCasteljau,
		Canvas,
		EasingShowcase,
		ImageComment,
		Quotation,
		Tabs,
		YouTube,
		...components
	};
}

export const mdxComponents: MDXComponents = useMDXComponents({});
