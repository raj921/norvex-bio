'use client';

/**
 * The single persistent WebGL canvas for the entire site.
 *
 * Perf contract:
 * · Exactly one context, fixed behind the DOM, never remounted between sections.
 * · Paused (frameloop stops invalidating) whenever the tab is hidden.
 * · dpr capped at 1.5; postprocessing is bloom-only — no SSAO/DOF/transmission.
 * · Never mounted at all for coarse pointers, low memory, or reduced motion;
 *   those visitors get the SVG fallback instead (see SceneFallback).
 */
import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, AdaptiveDpr, Preload } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';
import { Molecule } from './Molecule';
import { ResidueField } from './ResidueField';
import { sceneState } from '@/lib/scene-store';

/** Drives the demand frameloop, and stops entirely when the tab is backgrounded. */
function RenderLoop() {
	const invalidate = useThree(state => state.invalidate);
	useEffect(() => {
		let raf = 0;
		let running = true;
		const tick = () => {
			if (!running) return;
			invalidate();
			raf = requestAnimationFrame(tick);
		};
		const start = () => {
			if (running) return;
			running = true;
			raf = requestAnimationFrame(tick);
		};
		const stop = () => {
			running = false;
			cancelAnimationFrame(raf);
		};
		const onVisibility = () => (document.hidden ? stop() : start());
		raf = requestAnimationFrame(tick);
		document.addEventListener('visibilitychange', onVisibility);
		return () => {
			stop();
			document.removeEventListener('visibilitychange', onVisibility);
		};
	}, [invalidate]);
	return null;
}

export default function Scene() {
	const [dragging, setDragging] = useState(false);
	const lastX = useRef(0);

	// Drag-to-spin is captured on the wrapper, not the canvas, so the DOM copy
	// layered above the scene keeps its own pointer events.
	useEffect(() => {
		const onUp = () => {
			sceneState.dragging = false;
			setDragging(false);
		};
		window.addEventListener('pointerup', onUp);
		window.addEventListener('pointercancel', onUp);
		return () => {
			window.removeEventListener('pointerup', onUp);
			window.removeEventListener('pointercancel', onUp);
		};
	}, []);

	return (
		<div
			className="fixed inset-0 z-0"
			data-scene-root
			style={{ cursor: dragging ? 'grabbing' : undefined }}
			onPointerDown={event => {
				lastX.current = event.clientX;
				sceneState.dragging = true;
				setDragging(true);
			}}
			onPointerMove={event => {
				if (!sceneState.dragging) return;
				sceneState.dragSpin += (event.clientX - lastX.current) * 0.0006;
				lastX.current = event.clientX;
			}}
		>
			<Canvas
				frameloop="demand"
				dpr={[1, 1.5]}
				gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
				camera={{ position: [0, 0, 9], fov: 34 }}
			>
				<RenderLoop />
				<AdaptiveDpr pixelated={false} />
				<ambientLight intensity={0.35} />
				<directionalLight position={[5, 6, 4]} intensity={1.1} />
				<pointLight position={[-6, -2, 3]} intensity={12} color="#25d0a6" distance={18} decay={2} />
				<Suspense fallback={null}>
					<Molecule />
					<ResidueField />
					{/* Local 380KB studio HDR — no runtime CDN fetch. */}
					<Environment files="/env/studio-512.hdr" />
					<Preload all />
				</Suspense>
				<EffectComposer enableNormalPass={false}>
					<Bloom intensity={0.55} luminanceThreshold={0.62} luminanceSmoothing={0.25} kernelSize={KernelSize.LARGE} mipmapBlur />
					<Vignette offset={0.28} darkness={0.62} />
				</EffectComposer>
			</Canvas>
		</div>
	);
}
