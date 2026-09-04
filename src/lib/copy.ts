/**
 * Single source of content for the whole site. Rebrand by editing this file only.
 * Norvex Bio: fictional AI-guided protein design company.
 */
export const copy = {
	company: 'Norvex Bio',
	siteTitle: 'Norvex Bio — AI-guided protein design',
	siteDescription:
		'Norvex Bio designs proteins that nature never got to. A generative platform for de novo therapeutics, from target to clinic.',

	nav: {
		links: [
			{ label: 'Manifesto', href: '#manifesto', index: '01' },
			{ label: 'Science', href: '#science', index: '02' },
			{ label: 'Pipeline', href: '#pipeline', index: '03' },
			{ label: 'Platform', href: '#platform', index: '04' },
			{ label: 'Impact', href: '#impact', index: '05' },
		],
		cta: 'Partner with us',
	},

	preloader: {
		label: 'INITIALIZING FOLD ENGINE',
		steps: ['LOADING STRUCTURE 4OO8', 'BUILDING RESIDUE FIELD', 'COMPILING SHADERS', 'READY'],
	},

	hero: {
		kicker: 'AI-guided protein design',
		headline: ['Proteins', 'nature never', 'made.'],
		italicWord: 'never',
		sub: 'We design and validate de novo proteins, turning decade-long discovery programs into months of measured iteration.',
		primaryCta: 'Explore the platform',
		secondaryCta: 'Read the science',
		specimen: 'SPCAS9 TERNARY COMPLEX · PDB 4OO8 · 1,301 RESIDUES',
		readout: [
			{ label: 'STRUCTURE', value: '4OO8' },
			{ label: 'RESIDUES', value: '1,301' },
			{ label: 'MODE', value: 'DE NOVO' },
			{ label: 'INPUT', value: 'TARGET' },
		],
	},

	ticker: [
		'DE NOVO BINDERS',
		'DIFFUSION BACKBONES',
		'SUB-ANGSTROM SCORING',
		'AFFINITY MATURATION',
		'DEVELOPABILITY BY DESIGN',
		'48H MODEL RETRAIN',
		'PDB 4OO8',
	],

	manifesto: {
		id: 'manifesto',
		kicker: 'Manifesto',
		// Highlighted word-by-word as the section scrolls through the viewport.
		body: 'Evolution had four billion years and one objective function: survival. It never optimized for a drug. We think in fold space instead of gene space, so the molecule that treats the disease can be designed rather than discovered.',
		signature: 'Norvex Bio — Research charter, 2026',
	},

	science: {
		id: 'science',
		kicker: 'The science',
		title: 'Biology is programmable. We write it.',
		body: 'Every therapeutic starts as a shape. Our foundation models learn the grammar of folding from 200M+ natural and synthetic structures, then generate sequences that fold into shapes evolution never sampled — with function designed in from the first residue.',
		points: [
			{ k: '412', label: 'de novo designs validated in vitro' },
			{ k: '96.2%', label: 'expression success across 14 scaffolds' },
			{ k: '200M+', label: 'structures in the training corpus' },
		],
		caption: 'FIG. 01 · Whole-proteome fitness landscape, Norvex platform render',
	},

	pipeline: {
		id: 'pipeline',
		kicker: 'The design loop',
		title: 'Target to candidate, one closed loop.',
		body: 'Four stages, pinned side by side. Each pass turns a biological question into a measurable structure, then folds the evidence back into the next generation.',
		steps: [
			{
				n: '01',
				label: 'Define',
				metric: 'BINDING SITE',
				title: 'Formalize the hypothesis',
				body: 'We convert the therapeutic question into a design specification: target structure, epitope, mechanism, and the developability envelope the program has to live inside.',
				stat: { value: '3 days', label: 'spec to first generation' },
			},
			{
				n: '02',
				label: 'Generate',
				metric: 'FOLD SPACE',
				title: 'Shape new geometry',
				body: 'Diffusion models propose thousands of backbone geometries conditioned on the target, then sequence models assign residues that will actually fold and express.',
				stat: { value: '12,400', label: 'backbones per campaign' },
			},
			{
				n: '03',
				label: 'Validate',
				metric: 'EVIDENCE',
				title: 'Measure in the lab',
				body: 'High-throughput assays screen expression, binding, and thermal stability. Every plate — the failures especially — becomes training signal within 48 hours.',
				stat: { value: '48 h', label: 'assay to model retrain' },
			},
			{
				n: '04',
				label: 'Advance',
				metric: 'CANDIDATE',
				title: 'Close the loop',
				body: 'Optimized leads enter IND-enabling studies with manufacturability and immunogenicity already engineered in, not discovered during a CMC surprise.',
				stat: { value: '11×', label: 'faster target to hit' },
			},
		],
	},

	platform: {
		id: 'platform',
		kicker: 'Platform',
		title: 'Four disciplines, one system.',
		body: 'Select a discipline to inspect how it plugs into the loop.',
		items: [
			{
				icon: 'Helix',
				title: 'De novo design',
				body: 'Backbone generation conditioned on functional motifs: binders, enzymes, and symmetric assemblies far beyond natural fold space.',
				detail: 'Motif-scaffolding diffusion with rotamer-aware sequence design. Outputs are filtered by self-consistency RMSD before a single well is used.',
				spec: [
					['Model', 'NX-Fold 3'],
					['Conditioning', 'Motif + epitope'],
					['Throughput', '12.4k / campaign'],
				],
			},
			{
				icon: 'Lattice',
				title: 'Structure prediction',
				body: 'Sub-angstrom confidence scoring on every candidate, calibrated against our own crystallography pipeline rather than a public benchmark.',
				detail: 'Ensemble predictors report calibrated error bars, so a confident wrong answer is treated as the failure mode it is.',
				spec: [
					['Median RMSD', '0.84 Å'],
					['Calibration', 'In-house xtal'],
					['Coverage', '100% of leads'],
				],
			},
			{
				icon: 'Flask',
				title: 'Affinity maturation',
				body: 'Rounds of model-guided mutagenesis move candidates from micromolar hits to picomolar leads without the usual wet-lab plateau.',
				detail: 'Each round proposes a minimal, epistasis-aware mutation set — typically under twelve positions — so gains compound instead of cancelling.',
				spec: [
					['Typical gain', '3–4 logs'],
					['Rounds', '2–3'],
					['Positions', '< 12'],
				],
			},
			{
				icon: 'Graph',
				title: 'Developability',
				body: 'Aggregation, immunogenicity, and manufacturability scored before the first liter of culture, not after the first failed batch.',
				detail: 'Liabilities are penalties inside the generator, which means the model stops proposing molecules that would fail downstream at all.',
				spec: [
					['Screens', '9 liabilities'],
					['Stage', 'Pre-synthesis'],
					['Escapes', '0 to date'],
				],
			},
		],
	},

	impact: {
		id: 'impact',
		kicker: 'Impact',
		title: 'Designed to be measured.',
		items: [
			{ value: 412, suffix: '', label: 'proteins validated in vitro', spark: [3, 5, 8, 7, 12, 15, 21], decimals: 0 },
			{ value: 96.2, suffix: '%', label: 'expression success rate', spark: [70, 74, 81, 84, 88, 93, 96], decimals: 1 },
			{ value: 11, suffix: '×', label: 'faster target → hit cycle', spark: [100, 84, 61, 44, 30, 18, 9], decimals: 0 },
			{ value: 3, suffix: '', label: 'candidates in the clinic', spark: [0, 0, 1, 1, 2, 2, 3], decimals: 0 },
		],
		note: 'Figures are illustrative — Norvex Bio is a fictional company built for a frontend assessment.',
	},

	cta: {
		id: 'contact',
		kicker: 'Build with us',
		title: 'The medicine you need doesn’t exist yet.',
		body: 'We partner with teams who have a target and no roadmap. Bring the biology, we’ll design the protein.',
		button: 'Start a conversation',
		email: 'hello@norvexbio.example',
	},

	footer: {
		pdb: 'Structure: RCSB PDB 4OO8 · Protein Data Bank',
		rights: '© 2026 Norvex Bio. A fictional company.',
		links: [
			{ label: 'Privacy', href: '/privacy' },
			{ label: 'Terms', href: '/terms' },
		],
	},
} as const;
