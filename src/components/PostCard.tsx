import type { PostSummary } from '@/lib/server/posts';

type PostCardProps = Pick<PostSummary, 'href' | 'title' | 'date' | 'tags' | 'description'>;

export function PostCard({ href, title, date, tags, description }: PostCardProps) {
	return (
		<a href={href} className="group block min-h-[160px] cursor-pointer p-[2rem] text-inherit no-underline transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
			<div className="mb-[1rem] flex flex-wrap gap-[0.6rem]">
				{tags.slice(0, 2).map((tag) => (
					<span key={tag} className="rounded-[4px] bg-[rgba(0,0,0,0.04)] px-[0.6rem] py-[0.2rem] text-[1.1rem] font-medium text-muted">
						{tag}
					</span>
				))}
			</div>
			<h3 className="line-clamp-2 overflow-hidden text-[1.8rem] font-bold leading-[1.4] transition-colors group-hover:text-hl" style={{ wordSpacing: '-0.2rem' }}>
				{title}
			</h3>
			{description ? <p className="mt-[0.8rem] line-clamp-2 text-[1.3rem] leading-[1.6] text-muted">{description}</p> : null}
			<div className="mt-[1.2rem]">
				<span className="text-[1.2rem] font-medium text-muted">{date}</span>
			</div>
		</a>
	);
}
