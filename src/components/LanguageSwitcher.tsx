'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export default function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentLocale = searchParams.get('lang') || 'fr_FR';

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);
            return params.toString();
        },
        [searchParams]
    );

    const toggleLanguage = () => {
        const newLocale = currentLocale === 'fr_FR' ? 'en_US' : 'fr_FR';
        router.push(pathname + '?' + createQueryString('lang', newLocale));
    };

    return (
        <button
            onClick={toggleLanguage}
            className="fixed top-4 right-4 z-50 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded border border-gray-600 shadow-lg transition-colors flex items-center gap-2"
        >
            <span className={currentLocale === 'fr_FR' ? 'text-yellow-500' : 'text-gray-400'}>FR</span>
            <span className="text-gray-500">|</span>
            <span className={currentLocale === 'en_US' ? 'text-yellow-500' : 'text-gray-400'}>EN</span>
        </button>
    );
}
