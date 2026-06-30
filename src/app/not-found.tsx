import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: '페이지를 찾을 수 없습니다'
};

export default function NotFound() {
	return (
		<main className="mx-auto max-w-[720px] px-8 py-24 text-basic">
			<p className="text-[1.4rem] uppercase tracking-[0.2em] text-muted">404</p>
			<h1 className="mt-4 text-[4rem] font-bold leading-tight">페이지를 찾을 수 없습니다.</h1>
			<p className="mt-6 text-[1.8rem] leading-8 text-muted">주소가 변경되었거나 삭제된 글입니다.</p>
			<a className="mt-8 inline-block rounded-md bg-basic px-6 py-3 text-[1.5rem] font-bold text-white hover:bg-hl" href="/">
				홈으로 이동
			</a>
		</main>
	);
}
