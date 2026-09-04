'use client';

/**
 * The specimen: the real SpCas9 ternary complex (PDB 4OO8), built into a
 * "pearl strand" GLB by scripts/build-molecule.mjs.
 *
 * It is the through-line of the whole page — one instance, never unmounted.
 * Scroll drives its position, scale, rotation and material state through
 * `sceneState`, so scrolling reads as one continuous camera move around a
 * single object rather than seven disconnected section visuals.
 */
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, type BufferGeometry } from 'three';
import gsap from 'gsap';
import { sceneState, setReveal } from '@/lib/scene-store';
import { mapRange } from '@/lib/utils';
import { prefersReducedMotion } from '@/lib/motion';

/** Per-phase choreography, keyed to global scroll progress (0 → 1). */
const KEYS = [
	// scroll, posX, posY, posZ, scale, rotX, rotZ
	{ at: 0.0, x: 1.5, y: 0.0, z: 0, s: 1.15, rx: 0.0, rz: 0.0 },
	{ at: 0.14, x: 0.0, y: -0.3, z: -1.6, s: 0.85, rx: 0.25, rz: 0.15 },
	{ at: 0.3, x: -1.7, y: 0.1, z: -0.6, s: 1.0, rx: -0.15, rz: -0.2 },
	{ at: 0.48, x: 1.6, y: 0.15, z: -0.4, s: 0.95, rx: 0.2, rz: 0.18 },
	{ at: 0.68, x: -1.5, y: -0.1, z: -1.0, s: 0.9, rx: -0.22, rz: 0.1 },
	{ at: 0.85, x: 0.2, y: 0.2, z: -2.2, s: 1.25, rx: 0.1, rz: -0.12 },
	{ at: 1.0, x: 0.0, y: 0.0, z: -0.8, s: 1.05, rx: 0.0, rz: 0.0 },
];

function sample(progress: number) {
	let a = KEYS[0];
	let b = KEYS[KEYS.length - 1];
	for (let i = 0; i < KEYS.length - 1; i += 1) {
		if (progress >= KEYS[i].at && progress <= KEYS[i + 1].at) {
			a = KEYS[i];
			b = KEYS[i + 1];
			break;
		}
	}
	const span = b.at - a.at || 1;
	const raw = (progress - a.at) / span;
	// Smoothstep between keys so the object never changes direction abruptly.
	const t = raw * raw * (3 - 2 * raw);
	return {
		x: a.x + (b.x - a.x) * t,
		y: a.y + (b.y - a.y) * t,
		z: a.z + (b.z - a.z) * t,
		s: a.s + (b.s - a.s) * t,
		rx: a.rx + (b.rx - a.rx) * t,
		rz: a.rz + (b.rz - a.rz) * t,
	};
}

export function Molecule() {
	const { scene } = useGLTF('/hero-molecule.glb', '/draco/gltf/');

	const parts = useMemo(() => {
		const out: { key: string; geometry: BufferGeometry; protein: boolean }[] = [];
		scene.traverse(object => {
			if (object instanceof Mesh) {
				const name = (object.material as { name?: string })?.name ?? '';
				out.push({ key: object.uuid, geometry: object.geometry, protein: name.startsWith('protein') });
			}
		});
		return out;
	}, [scene]);

	const root = useRef<Group>(null);
	const spinner = useRef<Group>(null);
	const proteinMaterial = useRef<MeshPhysicalMaterial>(null);
	const nucleicMaterial = useRef<MeshStandardMaterial>(null);
	const spin = useRef(0);
	const bob = useRef(0);

	// Entrance: matter condenses out of nothing once the preloader clears.
	useEffect(() => {
		const group = root.current;
		if (!group) return;
		setReveal(true);
		if (prefersReducedMotion()) {
			group.scale.setScalar(1);
			return;
		}
		group.scale.setScalar(0.001);
		const tween = gsap.to(group.scale, { x: 1, y: 1, z: 1, duration: 1.8, ease: 'expo.out', delay: 0.15 });
		return () => { tween.kill(); };
	}, []);

	useFrame((_, rawDelta) => {
		const delta = Math.min(rawDelta, 1 / 30);
		const group = root.current;
		const spinGroup = spinner.current;
		if (!group || !spinGroup) return;

		const target = sample(sceneState.scroll);

		// Pointer parallax, damped so it trails the cursor rather than snapping.
		const px = sceneState.pointerX * 0.35;
		const py = sceneState.pointerY * 0.22;

		const k = Math.min(1, delta * 2.6);
		group.position.x += (target.x + px - group.position.x) * k;
		group.position.y += (target.y - py - group.position.y) * k;
		group.position.z += (target.z - group.position.z) * k;

		const scale = group.scale.x;
		const nextScale = scale + (target.s - scale) * k;
		group.scale.setScalar(nextScale);

		group.rotation.x += (target.rx - sceneState.pointerY * 0.12 - group.rotation.x) * k;
		group.rotation.z += (target.rz + sceneState.pointerX * 0.06 - group.rotation.z) * k;

		// Continuous idle spin, paused under the visitor's hand; drag adds to it.
		if (!sceneState.dragging) spin.current += delta * 0.14;
		spin.current += sceneState.dragSpin;
		sceneState.dragSpin *= 0.82;
		spinGroup.rotation.y += (spin.current - spinGroup.rotation.y) * Math.min(1, delta * (sceneState.dragging ? 16 : 4));

		// Gentle vertical bob — the "alive" tell without a Float wrapper.
		bob.current += delta * 0.6;
		spinGroup.position.y = Math.sin(bob.current) * 0.06;

		// Material state travels with the page: cool lacquer in the intro, hotter
		// iridescence and emissive teal through the platform/impact sections.
		const heat = mapRange(sceneState.scroll, 0.35, 0.9, 0, 1);
		if (proteinMaterial.current) {
			proteinMaterial.current.iridescence = 0.3 + heat * 0.5;
			proteinMaterial.current.clearcoatRoughness = 0.18 - heat * 0.1;
		}
		if (nucleicMaterial.current) {
			nucleicMaterial.current.emissiveIntensity = 0.3 + heat * 0.75;
		}
	});

	return (
		<group ref={root} scale={0.001}>
			<group ref={spinner}>
				{parts.map(part =>
					part.protein ? (
						<mesh key={part.key} geometry={part.geometry}>
							<meshPhysicalMaterial
								ref={proteinMaterial}
								color="#5b76e6"
								roughness={0.2}
								metalness={0.12}
								clearcoat={1}
								clearcoatRoughness={0.16}
								iridescence={0.35}
								iridescenceIOR={1.32}
								sheen={0.4}
								sheenColor="#8fa5ff"
							/>
						</mesh>
					) : (
						<mesh key={part.key} geometry={part.geometry}>
							<meshStandardMaterial
								ref={nucleicMaterial}
								color="#25d0a6"
								emissive="#0d8f6d"
								emissiveIntensity={0.35}
								roughness={0.24}
								metalness={0.05}
							/>
						</mesh>
					),
				)}
			</group>
		</group>
	);
}

useGLTF.preload('/hero-molecule.glb', '/draco/gltf/');
