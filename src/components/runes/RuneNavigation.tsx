import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

interface RuneNavigationProps {
    prevRune: { id: string; name: string } | null;
    nextRune: { id: string; name: string } | null;
}

export default function RuneNavigation({ prevRune, nextRune }: RuneNavigationProps) {
    const t = useTranslations('navigation');

    return (
        <div className="flex justify-between items-center w-full mb-8">
            {prevRune ? (
                <Link
                    href={`/rune/${prevRune.id}`}
                    className="group flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
                >
                    <div className="p-2 rounded-full border border-gray-700 group-hover:border-blue-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="hidden sm:block text-right">
                        <div className="text-xs text-gray-500 uppercase tracking-wider">{t('previous')}</div>
                        <div className="font-bold">{prevRune.name}</div>
                    </div>
                </Link>
            ) : <div />}

            {nextRune ? (
                <Link
                    href={`/rune/${nextRune.id}`}
                    className="group flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors text-right"
                >
                    <div className="hidden sm:block text-left">
                        <div className="text-xs text-gray-500 uppercase tracking-wider">{t('next')}</div>
                        <div className="font-bold">{nextRune.name}</div>
                    </div>
                    <div className="p-2 rounded-full border border-gray-700 group-hover:border-blue-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </Link>
            ) : <div />}
        </div>
    );
}
