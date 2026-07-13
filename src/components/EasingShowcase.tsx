'use client';

import { useState } from 'react';
import styles from './EasingShowcase.module.css';

interface EasingDemo {
	label: string;
	timingFunction: string;
	bezier: string;
	durationMs: number;
}

const DEMOS: EasingDemo[] = [
	{ label: 'ease-out', timingFunction: 'cubic-bezier(0, 0, 0.2, 1)', bezier: 'cubic-bezier(0, 0, 0.2, 1)', durationMs: 200 },
	{ label: 'ease-out (extreme)', timingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)', bezier: 'cubic-bezier(0.16, 1, 0.3, 1)', durationMs: 500 }
];

function BottomSheetPhone({ label, timingFunction, bezier, durationMs }: EasingDemo) {
	const [open, setOpen] = useState(false);

	return (
		<div className={styles.item}>
			<span className={styles.label}>{label}</span>

			<div className={styles.phone}>
				<span className={styles.notch} />

				<div className={styles.screen}>
					<button type="button" className={styles.openButton} onClick={() => setOpen(true)}>
						Show bottom sheet
					</button>
				</div>

				<button
					type="button"
					aria-label="바텀시트 닫기"
					className={`${styles.scrim} ${open ? styles.scrimOpen : ''}`}
					onClick={() => setOpen(false)}
				/>

				<div
					className={`${styles.sheet} ${open ? styles.sheetOpen : ''}`}
					style={{ transition: `transform ${durationMs}ms ${timingFunction}` }}
				>
					<span className={styles.handle} />
					<span className={styles.sheetTitle}>Bottom Sheet</span>
					<span className={styles.sheetLine} />
					<span className={`${styles.sheetLine} ${styles.sheetLineShort}`} />
					<button type="button" className={styles.closeButton} onClick={() => setOpen(false)}>
						닫기
					</button>
				</div>
			</div>

			<div className={styles.caption}>
				<span className={styles.duration}>{durationMs}ms</span>
				<code className={styles.bezier}>{bezier}</code>
			</div>
		</div>
	);
}

export function EasingShowcase() {
	return (
		<div className={styles.showcase}>
			{DEMOS.map((demo) => (
				<BottomSheetPhone key={demo.label} {...demo} />
			))}
		</div>
	);
}
