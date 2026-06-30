import type { Metadata } from 'next';
import styles from './not-found.module.css';

export const metadata: Metadata = {
	title: '페이지를 찾을 수 없습니다'
};

export default function NotFound() {
	return (
		<main className={styles.main}>
			<p className={styles.eyebrow}>404</p>
			<h1 className={styles.title}>페이지를 찾을 수 없습니다.</h1>
			<p className={styles.description}>주소가 변경되었거나 삭제된 글입니다.</p>
			<a className={styles.link} href="/">
				홈으로 이동
			</a>
		</main>
	);
}
