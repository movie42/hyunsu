import type { ReactNode } from 'react';

interface QuotationProps {
	type?: 'speak' | 'think';
	children: ReactNode;
}

export function Quotation({ type = 'speak', children }: QuotationProps) {
	return (
		<blockquote className="m-0 inline bg-transparent px-0 py-[1.2rem] text-[1.8rem] italic leading-[1.7] text-basic">
			<span className="not-italic">{type === 'speak' ? '“' : '‘'}</span>
			<em>{children}</em>
			<span className="not-italic">{type === 'speak' ? '”' : '’'}</span>
		</blockquote>
	);
}
