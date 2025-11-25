'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function SiteLogo() {
    const searchParams = useSearchParams();
    const lang = searchParams.get('lang');

    const href = lang ? `/?lang=${lang}` : '/';

    return (
        <Link
            href={href}
            className="fixed top-4 left-4 z-50 text-3xl font-extrabold text-yellow-500 hover:text-yellow-400 transition-colors drop-shadow-lg tracking-tighter"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
        >
            RuneDex
        </Link>
    );
}
