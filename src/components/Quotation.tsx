import type { ReactNode } from 'react';
import styles from './Quotation.module.css';

interface QuotationProps {
	type?: 'speak' | 'think';
	children: ReactNode;
}

export function Quotation({ type = 'speak', children }: QuotationProps) {
	return (
		<blockquote className={styles.quote}>
			<span className={styles.mark}>{type === 'speak' ? '“' : '‘'}</span>
			<em>{children}</em>
			<span className={styles.mark}>{type === 'speak' ? '”' : '’'}</span>
		</blockquote>
	);
}
