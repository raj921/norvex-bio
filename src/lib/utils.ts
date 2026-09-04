import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Tailwind-aware class composer used by every component in the redesign. */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Maps a value from one range to another, clamped. */
export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
	if (inMax === inMin) return outMin;
	return outMin + clamp((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}
