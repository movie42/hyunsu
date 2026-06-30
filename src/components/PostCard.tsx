import type { PostSummary } from '@/lib/server/posts';
import styles from './PostCard.module.css';

type PostCardProps = Pick<PostSummary, 'href' | 'title' | 'date' | 'tags' | 'description'>;

export function PostCard({ href, title, date, tags, description }: PostCardProps) {
	return (
		<a href={href} className={styles.card}>
			<div className={styles.tags}>
				{tags.slice(0, 2).map((tag) => (
					<span key={tag} className={styles.tag}>
						{tag}
					</span>
				))}
			</div>
			<h3 className={styles.title}>{title}</h3>
			{description ? <p className={styles.description}>{description}</p> : null}
			<div className={styles.meta}>
				<span className={styles.date}>{date}</span>
			</div>
		</a>
	);
}
