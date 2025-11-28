'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();

    const toggleLanguage = () => {
        const newLocale = locale === 'fr' ? 'en' : 'fr';
        router.replace({ pathname }, { locale: newLocale });
    };

    return (
        <button
            onClick={toggleLanguage}
            className="fixed top-4 right-4 z-50 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded border border-gray-600 shadow-lg transition-colors flex items-center gap-2"
        >
            <span className={locale === 'fr' ? 'text-yellow-500' : 'text-gray-400'}>FR</span>
            <span className="text-gray-500">|</span>
            <span className={locale === 'en' ? 'text-yellow-500' : 'text-gray-400'}>EN</span>
        </button>
    );
}
