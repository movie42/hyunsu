import styles from './Nav.module.css';

export function Nav() {
	return (
		<section className={styles.section}>
			<h2 className={styles.title}>콘텐츠</h2>
			<nav aria-label="콘텐츠 카테고리">
				<ul className={styles.list}>
					<li className={styles.item}>
						<a className={styles.link} href="/posts/programming">
							프로그래밍
						</a>
					</li>
					<li className={styles.item}>
						<a className={styles.link} href="/posts/movie">
							영화
						</a>
					</li>
					<li className={styles.item}>
						<a className={styles.link} href="/posts/etc">
							ETC
						</a>
					</li>
				</ul>
			</nav>
		</section>
	);
}
