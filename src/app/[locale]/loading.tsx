// Skeleton de chargement pour la page d'accueil
export default function HomeLoading() {
    return (
        <main className="min-h-screen bg-transparent p-8">
            <div className="w-full max-w-7xl mx-auto">

                {/* Logo skeleton */}
                <div className="flex flex-col items-center justify-center mb-8 mt-8 gap-4">
                    <div className="w-64 h-32 rounded-xl bg-gray-800 animate-pulse" />
                    <div className="w-48 h-10 rounded-lg bg-gray-800 animate-pulse" />
                    <div className="w-36 h-9 rounded-full bg-gray-800 animate-pulse mt-2" />
                </div>

                {/* Tab bar skeleton */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gray-800 p-1 rounded-full border border-gray-700 flex gap-2">
                        {[140, 160, 110, 90, 100].map((w, i) => (
                            <div
                                key={i}
                                style={{ width: w }}
                                className="h-9 rounded-full bg-gray-700 animate-pulse"
                            />
                        ))}
                    </div>
                </div>

                {/* Search bar skeleton */}
                <div className="mb-8 flex justify-center">
                    <div className="w-full lg:w-96 h-12 rounded-lg bg-gray-800 animate-pulse" />
                </div>

                {/* Cards grid skeleton */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 place-items-center">
                    {Array.from({ length: 32 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-3 w-full">
                            <div
                                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-800 animate-pulse"
                                style={{ animationDelay: `${(i * 40) % 600}ms` }}
                            />
                            <div className="w-20 h-3 rounded bg-gray-800 animate-pulse" style={{ animationDelay: `${(i * 40 + 100) % 600}ms` }} />
                            <div className="w-14 h-2 rounded bg-gray-700 animate-pulse" style={{ animationDelay: `${(i * 40 + 200) % 600}ms` }} />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
