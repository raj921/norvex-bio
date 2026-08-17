/**
 * Hero molecule pipeline — Norvex Bio
 * Fetches a real protein structure (SpCas9 ternary complex, RCSB PDB 4OO8),
 * builds a stylized "pearl strand" GLB (Cα trace + nucleic-acid backbone),
 * Draco-compresses via gltf-transform CLI.
 *
 * Run: npm run build:molecule
 * Self-check: asserts at the bottom fail loudly if the data or budget breaks.
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { rmSync, statSync, mkdirSync } from 'node:fs';
import { Document, NodeIO } from '@gltf-transform/core';

const PDB_ID = '4OO8';
const PROTEIN_CHAIN = 'A';
const OUT_RAW = 'public/hero-molecule-raw.glb';
const OUT = 'public/hero-molecule.glb';
const MAX_BYTES = 1.5 * 1024 * 1024; // budget from ASSET-RESEARCH.md §4D

// ---------- 1. Fetch + parse PDB (fixed-width columns, legacy format spec) ----------
const res = await fetch(`https://files.rcsb.org/download/${PDB_ID}.pdb`);
assert.ok(res.ok, `PDB fetch failed: ${res.status}`);
const pdb = await res.text();

/** @type {{protein: number[][], nucleic: number[][]}} */
const pts = { protein: [], nucleic: [] };
const seen = new Set();
for (const line of pdb.split('\n')) {
	if (!line.startsWith('ATOM')) continue;
	const atom = line.slice(12, 16).trim();
	const chain = line[21];
	const isCA = atom === 'CA' && chain === PROTEIN_CHAIN;
	const isPhosphate = atom === 'P' && chain !== PROTEIN_CHAIN;
	if (!isCA && !isPhosphate) continue;
	const key = line.slice(17, 27); // resName+chain+resSeq → dedupe alt-locs
	if (seen.has(key)) continue;
	seen.add(key);
	const x = parseFloat(line.slice(30, 38));
	const y = parseFloat(line.slice(38, 46));
	const z = parseFloat(line.slice(46, 54));
	assert.ok(Number.isFinite(x + y + z), `non-finite coord in: ${line}`);
	(isCA ? pts.protein : pts.nucleic).push([x, y, z]);
}
assert.ok(pts.protein.length > 1000, `protein Cα trace too short: ${pts.protein.length}`);
assert.ok(pts.nucleic.length > 60, `nucleic backbone too short: ${pts.nucleic.length}`);

// ---------- 2. Center + normalize scale (max extent = 4 world units) ----------
const all = [...pts.protein, ...pts.nucleic];
const min = [Infinity, Infinity, Infinity];
const max = [-Infinity, -Infinity, -Infinity];
for (const p of all) for (let i = 0; i < 3; i++) {
	min[i] = Math.min(min[i], p[i]); max[i] = Math.max(max[i], p[i]);
}
const center = min.map((v, i) => (v + max[i]) / 2);
const extent = Math.max(max[0] - min[0], max[1] - min[1], max[2] - min[2]);
const scale = 4 / extent;
const norm = ([x, y, z]) => [(x - center[0]) * scale, (y - center[1]) * scale, (z - center[2]) * scale];

// ---------- 3. Icosphere generator (unit sphere, subdivision detail 1) ----------
function icosphere() {
	const t = (1 + Math.sqrt(5)) / 2;
	let verts = [
		[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
		[0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
		[t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
	].map(v => { const l = Math.hypot(...v); return v.map(c => c / l); });
	let faces = [
		[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9],
		[5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2],
		[3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10],
		[8, 6, 7], [9, 8, 1],
	];
	// one midpoint subdivision
	const cache = new Map();
	const mid = (a, b) => {
		const k = a < b ? `${a}_${b}` : `${b}_${a}`;
		if (cache.has(k)) return cache.get(k);
		const v = verts[a].map((c, i) => c + verts[b][i]);
		const l = Math.hypot(...v);
		verts.push(v.map(c => c / l));
		cache.set(k, verts.length - 1);
		return verts.length - 1;
	};
	faces = faces.flatMap(([a, b, c]) => {
		const ab = mid(a, b), bc = mid(b, c), ca = mid(c, a);
		return [[a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]];
	});
	return { verts, faces };
}
const sphere = icosphere(); // 42 verts / 80 tris

/** Merge one sphere instance per point into flat typed arrays. */
function pearls(points, radius) {
	const pos = new Float32Array(points.length * sphere.verts.length * 3);
	const nrm = new Float32Array(points.length * sphere.verts.length * 3);
	const idx = new Uint32Array(points.length * sphere.faces.length * 3);
	for (let i = 0; i < points.length; i++) {
		const [cx, cy, cz] = points[i];
		const vo = i * sphere.verts.length;
		for (let v = 0; v < sphere.verts.length; v++) {
			const s = sphere.verts[v];
			pos.set([cx + s[0] * radius, cy + s[1] * radius, cz + s[2] * radius], (vo + v) * 3);
			nrm.set(s, (vo + v) * 3); // unit sphere offsets are already unit normals
		}
		for (let f = 0; f < sphere.faces.length; f++) {
			const o = (i * sphere.faces.length + f) * 3;
			idx[o] = vo + sphere.faces[f][0];
			idx[o + 1] = vo + sphere.faces[f][1];
			idx[o + 2] = vo + sphere.faces[f][2];
		}
	}
	return { pos, normals: nrm, idx };
}

// ---------- 4. Build GLB ----------
const doc = new Document();
const buffer = doc.createBuffer();
const addPart = (name, mesh, rgb) => {
	const nrm = doc.createAccessor().setType('VEC3').setArray(mesh.normals).setBuffer(buffer);
	const prim = doc.createPrimitive()
		.setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(mesh.pos).setBuffer(buffer))
		.setAttribute('NORMAL', nrm)
		.setIndices(doc.createAccessor().setType('SCALAR').setArray(mesh.idx).setBuffer(buffer))
		.setMaterial(doc.createMaterial(name + '_mat')
			.setBaseColorFactor([...rgb, 1])
			.setRoughnessFactor(0.28)
			.setMetallicFactor(0.05));
	const m = doc.createMesh(name);
	m.addPrimitive(prim);
	return m;
};
const scene = doc.createScene('hero');
// Radii in Å, then converted by the same normalization scale (3.8Å Cα spacing → overlapping pearls, reads as one structure)
const proteinMesh = addPart('protein', pearls(pts.protein.map(norm), 2.3 * scale), [0.24, 0.39, 0.95]); // accent #3E63F2
const nucleicMesh = addPart('nucleic', pearls(pts.nucleic.map(norm), 2.7 * scale), [0.15, 0.82, 0.65]); // bio #25D0A6
for (const m of [proteinMesh, nucleicMesh]) scene.addChild(doc.createNode().setMesh(m));
// Scene root must be attached
doc.getRoot().setDefaultScene(scene);

mkdirSync('public', { recursive: true });
const io = new NodeIO();
await io.write(OUT_RAW, doc);

// ---------- 5. Draco-compress ----------
execFileSync('node_modules/.bin/gltf-transform', [
	'optimize', OUT_RAW, OUT,
	'--compress', 'draco', '--simplify', 'false', '--texture-compress', 'false',
], { stdio: 'inherit' });

// ---------- 6. Self-check (the one runnable check for this logic) ----------
const bytes = statSync(OUT).size;
assert.ok(bytes < MAX_BYTES, `GLB over budget: ${bytes} > ${MAX_BYTES}`);
// verify geometry on the raw file — reading the compressed one needs the draco extension registered
const check = await new NodeIO().read(OUT_RAW);
const totalVerts = check.getRoot().listMeshes()
	.flatMap(m => m.listPrimitives())
	.reduce((n, p) => n + (p.getAttribute('POSITION')?.getCount() ?? 0), 0);
assert.equal(check.getRoot().listMaterials().length, 2, 'expected 2 materials');
assert.ok(totalVerts > 40_000, `vertex count low: ${totalVerts}`);
rmSync(OUT_RAW); // keep the 3MB intermediate out of the deployable public/
console.log(`✓ ${PDB_ID}: ${pts.protein.length} Cα + ${pts.nucleic.length} P → ${totalVerts.toLocaleString()} verts, ${(bytes / 1024).toFixed(0)}KB (${OUT})`);
