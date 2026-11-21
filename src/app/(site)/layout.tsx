import { Header } from '@/components/Header';
import '../globals.css';

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<>
			<Header />
			{children}
		</>
	);
}
