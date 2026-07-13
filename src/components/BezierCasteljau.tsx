'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './BezierCasteljau.module.css';

interface Point {
	x: number;
	y: number;
}

// SVG 좌표계. viewBox 는 아래 <svg> 와 동일하게 유지한다.
const VIEW_W = 440;
const VIEW_H = 320;

// S 자 곡선이 잘 보이도록 고른 제어점 4개 (고정).
const A: Point = { x: 40, y: 250 };
const B: Point = { x: 140, y: 40 };
const C: Point = { x: 300, y: 280 };
const D: Point = { x: 400, y: 70 };

const CURVE_STEPS = 120;
const DOT_R = 4; // 보간점 기본 반지름
const Z_R = 6; // 곡선 위의 점 Z 기본 반지름

// 1막(단계 설명)에서 사용하는 고정 t.
const DEMO_T = 0.25;

const CAPTIONS = [
	'① t = 0.25 — 각 선분의 0.25 지점에 점 E·F·G를 찍는다',
	'② E·F·G를 이어 EF, FG 선분을 만든다',
	'③ EF·FG의 0.25 지점에 K·L을 찍고 KL로 잇는다',
	'④ KL의 0.25 지점의 점 Z — 곡선 위의 점 하나가 정해진다',
	'⑤ t를 조금씩 늘리며 ②~④를 반복한다',
	'반복하면 Z의 궤적이 곧 베지어 곡선이 된다'
];

function lerp(p: Point, q: Point, t: number): Point {
	return { x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t };
}

// 파라미터 t 에서의 de Casteljau 보간 결과를 한 번에 계산한다.
function casteljau(t: number) {
	const e = lerp(A, B, t);
	const f = lerp(B, C, t);
	const g = lerp(C, D, t);
	const k = lerp(e, f, t);
	const l = lerp(f, g, t);
	const z = lerp(k, l, t);
	return { e, f, g, k, l, z };
}

// 스크럽 타임라인이 조작하는 상태. 각 단계는 페이드가 아니라 "그려지는" 진행률로 표현한다.
interface Stage {
	t: number; // 현재 보간 파라미터
	sEFG: number; // ① E·F·G 등장(반지름 성장) 0..1
	dL1: number; // ② EF·FG 선을 긋는 진행률 0..1
	sKL: number; // ③ K·L 등장 0..1
	dKL: number; // ③ KL 선을 긋는 진행률 0..1
	sZ: number; // ④ Z 등장 0..1
	oCurve: number; // 그려진 곡선 투명도
	curveT: number; // 곡선을 그린 정도 0..1
}

export function BezierCasteljau() {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const stickyRef = useRef<HTMLDivElement>(null);
	const lineRefs = useRef<Record<string, SVGLineElement | null>>({});
	const dotRefs = useRef<Record<string, SVGCircleElement | null>>({});
	const labelRefs = useRef<Record<string, SVGTextElement | null>>({});
	const groupRefs = useRef<Record<string, SVGGElement | null>>({});
	const pathRef = useRef<SVGPathElement>(null);
	const readoutRef = useRef<HTMLSpanElement>(null);
	const captionRef = useRef<HTMLParagraphElement>(null);

	useEffect(() => {
		const wrapperEl = wrapperRef.current;
		const stickyEl = stickyRef.current;
		if (!wrapperEl || !stickyEl) return;

		// 선을 dashoffset 으로 한쪽 끝에서부터 그어지게 한다.
		function setLineDraw(name: string, from: Point, to: Point, progress: number) {
			const el = lineRefs.current[name];
			if (!el) return;
			el.setAttribute('x1', String(from.x));
			el.setAttribute('y1', String(from.y));
			el.setAttribute('x2', String(to.x));
			el.setAttribute('y2', String(to.y));
			const len = Math.hypot(to.x - from.x, to.y - from.y);
			el.style.strokeDasharray = String(len);
			el.style.strokeDashoffset = String(len * (1 - progress));
		}

		// 점은 반지름을 키우며 등장시킨다.
		function setDot(name: string, p: Point, radius: number) {
			const dot = dotRefs.current[name];
			if (dot) {
				dot.setAttribute('cx', String(p.x));
				dot.setAttribute('cy', String(p.y));
				dot.setAttribute('r', String(Math.max(0, radius)));
			}
			const label = labelRefs.current[name];
			if (label) {
				label.setAttribute('x', String(p.x + 10));
				label.setAttribute('y', String(p.y - 10));
			}
		}

		function setOpacity(name: string, value: number) {
			const g = groupRefs.current[name];
			if (g) g.style.opacity = String(Math.min(1, Math.max(0, value)));
		}

		function captionIndex(s: Stage): number {
			if (s.sEFG < 0.999) return 0;
			if (s.dL1 < 0.999) return 1;
			if (s.dKL < 0.999) return 2;
			if (s.sZ < 0.999) return 3;
			if (s.oCurve < 0.5) return 4;
			return 5;
		}

		function render(s: Stage) {
			const { e, f, g, k, l, z } = casteljau(s.t);

			setDot('E', e, DOT_R * s.sEFG);
			setDot('F', f, DOT_R * s.sEFG);
			setDot('G', g, DOT_R * s.sEFG);
			setDot('K', k, DOT_R * s.sKL);
			setDot('L', l, DOT_R * s.sKL);
			setDot('Z', z, Z_R * s.sZ);

			setLineDraw('EF', e, f, s.dL1);
			setLineDraw('FG', f, g, s.dL1);
			setLineDraw('KL', k, l, s.dKL);

			// 라벨(텍스트)까지 함께 나타나도록 그룹 투명도를 등장 진행률에 묶는다.
			setOpacity('efg', s.sEFG);
			setOpacity('kldots', s.sKL);
			setOpacity('z', s.sZ);
			setOpacity('curve', s.oCurve);

			// t' 를 0..curveT 로 훑으며 지금까지 그려진 곡선(= Z 의 궤적)을 path 로 만든다.
			let d = `M ${A.x} ${A.y}`;
			for (let i = 1; i <= CURVE_STEPS; i += 1) {
				const tt = (s.curveT * i) / CURVE_STEPS;
				const p = casteljau(tt).z;
				d += ` L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
			}
			pathRef.current?.setAttribute('d', d);

			if (readoutRef.current) readoutRef.current.textContent = s.t.toFixed(2);
			if (captionRef.current) captionRef.current.textContent = CAPTIONS[captionIndex(s)];
		}

		const stage: Stage = { t: DEMO_T, sEFG: 0, dL1: 0, sKL: 0, dKL: 0, sZ: 0, oCurve: 0, curveT: 0 };

		const prefersReduced =
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (prefersReduced) {
			// 애니메이션 대신 완성된 상태를 바로 보여준다. sticky 스크롤 영역도 접는다.
			wrapperEl.style.height = 'auto';
			stickyEl.style.position = 'static';
			stickyEl.style.height = 'auto';
			render({ t: 0.7, sEFG: 1, dL1: 1, sKL: 1, dKL: 1, sZ: 1, oCurve: 1, curveT: 1 });
			return;
		}

		render(stage);
		gsap.registerPlugin(ScrollTrigger);

		// GSAP pin 대신 CSS position:sticky 를 쓰고, 스크롤 진행만 scrub 으로 연결한다.
		const tl = gsap.timeline({
			onUpdate: () => render(stage),
			scrollTrigger: {
				trigger: wrapperEl,
				start: 'top top',
				end: 'bottom bottom',
				// 작은 값이라 여전히 부드럽지만, 애니메이션이 스크롤을 바짝 따라와
				// sticky 해제 전에 곡선이 확실히 완성된다.
				scrub: 0.3
			}
		});

		tl
			// 1막: t = 0.25 에서 단계 ①~⑤ 를 하나씩 "그려" 나간다.
			.set(stage, { t: DEMO_T })
			.to(stage, { sEFG: 1, duration: 1, ease: 'back.out(1.6)' }) // ① 점 E·F·G 등장
			.to(stage, { dL1: 1, duration: 1.4, ease: 'power2.inOut' }) // ② EF·FG 선을 긋는다
			.to(stage, { sKL: 1, dKL: 1, duration: 1.4, ease: 'power2.inOut' }) // ③ K·L 등장 + KL 을 긋는다
			.to(stage, { sZ: 1, duration: 0.9, ease: 'back.out(2.2)' }) // ④ Z 등장
			.to(stage, { duration: 0.8 }) // ⑤ (설명 유지)
			// 2막: t 를 처음부터 끝까지 연속으로 훑어 곡선을 완성한다.
			.to(stage, { t: 0, duration: 0.7, ease: 'power1.inOut' }) // 반복을 위해 처음으로
			.to(stage, { oCurve: 1, duration: 0.3 })
			.to(stage, { t: 1, curveT: 1, duration: 4, ease: 'none' })
			// 완성된 곡선을 유지하는 hold — sticky 해제 전에 애니메이션이 확실히 끝나게 하고
			// scrub 지연도 이 구간에서 흡수한다.
			.to(stage, { duration: 2 });

		return () => {
			tl.scrollTrigger?.kill();
			tl.kill();
		};
	}, []);

	return (
		<div ref={wrapperRef} className={styles.wrapper}>
			<div ref={stickyRef} className={styles.sticky}>
				<div className={styles.card}>
					<svg className={styles.svg} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} role="img" aria-label="de Casteljau 알고리즘으로 그려지는 3차 베지어 곡선">
						{/* 제어점 다각형 (뼈대) */}
						<polyline className={styles.skeleton} points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y}`} />

						{/* 그려진 곡선 = Z 의 궤적 */}
						<g ref={(el) => { groupRefs.current.curve = el; }} style={{ opacity: 0 }}>
							<path ref={pathRef} className={styles.curve} d={`M ${A.x} ${A.y}`} />
						</g>

						{/* 1차 보조선 EF·FG (dashoffset 로 그어짐) */}
						<line ref={(el) => { lineRefs.current.EF = el; }} className={styles.level1Line} />
						<line ref={(el) => { lineRefs.current.FG = el; }} className={styles.level1Line} />

						{/* 2차 보조선 KL (dashoffset 로 그어짐) */}
						<line ref={(el) => { lineRefs.current.KL = el; }} className={styles.level2Line} />

						{/* 고정 제어점 A·B·C·D */}
						{([['A', A], ['B', B], ['C', C], ['D', D]] as const).map(([name, p]) => (
							<g key={name}>
								<circle className={styles.control} cx={p.x} cy={p.y} />
								<text className={styles.controlLabel} x={p.x + 10} y={p.y - 10}>{name}</text>
							</g>
						))}

						{/* 1차 보간점 E·F·G */}
						<g ref={(el) => { groupRefs.current.efg = el; }} style={{ opacity: 0 }}>
							{(['E', 'F', 'G'] as const).map((name) => (
								<g key={name}>
									<circle ref={(el) => { dotRefs.current[name] = el; }} className={styles.level1Dot} r={0} />
									<text ref={(el) => { labelRefs.current[name] = el; }} className={styles.level1Label}>{name}</text>
								</g>
							))}
						</g>

						{/* 2차 보간점 K·L */}
						<g ref={(el) => { groupRefs.current.kldots = el; }} style={{ opacity: 0 }}>
							{(['K', 'L'] as const).map((name) => (
								<g key={name}>
									<circle ref={(el) => { dotRefs.current[name] = el; }} className={styles.level2Dot} r={0} />
									<text ref={(el) => { labelRefs.current[name] = el; }} className={styles.level2Label}>{name}</text>
								</g>
							))}
						</g>

						{/* 곡선 위의 점 Z */}
						<g ref={(el) => { groupRefs.current.z = el; }} style={{ opacity: 0 }}>
							<circle ref={(el) => { dotRefs.current.Z = el; }} className={styles.pointZ} r={0} />
							<text ref={(el) => { labelRefs.current.Z = el; }} className={styles.pointZLabel}>Z</text>
						</g>
					</svg>

					<div className={styles.readout}>
						t = <span ref={readoutRef}>0.25</span>
					</div>
					<p ref={captionRef} className={styles.caption}>{CAPTIONS[0]}</p>
					<p className={styles.hint}>아래로 스크롤하면 단계가 하나씩 진행됩니다.</p>
				</div>
			</div>
		</div>
	);
}
