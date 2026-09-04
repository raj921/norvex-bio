'use client';

/**
 * Ambient residue field — a slow drift of points around the specimen that gives
 * the dark canvas depth and parallax. Deterministic seeding (no Math.random at
 * module scope) so SSR and client agree and the layout never pops.
 */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, type Points as ThreePoints } from 'three';
import { sceneState } from '@/lib/scene-store';
import { mapRange } from '@/lib/utils';

const COUNT = 900;

/** Mulberry32 — tiny deterministic PRNG. */
function makeRandom(seed: number) {
	let a = seed;
	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export function ResidueField() {
	const points = useRef<ThreePoints>(null);

	const positions = useMemo(() => {
		const random = makeRandom(0x4008);
		const array = new Float32Array(COUNT * 3);
		for (let i = 0; i < COUNT; i += 1) {
			// Spherical shell with jitter — denser near the centre, sparse at the edge.
			const radius = 3.2 + Math.pow(random(), 0.6) * 7.5;
			const theta = random() * Math.PI * 2;
			const phi = Math.acos(2 * random() - 1);
			array[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
			array[i * 3 + 1] = Math.cos(phi) * radius * 0.7;
			array[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius - 2;
		}
		return array;
	}, []);

	useFrame((_, rawDelta) => {
		const delta = Math.min(rawDelta, 1 / 30);
		const group = points.current;
		if (!group) return;
		group.rotation.y += delta * 0.02;
		group.rotation.x += (sceneState.pointerY * 0.05 - group.rotation.x) * Math.min(1, delta * 1.5);
		// Field thins out as the page descends so late sections stay legible.
		const material = group.material as { opacity: number };
		material.opacity = mapRange(sceneState.scroll, 0, 0.75, 0.55, 0.12);
	});

	return (
		<points ref={points}>
			<bufferGeometry>
				<bufferAttribute attach="attributes-position" args={[positions, 3]} />
			</bufferGeometry>
			<pointsMaterial
				size={0.035}
				sizeAttenuation
				color="#8fa5ff"
				transparent
				opacity={0.55}
				depthWrite={false}
				blending={AdditiveBlending}
			/>
		</points>
	);
}
