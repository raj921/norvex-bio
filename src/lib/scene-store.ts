'use client';

/**
 * Tiny external store shared between the DOM and the single persistent WebGL
 * canvas. Scroll-driven values are written here at 60fps WITHOUT triggering
 * React renders — the r3f frame loop reads `sceneState` directly. Only the
 * discrete `phase`/`ready` values are exposed as subscribable React state.
 */
import { useSyncExternalStore } from 'react';

export type ScenePhase = 'hero' | 'manifesto' | 'science' | 'pipeline' | 'platform' | 'impact' | 'contact';

/** Mutable, render-free channel: written by scroll/pointer, read inside useFrame. */
export const sceneState = {
	/** 0 → 1 progress through the whole document. */
	scroll: 0,
	/** Normalized pointer, -1 → 1 on both axes. */
	pointerX: 0,
	pointerY: 0,
	/** Section-local progress, 0 → 1, for the currently pinned section. */
	sectionProgress: 0,
	/** Index of the active pipeline step, set by the horizontal rail. */
	pipelineStep: 0,
	/** Index of the active platform discipline. */
	platformIndex: 0,
	/** Extra spin injected by dragging the hero molecule. */
	dragSpin: 0,
	/** True while the visitor is actively dragging the model. */
	dragging: false,
};

type Snapshot = { phase: ScenePhase; ready: boolean; reveal: boolean };

let snapshot: Snapshot = { phase: 'hero', ready: false, reveal: false };
const listeners = new Set<() => void>();

function emit() {
	listeners.forEach(listener => listener());
}

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

const getSnapshot = () => snapshot;
const getServerSnapshot = (): Snapshot => ({ phase: 'hero', ready: false, reveal: false });

export function setPhase(phase: ScenePhase) {
	if (snapshot.phase === phase) return;
	snapshot = { ...snapshot, phase };
	emit();
}

/** Called once the preloader finishes: unlocks scroll and starts entrance motion. */
export function setReady(ready: boolean) {
	if (snapshot.ready === ready) return;
	snapshot = { ...snapshot, ready };
	emit();
}

/** Set when the 3D scene has actually drawn its first frame. */
export function setReveal(reveal: boolean) {
	if (snapshot.reveal === reveal) return;
	snapshot = { ...snapshot, reveal };
	emit();
}

export function useScene() {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
