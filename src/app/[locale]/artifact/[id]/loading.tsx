export default function ArtifactLoading() {
    return (
        <main className="min-h-screen bg-transparent text-white pb-20">
            <div className="max-w-3xl mx-auto p-6 space-y-8 pt-8">
                {/* Header */}
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-xl bg-gray-800 animate-pulse flex-shrink-0" />
                    <div className="flex flex-col gap-3 flex-1">
                        <div className="w-56 h-8 rounded-lg bg-gray-800 animate-pulse" />
                        <div className="w-24 h-5 rounded bg-gray-700 animate-pulse" />
                    </div>
                </div>
                {/* Description */}
                <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 space-y-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-4 rounded bg-gray-800 animate-pulse" style={{ width: `${75 + (i % 3) * 10}%`, animationDelay: `${i * 70}ms` }} />
                    ))}
                </div>
                {/* Owner */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                    <div className="w-14 h-14 rounded-full bg-gray-700 animate-pulse" />
                    <div className="flex flex-col gap-2">
                        <div className="w-32 h-4 rounded bg-gray-700 animate-pulse" />
                        <div className="w-20 h-3 rounded bg-gray-800 animate-pulse" />
                    </div>
                </div>
            </div>
        </main>
    );
}
