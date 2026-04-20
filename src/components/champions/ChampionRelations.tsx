'use client';

import React from 'react';
import { ChampionData, ChampionLight, LoreCharacterLight } from '@/types/champion';
import { getTypeStyle } from '@/utils/colors';
import { useTranslations } from 'next-intl';

interface ChampionRelationsProps {
    championName: string;
    championDetails: ChampionData;
    allChampions: ChampionLight[];
    loreCharacters: LoreCharacterLight[];
    locale: string;
    latestVersion: string;
}

/* ─── Portrait Card ─────────────────────────────────────────── */
const RelationCard = ({ rel, allChampions, loreCharacters, t, locale, latestVersion }: any) => {
    const relChamp = allChampions.find((c: any) => c.name === rel.champion);
    const style = getTypeStyle(rel.type);
    const note = rel.note
        ? (typeof rel.note === 'object' ? (rel.note as any)[locale === 'fr' ? 'fr' : 'en'] ?? (rel.note as any)['en'] : rel.note)
        : null;

    /* ── Image sources ── */
    let bgImage = '';
    let href = '#';
    let isLore = false;

    if (relChamp) {
        bgImage = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${relChamp.id}_0.jpg`;
        href = `/${locale}/champion/${relChamp.id}`;
    } else {
        const loreChar = loreCharacters.find((c: any) => c.name === rel.champion);
        bgImage = loreChar?.image || '';
        href = `/${locale}/lore/${encodeURIComponent(rel.champion)}`;
        isLore = true;
    }

    /* ── Badge color per relation type ── */
    const badgeColors: Record<string, { bg: string; text: string }> = {
        ally: { bg: '#1a3a1a', text: '#6fcf6f' },
        friend: { bg: '#1a3a1a', text: '#6fcf6f' },
        mentor: { bg: '#1a302a', text: '#50c8a0' },
        student: { bg: '#1a302a', text: '#50c8a0' },
        enemy: { bg: '#3a1a1a', text: '#cf6f6f' },
        rival: { bg: '#3a1a1a', text: '#cf6f6f' },
        nemesis: { bg: '#4a0a0a', text: '#ff5050' },
        family: { bg: '#2a1a3a', text: '#c080e0' },
        brother: { bg: '#2a1a3a', text: '#c080e0' },
        sister: { bg: '#2a1a3a', text: '#c080e0' },
        father: { bg: '#2a1a3a', text: '#c080e0' },
        mother: { bg: '#2a1a3a', text: '#c080e0' },
        son: { bg: '#2a1a3a', text: '#c080e0' },
        daughter: { bg: '#2a1a3a', text: '#c080e0' },
        lover: { bg: '#3a1a2a', text: '#e080a0' },
        'faction-member': { bg: '#2a2010', text: '#c8aa6e' },
        'related-lore': { bg: '#1a1a2a', text: '#8090c0' },
    };

    const badge = badgeColors[rel.type] ?? { bg: '#1a1a2a', text: '#a09b8c' };
    const typeLabel = (() => { try { return t(`relationTypes.${rel.type}`) || rel.type; } catch { return rel.type; } })();

    return (
        <a
            href={href}
            className="group"
            style={{
                display: 'block',
                flexShrink: 0,
                width: 160,
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
                aspectRatio: '3/4',
                border: '1px solid #1e2328',
                borderTop: '1px solid #3d3020',
                boxShadow: '0 4px 16px rgba(0,0,0,0.7)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                textDecoration: 'none',
            }}
            onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(-6px) scale(1.03)';
                el.style.boxShadow = '0 12px 32px rgba(0,0,0,0.9)';
                el.style.borderColor = badge.text;
            }}
            onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.transform = '';
                el.style.boxShadow = '0 4px 16px rgba(0,0,0,0.7)';
                el.style.borderColor = '#1e2328';
            }}
        >
            {/* Artwork background */}
            {bgImage ? (
                <img
                    src={bgImage}
                    alt={rel.champion}
                    style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'top center',
                        transition: 'transform 0.4s ease',
                    }}
                    className="group-hover:scale-110"
                    loading="lazy"
                />
            ) : (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(160deg, #1a1208 0%, #0c0905 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2.5rem', color: '#3d2e18',
                }}>
                    {isLore ? '📜' : '⚔'}
                </div>
            )}

            {/* Gradient overlay (always) */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
            }} />

            {/* Note slide-up on hover */}
            {note && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.85)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '12px',
                    opacity: 0, transition: 'opacity 0.25s ease',
                }}
                    className="group-hover:opacity-100">
                    <p style={{
                        color: '#c8b896', fontSize: '0.67rem',
                        lineHeight: 1.5, textAlign: 'center',
                        fontStyle: 'italic',
                    }}>
                        &ldquo;{note}&rdquo;
                    </p>
                </div>
            )}

            {/* Bottom info bar */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '10px 10px 8px',
                zIndex: 2,
            }}>
                {/* Relation type badge */}
                <div style={{
                    display: 'inline-block',
                    background: badge.bg,
                    border: `1px solid ${badge.text}40`,
                    borderRadius: 2,
                    padding: '1px 6px',
                    marginBottom: 4,
                }}>
                    <span style={{
                        color: badge.text,
                        fontSize: '0.55rem',
                        fontFamily: 'var(--font-marcellus), serif',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                    }}>
                        {typeLabel}
                    </span>
                </div>

                {/* Champion name */}
                <p style={{
                    color: '#f0e6d2',
                    fontFamily: 'var(--font-marcellus), serif',
                    fontSize: '0.82rem',
                    letterSpacing: '0.04em',
                    margin: 0,
                    textShadow: '0 1px 4px rgba(0,0,0,1)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}>
                    {rel.champion}
                </p>
            </div>
        </a>
    );
};

/* ─── Main Component ────────────────────────────────────────── */
export default function ChampionRelations({
    championName,
    championDetails,
    allChampions,
    loreCharacters,
    locale,
    latestVersion,
}: ChampionRelationsProps) {
    const t = useTranslations();
    const relations = championDetails.related_champions || [];
    const apiRelated = (championDetails.relatedChampions || []) as { name: string; slug: string; image?: string }[];

    let displayRelations: { champion: string; type: string; note?: string }[] = [];

    if (relations.length > 0) {
        displayRelations = [...relations];
    } else if (apiRelated.length > 0) {
        displayRelations = apiRelated.map(rel => ({ champion: rel.name, type: 'related' }));
    }

    /* Faction expansion */
    const factionRelations = displayRelations.filter(r => r.type === 'faction');
    factionRelations.forEach(rel => {
        const targetFaction = rel.champion.toLowerCase();
        allChampions
            .filter(c => (c as any).factions?.includes(targetFaction) && c.name !== championName)
            .forEach(member => {
                if (!displayRelations.some(r => r.champion === member.name))
                    displayRelations.push({ champion: member.name, type: 'faction-member' });
            });
        loreCharacters
            .filter(lc => {
                const factions = Array.isArray(lc.faction) ? lc.faction : (lc as any).factions || [];
                return factions.some((f: string) => f.toLowerCase() === targetFaction);
            })
            .forEach(member => {
                if (!displayRelations.some(r => r.champion === member.name))
                    displayRelations.push({ champion: member.name, type: 'faction-member' });
            });
    });

    /* Lore back-links */
    loreCharacters.forEach(lc => {
        const linked = lc.related_characters?.some((n: string) =>
            n.toLowerCase() === championName.toLowerCase() ||
            n.toLowerCase() === championDetails.id.toLowerCase()
        );
        if (linked && !displayRelations.some(r => r.champion === lc.name))
            displayRelations.push({ champion: lc.name, type: 'related-lore' });
    });

    displayRelations = displayRelations.filter(r => r.type !== 'faction');
    if (displayRelations.length === 0) return null;

    const priorityOrder = [
        'family', 'brother', 'sister', 'father', 'mother', 'son', 'daughter',
        'ally', 'friend', 'mentor', 'student', 'lover',
        'rival', 'enemy', 'nemesis',
        'related-lore', 'faction-member', 'related',
    ];

    const sortedRelations = [...displayRelations].sort((a, b) => {
        const ia = priorityOrder.indexOf(a.type), ib = priorityOrder.indexOf(b.type);
        if (ia !== -1 && ib !== -1) return ia - ib;
        if (ia !== -1) return -1;
        if (ib !== -1) return 1;
        return a.type.localeCompare(b.type);
    });

    return (
        <div className="hex-panel p-8 mt-8">
            {/* Section title */}
            <h2 style={{
                fontFamily: 'var(--font-marcellus), serif',
                fontSize: '1.3rem',
                color: '#c8aa6e',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '2rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid #2a1e0e',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {t('champion.relatedCharacters')}
            </h2>

            {/* Flat card grid — sorted by relation priority, badge shows type */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
            }}>
                {sortedRelations.map(rel => (
                    <RelationCard
                        key={`${rel.champion}-${rel.type}`}
                        rel={rel}
                        allChampions={allChampions}
                        loreCharacters={loreCharacters}
                        t={t}
                        locale={locale}
                        latestVersion={latestVersion}
                    />
                ))}
            </div>
        </div>
    );
}

