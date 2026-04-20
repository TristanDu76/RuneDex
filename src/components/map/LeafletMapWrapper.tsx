'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from '@/i18n/routing';

const LeafletInteractiveMap = dynamic(
    () => import('./LeafletInteractiveMap'),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#060402]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c8aa6e] mb-4" />
                <p className="uppercase tracking-widest text-xs" style={{ color: '#c8aa6e', fontFamily: 'var(--font-marcellus),serif' }}>
                    Chargement...
                </p>
            </div>
        )
    }
);

interface MapWrapperProps {
    locale: string;
}

const NAV_ITEMS = [
    { id: 'characters', emoji: '👥', labelFr: 'Personnages', labelEn: 'Characters', href: '/characters' },
    { id: 'runes', emoji: '🔮', labelFr: 'Runes', labelEn: 'Runes', href: '/rune' },
    { id: 'artifacts', emoji: '🗡', labelFr: 'Objets', labelEn: 'Items', href: '/artifact' },
    { id: 'quiz', emoji: '🎮', labelFr: 'Quiz', labelEn: 'Quiz', href: '/quiz' },
];

const FACTIONS = [
    { name: 'Demacia', color: '#d4deb0' },
    { name: 'Noxus', color: '#c04040' },
    { name: 'Ionia', color: '#c080a8' },
    { name: 'Shurima', color: '#c8a030' },
    { name: 'Freljord', color: '#88bcd8' },
    { name: 'Piltover', color: '#d4a020' },
    { name: 'Zaun', color: '#50b870' },
    { name: 'Bilgewater', color: '#5080b8' },
    { name: 'Shadow Isles', color: '#40b888' },
    { name: 'Targon', color: '#a8c8f0' },
    { name: 'Ixtal', color: '#208030' },
    { name: 'Void', color: '#8860c8' },
];

/* ---------- Shared inline style helpers ---------- */
const PANEL_STYLE: React.CSSProperties = {
    background: 'linear-gradient(135deg,#2a1e0e 0%,#1e1508 100%)',
    border: '1px solid #3d2e18',
    borderTop: '1px solid #5c4020',
    borderBottom: '2px solid #000',
    borderRadius: 2,
};

const BTN_BASE: React.CSSProperties = {
    ...PANEL_STYLE,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 12px',
    color: '#a08850',
    cursor: 'pointer',
    textAlign: 'left' as const,
    fontFamily: 'var(--font-marcellus),serif',
    fontSize: '0.72rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    transition: 'all 0.18s ease',
    width: '100%',
};

export default function LeafletMapWrapper({ locale }: MapWrapperProps) {
    const router = useRouter();
    const isEn = locale.startsWith('en');

    return (
        /* ── War Room root ── */
        <div style={{
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column',
            backgroundColor: '#1a1208',
            backgroundImage: `
                repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px,rgba(255,255,255,0.02) 1px,transparent 1px,transparent 8px),
                repeating-linear-gradient(-45deg, rgba(0,0,0,0.06) 0px,rgba(0,0,0,0.06) 1px,transparent 1px,transparent 8px),
                radial-gradient(ellipse at 30% 40%, rgba(60,40,12,0.6) 0%,transparent 60%),
                radial-gradient(ellipse at 70% 60%, rgba(50,32,8,0.5) 0%,transparent 55%)
            `,
        }}>

            {/* ── Header ── */}
            <header style={{
                flexShrink: 0, padding: '8px 20px',
                display: 'flex', alignItems: 'center', gap: 14,
                background: 'linear-gradient(180deg,#22180a 0%,#1a1208 100%)',
                borderBottom: '1px solid #5c4020',
                boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
            }}>
                <div style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => router.push('/')}>
                    <Image src="/LogoRuneDex.png" alt="RuneDex" width={28} height={28} />
                </div>

                <h1 style={{ margin: 0, fontFamily: 'var(--font-marcellus),serif', fontSize: '1.05rem', color: '#d4b86a', letterSpacing: '0.14em', textTransform: 'uppercase', textShadow: '0 0 10px rgba(212,184,106,0.4)' }}>
                    {isEn ? 'RuneDex' : 'RuneDex'}
                </h1>

            </header>

            {/* ── Body ── */}
            <div style={{ flex: 1, display: 'flex', gap: 14, padding: '12px 16px', minHeight: 0 }}>

                {/* ── Left nav ── */}
                <nav style={{ flexShrink: 0, width: 128, display: 'flex', flexDirection: 'column', gap: 6, padding: '8px 0' }}>
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            style={BTN_BASE}
                            onMouseEnter={e => {
                                const el = e.currentTarget;
                                el.style.borderColor = '#c8aa6e';
                                el.style.color = '#c8aa6e';
                                el.style.boxShadow = '0 0 10px rgba(200,170,110,0.12)';
                            }}
                            onMouseLeave={e => {
                                const el = e.currentTarget;
                                el.style.borderColor = '#2a1e0e';
                                el.style.color = '#7a6a4e';
                                el.style.boxShadow = 'none';
                            }}
                            onClick={() => router.push(item.href as any)}
                            title={isEn ? item.labelEn : item.labelFr}
                        >
                            <span style={{ fontSize: '1rem' }}>{item.emoji}</span>
                            <span style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{isEn ? item.labelEn : item.labelFr}</span>
                        </button>
                    ))}
                </nav>

                {/* ── Map (framed) ── */}
                <div style={{ flex: 1, display: 'flex', minWidth: 0 }}>
                    {/* Outer frame with multi-layer box-shadow simulating carved wood */}
                    <div style={{
                        position: 'relative', flex: 1,
                        padding: 6,
                        backgroundColor: '#0c0905',
                        boxShadow: `
                            0 0 0 1px #000,
                            0 0 0 3px #3a2810,
                            0 0 0 4px #c8aa6e,
                            0 0 0 6px #1a1208,
                            0 0 0 8px #2a1e0e,
                            0 6px 40px rgba(0,0,0,0.9),
                            0 0 60px rgba(200,170,110,0.04)
                        `,
                    }}>
                        {/* Gold corner ornaments */}
                        {['tl', 'tr', 'bl', 'br'].map(pos => (
                            <div key={pos} style={{
                                position: 'absolute', zIndex: 10,
                                width: 12, height: 12,
                                borderRadius: '50%',
                                background: '#c8aa6e',
                                boxShadow: '0 0 5px rgba(200,170,110,0.5)',
                                top: pos.startsWith('t') ? 1 : 'auto',
                                bottom: pos.startsWith('b') ? 1 : 'auto',
                                left: pos.endsWith('l') ? 1 : 'auto',
                                right: pos.endsWith('r') ? 1 : 'auto',
                            }} />
                        ))}

                        {/* Inner map area */}
                        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                            <LeafletInteractiveMap locale={locale} />

                            {/* Candle corner glows */}
                            <div className="war-table-corner war-table-corner--tl" />
                            <div className="war-table-corner war-table-corner--tr" />
                            <div className="war-table-corner war-table-corner--bl" />
                            <div className="war-table-corner war-table-corner--br" />

                            {/* Parchment scanlines */}
                            <div className="war-table-scanlines" />
                            <div className="war-table-vignette" />

                            {/* Dust motes */}
                            <div className="war-table-dust" aria-hidden="true">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <span key={i} className="war-table-mote"
                                        style={{ '--i': i } as React.CSSProperties} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Right legend ── */}
                <aside style={{ flexShrink: 0, width: 110, display: 'flex', flexDirection: 'column', padding: '8px 0', gap: 4 }}>
                    <p style={{ margin: '0 0 6px', fontFamily: 'var(--font-marcellus),serif', fontSize: '0.6rem', color: '#7a6040', textTransform: 'uppercase', letterSpacing: '0.12em', borderBottom: '1px solid #3d2e18', paddingBottom: 5 }}>
                        {isEn ? 'Factions' : 'Factions'}
                    </p>
                    {FACTIONS.map(f => (
                        <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ flexShrink: 0, width: 7, height: 7, borderRadius: '50%', background: f.color, opacity: 0.75, display: 'block' }} />
                            <span style={{ fontSize: '0.62rem', color: '#8a7050', letterSpacing: '0.04em' }}>{f.name}</span>
                        </div>
                    ))}
                </aside>
            </div>

            {/* ── Footer ── */}
            <footer style={{
                flexShrink: 0, height: 28,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(0deg,#100b04 0%,#0c0905 100%)',
                borderTop: '1px solid #1a1208',
            }}>
                <span style={{ fontSize: '0.55rem', color: '#3d2e18', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                    {isEn ? 'Click a region to reveal its secrets' : 'Cliquez une région pour révéler ses secrets'}
                </span>
            </footer>
        </div>
    );
}
