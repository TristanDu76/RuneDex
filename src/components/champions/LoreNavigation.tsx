import { Link } from '@/i18n/routing';

interface LoreNavigationProps {
    prevLoreName: string;
    nextLoreName: string;
}

export default function LoreNavigation({ prevLoreName, nextLoreName }: LoreNavigationProps) {
    const getLink = (name: string) => `/lore/${name}`;

    return (
        <>
            <Link
                href={getLink(prevLoreName)}
                className="fixed left-4 top-1/2 -translate-y-1/2 z-40 bg-gray-900/50 hover:bg-yellow-500/80 text-white p-4 rounded-full backdrop-blur-sm transition-all border border-gray-700 hover:border-yellow-400 group hidden xl:block"
                aria-label="Personnage précédent"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
                    <path d="m15 18-6-6 6-6" />
                </svg>
            </Link>

            <Link
                href={getLink(nextLoreName)}
                className="fixed right-4 top-1/2 -translate-y-1/2 z-40 bg-gray-900/50 hover:bg-yellow-500/80 text-white p-4 rounded-full backdrop-blur-sm transition-all border border-gray-700 hover:border-yellow-400 group hidden xl:block"
                aria-label="Personnage suivant"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                    <path d="m9 18 6-6-6-6" />
                </svg>
            </Link>
        </>
    );
}
