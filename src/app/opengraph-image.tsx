import { ImageResponse } from 'next/og';

export const alt = 'Norvex Bio | AI-guided protein design';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Og() {
	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					background: '#050D20',
					color: '#F6F7F9',
					padding: 80,
					fontFamily: 'sans-serif',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 22, letterSpacing: 6, color: '#25D0A6' }}>
					NORVEX BIO
				</div>
				<div style={{ display: 'flex', flexDirection: 'column', fontSize: 76, fontWeight: 700, lineHeight: 1.1, letterSpacing: -2 }}>
					<span>Proteins that nature</span>
					<span>
						<span style={{ color: '#3E63F2', fontStyle: 'italic' }}>never</span> got to.
					</span>
				</div>
				<div style={{ fontSize: 24, color: 'rgba(246,247,249,0.55)' }}>AI-guided protein design · Structure: PDB 4OO8</div>
			</div>
		),
		size,
	);
}
