'use client';

import { useRouter } from '@/i18n/routing';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setExpandedSidebarItem as setExpandedAction, setSidebarSearchQuery as setSearchAction } from '@/store/slices/mapSlice';
import Image from 'next/image';

interface SidebarItem {
    id: string;
    icon: string;
    label: string;
    href?: string;
    content?: React.ReactNode;
}

interface MapSidebarProps {
    locale: string;
    onSearch?: (query: string) => void;
}

export default function MapSidebar({ locale, onSearch }: MapSidebarProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { expandedSidebarItem: expandedItem, sidebarSearchQuery: searchQuery } = useAppSelector(state => state.map);

    const setExpandedItem = (item: string | null) => dispatch(setExpandedAction(item));
    const setSearchQuery = (query: string) => dispatch(setSearchAction(query));

    const isEn = locale.startsWith('en');

    const navItems = [
        {
            id: 'champions',
            icon: '⚔️',
            label: isEn ? 'Champions' : 'Champions',
            href: '/champions',
        },
        {
            id: 'lore',
            icon: '📖',
            label: isEn ? 'Lore' : 'Lore',
            href: '/lore',
        },
        {
            id: 'runes',
            icon: '🔮',
            label: isEn ? 'Runes' : 'Runes',
            href: '/rune',
        },
        {
            id: 'artifacts',
            icon: '🗡️',
            label: isEn ? 'Items' : 'Objets',
            href: '/artifact',
        },
        {
            id: 'quiz',
            icon: '🎮',
            label: 'Quiz',
            href: '/quiz',
        },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/champions?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-[1000] flex flex-col gap-2">

            {/* Logo RuneDex */}
            <div
                className="flex items-center gap-3 mb-2 cursor-pointer group"
                onClick={() => router.push('/')}
            >
                <div className="w-10 h-10 rounded-xl bg-hextech-panel/90 backdrop-blur-md border border-hextech-gold/40 flex items-center justify-center shadow-lg group-hover:border-hextech-cyan transition-all overflow-hidden">
                    <Image src="/LogoRuneDex.png" alt="RuneDex" width={32} height={32} className="object-contain" />
                </div>
                <div className="overflow-hidden max-w-0 group-hover:max-w-[120px] transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100">
                    <span className="text-hextech-gold font-bold text-sm whitespace-nowrap tracking-widest uppercase">RuneDex</span>
                </div>
            </div>

            {/* Search bar */}
            <div
                className="group flex items-center gap-3"
                onMouseEnter={() => setExpandedItem('search')}
                onMouseLeave={() => setExpandedItem(null)}
            >
                {/* Icon button */}
                <button
                    className={`w-10 h-10 rounded-xl backdrop-blur-md border flex items-center justify-center shadow-lg transition-all duration-200 flex-shrink-0
                        ${expandedItem === 'search'
                            ? 'bg-hextech-cyan/20 border-hextech-cyan scale-105 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                            : 'bg-hextech-panel/80 border-hextech-gold/40 hover:border-hextech-cyan/80'
                        }`}
                    title={isEn ? 'Search' : 'Rechercher'}
                >
                    <span className="text-lg">🔍</span>
                </button>

                {/* Expanded search */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedItem === 'search' ? 'max-w-[220px] opacity-100' : 'max-w-0 opacity-0'}`}>
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={isEn ? 'Search champion...' : 'Chercher un champion...'}
                            autoFocus={expandedItem === 'search'}
                            className="w-[200px] bg-black/70 backdrop-blur-md border border-yellow-500/40 text-white text-sm rounded-xl px-3 py-2 outline-none placeholder-gray-400 focus:border-yellow-400/70 transition-all"
                        />
                    </form>
                </div>
            </div>

            {/* Nav items */}
            {navItems.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center gap-3"
                    onMouseEnter={() => setExpandedItem(item.id)}
                    onMouseLeave={() => setExpandedItem(null)}
                >
                    {/* Icon button */}
                    <button
                        className={`w-10 h-10 rounded-xl backdrop-blur-md border flex items-center justify-center shadow-lg transition-all duration-200 flex-shrink-0
                            ${expandedItem === item.id
                                ? 'bg-hextech-cyan/20 border-hextech-cyan scale-105 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                                : 'bg-hextech-panel/80 border-hextech-gold/40 hover:border-hextech-cyan/80'
                            }`}
                        onClick={() => item.href && router.push(item.href as any)}
                        title={item.label}
                    >
                        <span className="text-lg">{item.icon}</span>
                    </button>

                    {/* Expanded label */}
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out cursor-pointer ${expandedItem === item.id ? 'max-w-[200px] opacity-100' : 'max-w-0 opacity-0'}`}
                        onClick={() => item.href && router.push(item.href as any)}
                    >
                        <div className="bg-hextech-panel border border-hextech-cyan/60 rounded-xl px-4 py-2 whitespace-nowrap shadow-[0_0_10px_rgba(0,229,255,0.1)]">
                            <span className="text-hextech-cyan font-bold text-sm tracking-wider uppercase">{item.label}</span>
                        </div>
                    </div>
                </div>
            ))}

            {/* Separator & region hint */}
            <div className="w-10 h-px bg-white/10 rounded mt-1" />
            <div
                className="flex items-center gap-3"
                onMouseEnter={() => setExpandedItem('hint')}
                onMouseLeave={() => setExpandedItem(null)}
            >
                <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center">
                    <span className="text-base text-gray-400">💡</span>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedItem === 'hint' ? 'max-w-[240px] opacity-100' : 'max-w-0 opacity-0'}`}>
                    <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 whitespace-nowrap">
                        <span className="text-gray-300 text-xs">{isEn ? 'Click a region to explore' : 'Clique une région pour explorer'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
