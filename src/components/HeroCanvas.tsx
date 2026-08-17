'use client';

/**
 * Hero 3D — one WebGL canvas, the real SpCas9 ternary complex (PDB 4OO8).
 * Protein = clearcoat + iridescence "lacquered pearl" reflecting the local
 * studio HDR (single pass — transmission/postprocessing were removed for perf,
 * do not re-add). Nucleic acid = bio teal.
 * Interactive: drag to rotate, pointer parallax, slow idle drift.
 * Renders only while in view; caller decides 3D vs static fallback.
 */
import { Suspense, useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, useGLTF } from '@react-three/drei';
import { Group, Mesh } from 'three';
import gsap from 'gsap';

const EXPO_OUT = 'expo.out';

const spinTarget = { v: 0 };
const dragging = { v: false, lastX: 0 };

function Molecule() {
	const { scene } = useGLTF('/hero-molecule.glb', '/draco/gltf/');
	const geoms = useMemo(() => {
		const out: { key: string; geometry: import('three').BufferGeometry; protein: boolean }[] = [];
		scene.traverse(o => {
			if (o instanceof Mesh) {
				const name = (o.material as { name?: string })?.name ?? '';
				out.push({ key: o.uuid, geometry: o.geometry, protein: name.startsWith('protein') });
			}
		});
		return out;
	}, [scene]);

	const tilt = useRef<Group>(null);
	const spin = useRef<Group>(null);

	// Entrance: matter condenses out of nothing
	useEffect(() => {
		if (!spin.current) return;
		spin.current.scale.setScalar(0.001);
		const tween = gsap.to(spin.current.scale, { x: 1, y: 1, z: 1, duration: 1.6, ease: EXPO_OUT, delay: 0.35 });
		return () => { tween.kill(); };
	}, []);

	useFrame((state, delta) => {
		if (!spin.current) return;
		spinTarget.v += delta * (dragging.v ? 0 : 0.08); // idle drift pauses under the user's hand
		const k = Math.min(1, delta * (dragging.v ? 14 : 3));
		spin.current.rotation.y += (spinTarget.v - spin.current.rotation.y) * k;
		if (tilt.current && !dragging.v) {
			const tx = state.pointer.y * -0.14;
			const tz = state.pointer.x * 0.08;
			tilt.current.rotation.x += (tx - tilt.current.rotation.x) * Math.min(1, delta * 3);
			tilt.current.rotation.z += (tz - tilt.current.rotation.z) * Math.min(1, delta * 3);
		}
	});

	return (
		<group ref={tilt} scale={1.15}>
			<Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.5}>
				<group ref={spin}>
					{geoms.map(g =>
						g.protein ? (
							<mesh key={g.key} geometry={g.geometry}>
								<meshPhysicalMaterial
									color="#5b76e6"
									roughness={0.22}
									metalness={0.1}
									clearcoat={1}
									clearcoatRoughness={0.16}
									iridescence={0.35}
									iridescenceIOR={1.3}
								/>
							</mesh>
						) : (
							<mesh key={g.key} geometry={g.geometry}>
								<meshStandardMaterial color="#25d0a6" emissive="#0d8f6d" emissiveIntensity={0.35} roughness={0.25} />
							</mesh>
						),
					)}
				</group>
			</Float>
		</group>
	);
}

function RenderLoop({ active }: { active: boolean }) {
	const invalidate = useThree(({ invalidate }) => invalidate);

	useEffect(() => {
		if (!active) return;
		let raf = 0;
		const tick = () => {
			invalidate();
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [active, invalidate]);

	return null;
}

export default function HeroCanvas() {
	const wrap = useRef<HTMLDivElement>(null);
	const [inView, setInView] = useState(true);
	const [grabbing, setGrabbing] = useState(false);
	const [showHint, setShowHint] = useState(true);

	// one WebGL context, gated on viewport visibility (perf contract §5)
	useEffect(() => {
		const el = wrap.current;
		if (!el) return;
		const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
		io.observe(el);
		return () => io.disconnect();
	}, []);

	const onDown = (e: PointerEvent<HTMLDivElement>) => {
		dragging.v = true;
		dragging.lastX = e.clientX;
		setGrabbing(true);
		setShowHint(false);
		e.currentTarget.setPointerCapture(e.pointerId);
	};
	const onMove = (e: PointerEvent<HTMLDivElement>) => {
		if (!dragging.v) return;
		spinTarget.v += (e.clientX - dragging.lastX) * 0.006;
		dragging.lastX = e.clientX;
	};
	const onUp = () => { dragging.v = false; setGrabbing(false); };
	const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
			e.preventDefault();
			spinTarget.v += e.key === 'ArrowLeft' ? -0.3 : 0.3;
			setShowHint(false);
		}
		if (e.key === 'Home') {
			e.preventDefault();
			spinTarget.v = 0;
			setShowHint(false);
		}
	};

	return (
		<div
			ref={wrap}
			className={`absolute inset-0 touch-pan-y ${grabbing ? 'cursor-grabbing' : 'cursor-grab'}`}
			role="img"
			aria-label="Interactive 3D model of the SpCas9 ternary complex. Drag to rotate, or use the left and right arrow keys."
			tabIndex={0}
			onPointerDown={onDown}
			onPointerMove={onMove}
			onPointerUp={onUp}
			onPointerCancel={onUp}
			onKeyDown={onKeyDown}
		>
			<Canvas
				frameloop="demand"
				dpr={[1, 1.5]}
				gl={{ antialias: true, alpha: true }}
				camera={{ position: [0.3, 0.15, 8.4], fov: 35 }}
			>
				<RenderLoop active={inView} />
				<ambientLight intensity={0.4} />
				<directionalLight position={[5, 6, 4]} intensity={1} />
				<Suspense fallback={null}>
					<Molecule />
					{/* local 380KB studio env — no CDN; IBL + clearcoat reflections in one pass */}
					<Environment files="/env/studio-512.hdr" />
				</Suspense>
			</Canvas>
			<div
				className={`pointer-events-none absolute bottom-8 right-8 rounded-full border border-ink/10 bg-white/70 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.2em] text-ink/45 backdrop-blur-sm transition-opacity duration-500 ${showHint ? 'opacity-100' : 'opacity-0'}`}
			>
				DRAG TO ROTATE
			</div>
		</div>
	);
}
