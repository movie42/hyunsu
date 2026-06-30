import type { ReactNode } from 'react';
import styles from './ImageComment.module.css';

export function ImageComment({ children }: { children: ReactNode }) {
	return <div className={styles.comment}>{children}</div>;
}
