// Skeleton de chargement pour les pages champion
export default function ChampionLoading() {
    return (
        <main className="min-h-screen bg-transparent text-white pb-20">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12">

                {/* Header */}
                <div className="flex flex-col items-center gap-3 pt-8">
                    <div className="w-72 h-14 rounded-xl bg-gray-800 animate-pulse" />
                    <div className="w-48 h-6 rounded-lg bg-gray-800 animate-pulse" />
                </div>

                {/* Main grid: artifacts | carousel | runes */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left col */}
                    <div className="lg:col-span-2 hidden lg:flex flex-col gap-4 pt-12">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-full aspect-square rounded-lg bg-gray-800 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                        ))}
                    </div>

                    {/* Center: skin carousel */}
                    <div className="lg:col-span-8">
                        <div className="w-full aspect-[3/4] max-h-[600px] rounded-2xl bg-gray-800 animate-pulse" />
                        {/* Skin thumbnails */}
                        <div className="flex gap-2 mt-3 overflow-hidden justify-center">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="w-16 h-16 rounded-lg bg-gray-800 animate-pulse flex-shrink-0" style={{ animationDelay: `${i * 60}ms` }} />
                            ))}
                        </div>
                    </div>

                    {/* Right col */}
                    <div className="lg:col-span-2 hidden lg:flex flex-col gap-4 pt-12">
                        {[1, 2].map(i => (
                            <div key={i} className="w-full aspect-square rounded-lg bg-gray-800 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                        ))}
                    </div>
                </div>

                {/* Info bar */}
                <div className="flex flex-wrap justify-center gap-4">
                    {[100, 140, 120, 90, 110].map((w, i) => (
                        <div key={i} className="h-9 rounded-full bg-gray-800 animate-pulse" style={{ width: w, animationDelay: `${i * 50}ms` }} />
                    ))}
                </div>

                {/* Spells */}
                <div className="w-full">
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <div className="w-16 h-16 rounded-xl bg-gray-800 animate-pulse" style={{ animationDelay: `${i * 60}ms` }} />
                                <div className="w-20 h-3 rounded bg-gray-800 animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lore block */}
                <div className="bg-gray-800/30 p-8 rounded-xl border border-gray-700 space-y-3">
                    <div className="w-32 h-6 rounded bg-gray-700 animate-pulse mb-4" />
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-4 rounded bg-gray-800 animate-pulse" style={{ width: `${85 + (i % 3) * 5}%`, animationDelay: `${i * 80}ms` }} />
                    ))}
                </div>

                {/* Relations block */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 space-y-6">
                    <div className="w-48 h-7 rounded bg-gray-700 animate-pulse" />
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex-shrink-0 w-64 h-28 rounded-xl bg-gray-800 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
