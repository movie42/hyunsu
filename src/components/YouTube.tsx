import styles from './YouTube.module.css';

interface YouTubeProps {
	id: string;
	title?: string;
}

export function YouTube({ id, title = 'YouTube video player' }: YouTubeProps) {
	return (
		<div className={styles.video}>
			<iframe
				className={styles.frame}
				src={`https://www.youtube.com/embed/${encodeURIComponent(id)}`}
				title={title}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			/>
		</div>
	);
}
