'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from '@/i18n/routing';

const LeafletInteractiveMap = dynamic(
    () => import('./LeafletInteractiveMap'),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#020b18]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#38bdf8] mb-4" />
                <p className="uppercase tracking-widest text-xs" style={{ color: '#38bdf8', fontFamily: 'var(--font-marcellus),serif' }}>
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
    { id: 'demacia', name: 'Demacia', color: '#d4deb0' },
    { id: 'noxus', name: 'Noxus', color: '#c04040' },
    { id: 'ionia', name: 'Ionia', color: '#c080a8' },
    { id: 'shurima', name: 'Shurima', color: '#c8a030' },
    { id: 'freljord', name: 'Freljord', color: '#88bcd8' },
    { id: 'piltover', name: 'Piltover', color: '#d4a020' },
    { id: 'zaun', name: 'Zaun', color: '#50b870' },
    { id: 'bilgewater', name: 'Bilgewater', color: '#5080b8' },
    { id: 'shadow-isles', name: 'Shadow Isles', color: '#40b888' },
    { id: 'targon', name: 'Targon', color: '#a8c8f0' },
    { id: 'ixtal', name: 'Ixtal', color: '#208030' },
    { id: 'void', name: 'Void', color: '#8860c8' },
];

/* ---------- Shared inline style helpers ---------- */
const PANEL_STYLE: React.CSSProperties = {
    background: 'linear-gradient(135deg,#0b2138 0%,#061323 100%)',
    border: '1px solid #123b5b',
    borderTop: '1px solid #1e5f8f',
    borderBottom: '2px solid #000',
    borderRadius: 2,
};

const BTN_BASE: React.CSSProperties = {
    ...PANEL_STYLE,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 12px',
    color: '#8bb9d8',
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
    const [isNavigationOpen, setIsNavigationOpen] = useState(false);
    const [isFactionsOpen, setIsFactionsOpen] = useState(false);

    const navigate = (href: string) => {
        setIsNavigationOpen(false);
        setIsFactionsOpen(false);
        router.push(href);
    };

    return (
        /* ── War Room root ── */
        <div className="war-room" style={{
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column',
            backgroundColor: '#020b18',
            backgroundImage: `
                repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0px,rgba(255,255,255,0.02) 1px,transparent 1px,transparent 8px),
                repeating-linear-gradient(-45deg, rgba(0,0,0,0.06) 0px,rgba(0,0,0,0.06) 1px,transparent 1px,transparent 8px),
                radial-gradient(ellipse at 30% 40%, rgba(14, 85, 140, 0.35) 0%,transparent 60%),
                radial-gradient(ellipse at 70% 60%, rgba(8, 55, 100, 0.32) 0%,transparent 55%)
            `,
        }}>

            {/* ── Header ── */}
            <header className="war-room__header" style={{
                flexShrink: 0, padding: '8px 20px',
                display: 'flex', alignItems: 'center', gap: 14,
                background: 'linear-gradient(180deg,#0b2138 0%,#020b18 100%)',
                borderBottom: '1px solid #123b5b',
                boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
            }}>
                <button
                    type="button"
                    className="war-room__brand"
                    onClick={() => navigate('/')}
                    aria-label={isEn ? 'Go to map' : 'Retour à la carte'}
                >
                    <Image src="/LogoRuneDex.png" alt="RuneDex" width={28} height={28} />
                </button>

                <h1 className="war-room__title" style={{ margin: 0, fontFamily: 'var(--font-marcellus),serif', fontSize: '1.05rem', color: '#7dd3fc', letterSpacing: '0.14em', textTransform: 'uppercase', textShadow: '0 0 10px rgba(56,189,248,0.4)' }}>
                    {isEn ? 'RuneDex' : 'RuneDex'}
                </h1>

                <button
                    type="button"
                    className="war-room__menu-trigger"
                    aria-expanded={isNavigationOpen}
                    aria-controls="map-navigation"
                    onClick={() => setIsNavigationOpen((open) => !open)}
                >
                    <span aria-hidden="true">☰</span>
                    <span className="sr-only">{isEn ? 'Open navigation' : 'Ouvrir la navigation'}</span>
                </button>

            </header>

            {/* ── Body ── */}
            <div className="war-room__body" style={{ flex: 1, display: 'flex', gap: 14, padding: '12px 16px', minHeight: 0 }}>

                {/* ── Left nav ── */}
                <nav className="war-room__side-nav" style={{ flexShrink: 0, width: 128, display: 'flex', flexDirection: 'column', gap: 6, padding: '8px 0' }} aria-label={isEn ? 'Explore RuneDex' : 'Explorer RuneDex'}>
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            style={BTN_BASE}
                            onMouseEnter={e => {
                                const el = e.currentTarget;
                                el.style.borderColor = '#38bdf8';
                                el.style.color = '#7dd3fc';
                                el.style.boxShadow = '0 0 10px rgba(56,189,248,0.18)';
                            }}
                            onMouseLeave={e => {
                                const el = e.currentTarget;
                                el.style.borderColor = '#123b5b';
                                el.style.color = '#8bb9d8';
                                el.style.boxShadow = 'none';
                            }}
                            onClick={() => navigate(item.href)}
                            title={isEn ? item.labelEn : item.labelFr}
                        >
                            <span style={{ fontSize: '1rem' }}>{item.emoji}</span>
                            <span style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{isEn ? item.labelEn : item.labelFr}</span>
                        </button>
                    ))}
                </nav>

                {/* ── Map (framed) ── */}
                <div className="war-room__map-shell" style={{ flex: 1, display: 'flex', minWidth: 0 }}>
                    {/* Outer frame with multi-layer box-shadow simulating carved wood */}
                    <div className="war-room__map-frame" style={{
                        position: 'relative', flex: 1,
                        padding: 6,
                        backgroundColor: '#020b18',
                        boxShadow: `
                            0 0 0 1px #000,
                            0 0 0 3px #123b5b,
                            0 0 0 4px #38bdf8,
                            0 0 0 6px #061323,
                            0 0 0 8px #0b2138,
                            0 6px 40px rgba(0,0,0,0.9),
                            0 0 60px rgba(56,189,248,0.10)
                        `,
                    }}>
                        {/* Arcane blue corner ornaments */}
                        {['tl', 'tr', 'bl', 'br'].map(pos => (
                            <div key={pos} style={{
                                position: 'absolute', zIndex: 10,
                                width: 12, height: 12,
                                borderRadius: '50%',
                                background: '#38bdf8',
                                boxShadow: '0 0 5px rgba(56,189,248,0.6)',
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
                    <button
                        type="button"
                        className="war-room__faction-trigger"
                        aria-expanded={isFactionsOpen}
                        aria-controls="map-factions"
                        onClick={() => setIsFactionsOpen((open) => !open)}
                    >
                        {isEn ? 'Explore factions' : 'Explorer les factions'}
                        <span aria-hidden="true">{isFactionsOpen ? '↓' : '↑'}</span>
                    </button>
                </div>

                {/* ── Right legend ── */}
                <aside className="war-room__desktop-factions" style={{ flexShrink: 0, width: 110, display: 'flex', flexDirection: 'column', padding: '8px 0', gap: 4 }} aria-label={isEn ? 'Factions' : 'Factions'}>
                    <p style={{ margin: '0 0 6px', fontFamily: 'var(--font-marcellus),serif', fontSize: '0.6rem', color: '#7aa6c2', textTransform: 'uppercase', letterSpacing: '0.12em', borderBottom: '1px solid #123b5b', paddingBottom: 5 }}>
                        {isEn ? 'Factions' : 'Factions'}
                    </p>
                    {FACTIONS.map(f => (
                        <button key={f.name} type="button" onClick={() => navigate(`/region/${f.id}`)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ flexShrink: 0, width: 7, height: 7, borderRadius: '50%', background: f.color, opacity: 0.75, display: 'block' }} />
                            <span style={{ fontSize: '0.62rem', color: '#8bb9d8', letterSpacing: '0.04em' }}>{f.name}</span>
                        </button>
                    ))}
                </aside>
            </div>

            <aside id="map-navigation" className={`war-room__mobile-navigation ${isNavigationOpen ? 'is-open' : ''}`}>
                <div className="war-room__sheet-heading">
                    <p>{isEn ? 'Explore RuneDex' : 'Explorer RuneDex'}</p>
                    <button type="button" onClick={() => setIsNavigationOpen(false)} aria-label={isEn ? 'Close navigation' : 'Fermer la navigation'}>×</button>
                </div>
                {NAV_ITEMS.map((item) => (
                    <button key={item.id} type="button" onClick={() => navigate(item.href)}>
                        <span aria-hidden="true">{item.emoji}</span>
                        {isEn ? item.labelEn : item.labelFr}
                    </button>
                ))}
            </aside>

            <aside id="map-factions" className={`war-room__mobile-factions ${isFactionsOpen ? 'is-open' : ''}`}>
                <div className="war-room__sheet-handle" aria-hidden="true" />
                <div className="war-room__sheet-heading">
                    <p>{isEn ? 'Explore factions' : 'Explorer les factions'}</p>
                    <button type="button" onClick={() => setIsFactionsOpen(false)} aria-label={isEn ? 'Close factions' : 'Fermer les factions'}>×</button>
                </div>
                <div className="war-room__sheet-list">
                    {FACTIONS.map((faction) => (
                        <button key={faction.id} type="button" onClick={() => navigate(`/region/${faction.id}`)}>
                            <span style={{ background: faction.color }} aria-hidden="true" />
                            {faction.name}
                            <span aria-hidden="true">→</span>
                        </button>
                    ))}
                </div>
            </aside>

            {/* ── Footer ── */}
            <footer style={{
                flexShrink: 0, height: 28,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(0deg,#020b18 0%,#061323 100%)',
                borderTop: '1px solid #0b2138',
            }}>
                <span style={{ fontSize: '0.55rem', color: '#4d7d9d', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                    {isEn ? 'Click a region to reveal its secrets' : 'Cliquez une région pour révéler ses secrets'}
                </span>
            </footer>
        </div>
    );
}
