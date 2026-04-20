export default function RuneLoading() {
    return (
        <main className="min-h-screen bg-transparent text-white pb-20">
            <div className="max-w-3xl mx-auto p-6 space-y-8 pt-8">
                {/* Header */}
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gray-800 animate-pulse flex-shrink-0" />
                    <div className="flex flex-col gap-3 flex-1">
                        <div className="w-48 h-8 rounded-lg bg-gray-800 animate-pulse" />
                        <div className="w-24 h-5 rounded bg-gray-700 animate-pulse" />
                    </div>
                </div>
                {/* Description */}
                <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-4 rounded bg-gray-800 animate-pulse" style={{ width: `${80 + (i % 3) * 8}%`, animationDelay: `${i * 70}ms` }} />
                    ))}
                </div>
            </div>
        </main>
    );
}
