/**
 * All fictional company copy in one place. Rename or rebrand by editing this file only.
 * Norvex Bio: fictional AI-guided protein design company.
 */
export const copy = {
	company: 'Norvex Bio',
	siteTitle: 'Norvex Bio | AI-guided protein design',
	siteDescription:
		'Norvex Bio designs proteins that nature never got to. A generative platform for de novo therapeutics, from target to clinic.',

	nav: {
		links: [
			{ label: 'Science', href: '#science' },
			{ label: 'Design loop', href: '#journey' },
			{ label: 'Platform', href: '#platform' },
			{ label: 'Capabilities', href: '#capabilities' },
			{ label: 'Impact', href: '#impact' },
		],
		cta: 'Partner with us',
	},

	hero: {
		kicker: 'AI-guided protein design · fold space, re-written',
		// [line1, editorial-italic word, line2]
		headline: ['Proteins nature', 'never', 'made.'],
		sub: 'We design and validate de novo proteins, turning decade-long discovery programs into months.',
		primaryCta: 'Explore the platform',
		secondaryCta: 'Read the science',
		specimen: 'SPCAS9 TERNARY COMPLEX · PDB 4OO8 · 1,301 RESIDUES',
	},

	science: {
		id: 'science',
		kicker: 'The science',
		title: 'Biology is programmable. We write it.',
		body: 'Every therapeutic starts as a shape. Our foundation models learn the grammar of folding from 200M+ natural and synthetic structures. Then they generate sequences that fold into shapes evolution never sampled, with function designed in from the first residue.',
		points: [
			{ k: '412', label: 'de novo designs validated in vitro' },
			{ k: '96.2%', label: 'expression success across 14 scaffolds' },
			{ k: '200M+', label: 'structures in the training corpus' },
		],
		caption: 'FIG. 01 · Whole-proteome fitness landscape, Norvex platform render',
	},

	platform: {
		id: 'platform',
		kicker: 'How it works',
		title: 'Target to candidate, one closed loop.',
		steps: [
			{ n: '01', title: 'Define', body: 'We formalize the therapeutic hypothesis as a design specification: target structure, epitope, developability envelope.' },
			{ n: '02', title: 'Generate', body: 'Diffusion models propose thousands of backbone geometries conditioned on the target; sequence models assign residues.' },
			{ n: '03', title: 'Validate', body: 'High-throughput assays screen expression, binding, and stability. Every result retrains the models within 48 hours.' },
			{ n: '04', title: 'Advance', body: 'Optimized leads enter IND-enabling studies with developability already engineered in, not discovered later.' },
		],
	},

	journey: {
		id: 'journey',
		kicker: 'The design loop',
		title: 'From target signal to candidate sequence.',
		body: 'Norvex treats protein design as a closed loop. Each pass turns a biological question into a measurable structure, then folds the result back into the next generation.',
		steps: [
			{ n: '01', label: 'Target', title: 'Map the signal', body: 'Define the binding surface, mechanism, and constraints that make the biology worth solving.', metric: 'BINDING SITE' },
			{ n: '02', label: 'Backbone', title: 'Shape the fold', body: 'Generate structures that create new geometry around the target instead of searching old libraries.', metric: 'FOLD SPACE' },
			{ n: '03', label: 'Sequence', title: 'Write the residue', body: 'Assign sequences for affinity, expression, stability, and the developability profile the program needs.', metric: 'SEQUENCE' },
			{ n: '04', label: 'Assay', title: 'Close the loop', body: 'Measure what worked in the lab and return the evidence to the model within the next design cycle.', metric: 'EVIDENCE' },
		],
	},

	capabilities: {
		id: 'capabilities',
		kicker: 'Capabilities',
		title: 'Four disciplines, one platform.',
		items: [
			{ icon: 'Helix', title: 'De novo design', body: 'Backbone generation conditioned on functional motifs: binders, enzymes, and symmetric assemblies beyond natural fold space.' },
			{ icon: 'Lattice', title: 'Structure prediction', body: 'Sub-angstrom confidence scoring on every candidate, calibrated against our own crystallography pipeline.' },
			{ icon: 'Flask', title: 'Affinity maturation', body: 'Rounds of model-guided mutagenesis move candidates from micromolar hits to picomolar leads without wet-lab plateaus.' },
			{ icon: 'Graph', title: 'Developability profiling', body: 'Aggregation, immunogenicity, and manufacturability scored before the first liter of culture, not after the first CMC surprise.' },
		],
	},

	stats: {
		id: 'impact',
		kicker: 'Impact',
		title: 'Designed to be measured.',
		items: [
			{ value: 412, suffix: '', label: 'proteins validated in vitro', spark: [3, 5, 8, 7, 12, 15, 21], decimals: 0 },
			{ value: 96.2, suffix: '%', label: 'expression success rate', spark: [70, 74, 81, 84, 88, 93, 96], decimals: 1 },
			{ value: 11, suffix: '×', label: 'faster target → hit cycle', spark: [100, 84, 61, 44, 30, 18, 9], decimals: 0 },
			{ value: 3, suffix: '', label: 'candidates in the clinic', spark: [0, 0, 1, 1, 2, 2, 3], decimals: 0 },
		],
	},

	cta: {
		id: 'contact',
		kicker: 'Build with us',
		title: 'The medicine you need doesn’t exist yet.',
		body: 'We partner with teams who have a target and no roadmap. Bring the biology and we’ll design the protein.',
		button: 'Start a conversation',
		email: 'hello@norvxbio.example',
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
