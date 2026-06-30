export function Nav() {
	return (
		<section className="mx-auto px-[3rem] py-[4.8rem] sm:px-[3rem]">
			<h2 className="mb-[2.4rem] text-[3.2rem] font-bold text-basic">콘텐츠</h2>
			<nav aria-label="콘텐츠 카테고리">
				<ul className="flex flex-col">
					<li className="border-b border-border">
						<a className="flex items-center justify-between py-[1.6rem] text-[3rem] font-medium text-basic no-underline transition-colors duration-200 hover:text-hl" href="/posts/programming">
							프로그래밍
						</a>
					</li>
					<li className="border-b border-border">
						<a className="flex items-center justify-between py-[1.6rem] text-[3rem] font-medium text-basic no-underline transition-colors duration-200 hover:text-hl" href="/posts/movie">
							영화
						</a>
					</li>
					<li className="border-b border-border">
						<a className="flex items-center justify-between py-[1.6rem] text-[3rem] font-medium text-basic no-underline transition-colors duration-200 hover:text-hl" href="/posts/etc">
							ETC
						</a>
					</li>
				</ul>
			</nav>
		</section>
	);
}
