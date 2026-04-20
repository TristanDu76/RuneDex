export default function LoreLoading() {
    return (
        <main className="min-h-screen bg-transparent text-white pb-20">
            <div className="max-w-4xl mx-auto p-6 space-y-10">

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-center gap-6 pt-8">
                    <div className="w-36 h-36 rounded-full bg-gray-800 animate-pulse flex-shrink-0" />
                    <div className="flex flex-col gap-3 flex-1">
                        <div className="w-48 h-8 rounded-xl bg-gray-800 animate-pulse" />
                        <div className="w-32 h-4 rounded bg-gray-700 animate-pulse" />
                        <div className="flex gap-2 mt-2">
                            {[80, 70, 90].map((w, i) => (
                                <div key={i} style={{ width: w }} className="h-7 rounded-full bg-gray-800 animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 space-y-3">
                    <div className="w-32 h-5 rounded bg-gray-700 animate-pulse mb-4" />
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-4 rounded bg-gray-800 animate-pulse" style={{ width: `${80 + (i % 3) * 8}%`, animationDelay: `${i * 80}ms` }} />
                    ))}
                </div>

                {/* Relations */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 space-y-4">
                    <div className="w-40 h-6 rounded bg-gray-700 animate-pulse" />
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex-shrink-0 w-56 h-24 rounded-xl bg-gray-800 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
