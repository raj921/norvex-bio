/**
 * Shrink a Radiance RGBE .hdr by 2x (box-filtered, linear-light).
 * Poly Haven 1k studio HDRs are ~1.5MB — too heavy for the page budget.
 * A 512x256 env is visually identical once PMREM blurs it, at ~25% the bytes.
 * For an env map (not background), 512 is well above Nyquist for a blurred conv.
 *
 * Run: node scripts/shrink-hdr.mjs
 */
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, statSync } from 'node:fs';

const SRC = 'scripts/assets-src/studio_small_08_1k.hdr';
const OUT = 'public/env/studio-512.hdr';

// ---------- parse ----------
const buf = readFileSync(SRC);
let p = 0;
const line = () => { let s = ''; while (buf[p] !== 0x0a) s += String.fromCharCode(buf[p++]); p++; return s; };
assert.ok(line().startsWith('#?RADIANCE'), 'not a radiance file');
let res = '';
while ((res = line()).length > 0) assert.ok(!res.startsWith('FORMAT') || res.includes('rle_rgbe'), `unexpected format: ${res}`);
const resLine = line();
const m = resLine.match(/-Y (\d+) \+X (\d+)/);
assert.ok(m, `bad resolution line: ${resLine}`);
const W = +m[2], H = +m[1];

// RLE scanlines: [2,2,hi,lo] marker, then 4 planes (rgbe) of RLE packets
function readScanline(y) {
	const out = new Uint8Array(W * 4);
	assert.ok(buf[p] === 2 && buf[p + 1] === 2, `non-RLE scanline at ${y}`);
	p += 4;
	for (let c = 0; c < 4; c++) {
		let x = 0;
		while (x < W) {
			const count = buf[p++];
			if (count > 128) { const run = buf[p++], n = count - 128; for (let k = 0; k < n; k++) out[c + (x + k) * 4] = run; x += n; }
			else { for (let i = 0; i < count; i++) out[c + (x + i) * 4] = buf[p++]; x += count; }
		}
		assert.ok(x === W, `scanline ${y} plane ${c} overrun`);
	}
	return out;
}

/** RGBE → linear float [r,g,b] per pixel */
const px = new Float32Array(W * H * 3);
for (let y = 0; y < H; y++) {
	const sl = readScanline(y);
	for (let x = 0; x < W; x++) {
		const i = x * 4; // sl is one scanline — no y offset
		const e = Math.pow(2, sl[i + 3] - 136);
		px[(y * W + x) * 3 + 0] = (sl[i] + 0.5) * e;
		px[(y * W + x) * 3 + 1] = (sl[i + 1] + 0.5) * e;
		px[(y * W + x) * 3 + 2] = (sl[i + 2] + 0.5) * e;
	}
}
assert.ok(p === buf.length, `trailing bytes: ${buf.length - p}`);

// ---------- 2x2 box downsample (linear light, equirect wrap on X) ----------
const w2 = W / 2, h2 = H / 2;
const out = new Float32Array(w2 * h2 * 3);
for (let y = 0; y < h2; y++) {
	for (let x = 0; x < w2; x++) {
		const at = (yy, xx) => (((yy) % H) * W + (xx % W)) * 3;
		const idx = [at(y * 2, x * 2), at(y * 2 + 1, x * 2), at(y * 2, x * 2 + 1), at(y * 2 + 1, x * 2 + 1)];
		for (let c = 0; c < 3; c++) {
			out[(y * w2 + x) * 3 + c] = idx.reduce((s, si) => s + px[si + c], 0) / 4;
		}
	}
}

// ---------- encode ----------
// Inverse of the decoder above: value = (byte + 0.5) · 2^(E-136).
// Pick E so the largest channel lands near byte 255 → full mantissa precision.
function rgbe(r, g, b) {
	const max = Math.max(r, g, b, 1e-9);
	const E = Math.max(1, Math.min(255, Math.ceil(136 + Math.log2(max) - Math.log2(255.5))));
	const f = Math.pow(2, 136 - E);
	return [Math.min(255, Math.max(0, r * f - 0.5)), Math.min(255, Math.max(0, g * f - 0.5)), Math.min(255, Math.max(0, b * f - 0.5)), E];
}

// RLE per plane: runs of ≥4 identical bytes, else literals (packets ≤128)
function rlePlane(bytes, W2) {
	const chunks = [];
	let i = 0;
	while (i < W2) {
		let run = 1;
		while (run < 127 && i + run < W2 && bytes[i + run] === bytes[i]) run++;
		if (run >= 4) {
			chunks.push(Buffer.from([run + 128, bytes[i]]));
			i += run;
		} else {
			let j = i + 1; // ≥1 literal byte — a run at i was already ruled out
			while (j < W2 && j - i < 127) {
				let r = 1;
				while (r < 4 && j + r < W2 && bytes[j + r] === bytes[j]) r++;
				if (r === 4) break; // a run starts at j — stop the literal here
				j++;
			}
			chunks.push(Buffer.from([j - i, ...bytes.slice(i, j)]));
			i = j;
		}
	}
	const out = Buffer.concat(chunks);
	// self-check: walk our own packets and reconstruct
	let q = 0, x = 0;
	const recon = [];
	while (x < W2) {
		const n = out[q++];
		if (n > 128) { const v = out[q++], len = n - 128; for (let k = 0; k < len; k++) recon.push(v); x += len; }
		else { for (let k = 0; k < n; k++) recon.push(out[q++]); x += n; }
	}
	assert.equal(q, out.length, `packet stream has ${out.length - q} trailing bytes; packets=${JSON.stringify([...out])} plane=${JSON.stringify([...bytes.slice(0, 16)])}…`);
	assert.ok(recon.every((v, k) => v === bytes[k]), `reconstruction mismatch at ${recon.findIndex((v, k) => v !== bytes[k])}: recon=${JSON.stringify(recon.slice(0, 12))} bytes=${JSON.stringify([...bytes.slice(0, 12)])} out=${JSON.stringify([...out.slice(0, 12)])}`);
	return out;
}

const planes = [new Uint8Array(w2 * h2), new Uint8Array(w2 * h2), new Uint8Array(w2 * h2), new Uint8Array(w2 * h2)];
for (let i = 0; i < w2 * h2; i++) {
	const [r, g, b, e] = rgbe(out[i * 3], out[i * 3 + 1], out[i * 3 + 2]);
	planes[0][i] = r; planes[1][i] = g; planes[2][i] = b; planes[3][i] = e;
}
const parts = [Buffer.from(`#?RADIANCE\nFORMAT=32-bit_rle_rgbe\n\n-Y ${h2} +X ${w2}\n`)];
for (let y = 0; y < h2; y++) {
	const marker = Buffer.from([2, 2, w2 >> 8, w2 & 0xff]);
	parts.push(marker, rlePlane(planes[0].subarray(y * w2, (y + 1) * w2), w2), rlePlane(planes[1].subarray(y * w2, (y + 1) * w2), w2), rlePlane(planes[2].subarray(y * w2, (y + 1) * w2), w2), rlePlane(planes[3].subarray(y * w2, (y + 1) * w2), w2));
}
writeFileSync(OUT, Buffer.concat(parts));

// ---------- self-check: reparse, dims + luminance continuity ----------
const check = readFileSync(OUT);
assert.ok(check.subarray(0, 10).toString() === '#?RADIANCE', 'output header');
const sm = check.toString('latin1').match(/-Y (\d+) \+X (\d+)/);
assert.equal(`${+sm[1]}x${+sm[2]}`, `${h2}x${w2}`, 'output dims');
const bytes = statSync(OUT).size;
assert.ok(bytes < 600 * 1024, `shrunk HDR over 600KB: ${bytes}`);

// exact round-trip: decode OUT back and compare every plane byte to what we encoded
{
	const rb = readFileSync(OUT);
	let q = 0;
	const skip = () => { while (rb[q] !== 0x0a) q++; q++; };
	skip();
	while (rb[q] !== 0x0a) skip();
	q++; // header + blank line; q now at the resolution line
	const [hh, ww] = rb.toString('latin1').match(/-Y (\d+) \+X (\d+)/).slice(1).map(Number);
	assert.equal(`${hh}x${ww}`, `${h2}x${w2}`, 'output dims');
	skip(); // resolution line
	let mismatch = 0;
	for (let y = 0; y < hh; y++) {
		assert.ok(rb[q] === 2 && rb[q + 1] === 2, `bad marker at scanline ${y}`);
		q += 4;
		for (let c = 0; c < 4; c++) {
			for (let x = 0; x < ww;) {
				const n = rb[q++];
				if (n > 128) { const v = rb[q++], len = n - 128; for (let k = 0; k < len; k++) if (planes[c][y * ww + x + k] !== v) mismatch++; x += len; }
				else { for (let k = 0; k < n; k++) { if (planes[c][y * ww + x + k] !== rb[q + k]) mismatch++; } q += n; x += n; }
			}
		}
	}
	assert.equal(mismatch, 0, `round-trip mismatches: ${mismatch}`);
	// luminance continuity vs source — catches a source-decode bug round-trip can't
	const lumsOf = (file) => {
		const b = readFileSync(file);
		let k = 0;
		const eat = () => { while (b[k] !== 0x0a) k++; k++; };
		eat(); while (b[k] !== 0x0a) eat(); eat(); eat(); // header, blank, resolution
		const [hh2, ww2] = b.toString('latin1').match(/-Y (\d+) \+X (\d+)/).slice(1).map(Number);
		const lums = [];
		for (let y = 0; y < hh2; y++) {
			k += 4;
			const plane = () => { const o = new Uint8Array(ww2); let x = 0; while (x < ww2) { const n = b[k++]; if (n > 128) { const v = b[k++]; for (let i = 0; i < n - 128; i++) o[x + i] = v; x += n - 128; } else { for (let i = 0; i < n; i++) o[x + i] = b[k++]; x += n; } } return o; };
			const [R, G, B, E] = [plane(), plane(), plane(), plane()];
			for (let x = 0; x < ww2; x++) {
				const e = Math.pow(2, E[x] - 136);
				lums.push((0.2126 * R[x] + 0.7152 * G[x] + 0.0722 * B[x]) * e);
			}
		}
		return lums.sort((a, b2) => a - b2);
	};
	const src = lumsOf(SRC), dst = lumsOf(OUT);
	for (const f of [0.5, 0.95]) {
		const s = src[Math.floor(f * (src.length - 1))], d = dst[Math.floor(f * (dst.length - 1))];
		const drift = Math.abs(d - s) / Math.max(1e-9, s);
		assert.ok(drift < 0.15, `luminance drift at p${f * 100}: ${(drift * 100).toFixed(1)}%`);
	}
}
console.log(`✓ ${W}x${H} (${(buf.length / 1024).toFixed(0)}KB) → ${w2}x${h2} (${(bytes / 1024).toFixed(0)}KB), exact round-trip — ${OUT}`);
