import type { ReactNode } from 'react';

export function ImageComment({ children }: { children: ReactNode }) {
	return <div className="text-[1.4rem] text-comp">{children}</div>;
}
