import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Link from 'next/link';

interface CharactersPageProps {
    params: Promise<{ locale: string }>;
}

export const metadata = {
    title: 'RuneDex — Personnages',
    description: 'Explorez les Champions jouables et les Personnages du Lore de Runeterra.',
};

export async function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function CharactersPage({ params }: CharactersPageProps) {
    const { locale } = await params;
    const t = await getTranslations('characters');
    const isEn = locale.startsWith('en');

    return (
        <main className="min-h-screen bg-transparent flex flex-col items-center justify-center p-8 pt-24 relative">

            {/* Title */}
            <div className="text-center mb-16">
                <h1 className="hex-title text-5xl mb-4">{t('title')}</h1>
                <p style={{ color: '#7a6a4e', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {t('subtitle')}
                </p>
            </div>

            {/* Two big choice buttons */}
            <div className="flex flex-col sm:flex-row gap-8 w-full max-w-3xl" style={{ alignItems: 'stretch' }}>

                {/* Champions — Jouables */}
                <Link
                    href={`/${locale}/champions`}
                    className="group flex-1"
                    style={{ display: 'flex' }}
                >
                    <div style={{
                        position: 'relative',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(160deg, #0e1520 0%, #091428 100%)',
                        border: '1px solid #1e2328',
                        borderTop: '1px solid #5c5b57',
                        borderBottom: '2px solid #000',
                        borderRadius: 2,
                        padding: '40px 32px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        overflow: 'hidden',
                    }}>
                        {/* Subtle gold line at top on hover */}
                        <div style={{
                            position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
                            background: 'linear-gradient(90deg, transparent, #c8aa6e, transparent)',
                            opacity: 0,
                        }} className="group-hover:opacity-100 transition-opacity duration-200" />

                        <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚔️</div>
                        <h2 style={{
                            fontFamily: 'var(--font-marcellus), serif',
                            fontSize: '1.4rem',
                            color: '#c8aa6e',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginBottom: 8,
                            whiteSpace: 'nowrap',
                        }}>
                            {isEn ? 'Champions' : 'Champions'}
                        </h2>
                        <p style={{ color: '#5c5b57', fontSize: '0.8rem', letterSpacing: '0.06em' }}>
                            {isEn ? 'Playable — 169 characters' : 'Jouables — 169 personnages'}
                        </p>

                        <div style={{
                            marginTop: 24,
                            padding: '8px 20px',
                            border: '1px solid #c8aa6e',
                            borderRadius: 2,
                            display: 'inline-block',
                            color: '#c8aa6e',
                            fontSize: '0.7rem',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase' as const,
                            fontFamily: 'var(--font-marcellus), serif',
                        }} className="group-hover:bg-[#c8aa6e]/10 transition-colors duration-200">
                            {isEn ? 'Explore →' : 'Explorer →'}
                        </div>
                    </div>
                </Link>

                {/* Personnages du Lore — Non-Jouables */}
                <Link
                    href={`/${locale}/lore`}
                    className="group flex-1"
                    style={{ display: 'flex' }}
                >
                    <div style={{
                        position: 'relative',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(160deg, #100d18 0%, #0a0615 100%)',
                        border: '1px solid #1e2328',
                        borderTop: '1px solid #3d3550',
                        borderBottom: '2px solid #000',
                        borderRadius: 2,
                        padding: '40px 32px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
                            background: 'linear-gradient(90deg, transparent, #8060c8, transparent)',
                            opacity: 0,
                        }} className="group-hover:opacity-100 transition-opacity duration-200" />

                        <div style={{ fontSize: '3rem', marginBottom: 16 }}>📜</div>
                        <h2 style={{
                            fontFamily: 'var(--font-marcellus), serif',
                            fontSize: '1.4rem',
                            color: '#a080d0',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginBottom: 8,
                            whiteSpace: 'nowrap',
                        }}>
                            {isEn ? 'Lore Characters' : 'Personnages du Lore'}
                        </h2>
                        <p style={{ color: '#5c5b57', fontSize: '0.8rem', letterSpacing: '0.06em' }}>
                            {isEn ? 'Non-playable — extended universe' : 'Non-jouables — univers étendu'}
                        </p>

                        <div style={{
                            marginTop: 24,
                            padding: '8px 20px',
                            border: '1px solid #8060c8',
                            borderRadius: 2,
                            display: 'inline-block',
                            color: '#a080d0',
                            fontSize: '0.7rem',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase' as const,
                            fontFamily: 'var(--font-marcellus), serif',
                        }} className="group-hover:bg-[#8060c8]/10 transition-colors duration-200">
                            {isEn ? 'Explore →' : 'Explorer →'}
                        </div>
                    </div>
                </Link>
            </div>
        </main>
    );
}
