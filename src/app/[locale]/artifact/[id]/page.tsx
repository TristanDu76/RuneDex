import React from 'react';
import Image from 'next/image';
import { fetchArtifactById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';

interface ArtifactPageProps {
    params: Promise<{
        id: string;
        locale: string;
    }>;
}

export default async function ArtifactPage({ params }: ArtifactPageProps) {
    const { id, locale } = await params;
    console.log('Loading artifact page for:', id, locale);
    const artifact = await fetchArtifactById(id, locale);
    console.log('Artifact data:', artifact);

    if (!artifact) {
        notFound();
    }

    // Nettoyage de la description
    const cleanDescription = (desc: string) => {
        if (!desc) return '';
        let cleaned = desc.replace(/<br>/g, '\n');
        cleaned = cleaned.replace(/<[^>]*>/g, '');
        return cleaned;
    };

    return (
        <main className="min-h-screen bg-gray-900 text-white pb-20 pt-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Back Button */}
                <Link href="/" className="inline-flex items-center text-gray-400 hover:text-yellow-500 mb-8 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Retour
                </Link>

                <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
                    {/* Image Section */}
                    <div className="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0">
                        <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full animate-pulse" />
                        <div className="relative w-full h-full rounded-2xl border-2 border-yellow-600/50 overflow-hidden shadow-2xl bg-gray-800">
                            {artifact.image_url ? (
                                <Image
                                    src={artifact.image_url}
                                    alt={artifact.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-6xl">
                                    🔮
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-block px-3 py-1 rounded-full bg-yellow-900/30 border border-yellow-700/50 text-yellow-500 text-xs font-bold uppercase tracking-widest mb-4">
                            {artifact.type || 'Artefact'}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight text-transparent bg-clip-text bg-linear-to-r from-yellow-200 via-yellow-400 to-yellow-600">
                            {artifact.name}
                        </h1>

                        <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed">
                            <p className="whitespace-pre-line">
                                {cleanDescription(artifact.description)}
                            </p>
                        </div>

                        {/* Owner Section */}
                        {artifact.owner && (
                            <div className="mt-12 pt-8 border-t border-gray-800">
                                <h3 className="text-lg font-bold text-gray-400 mb-4 uppercase tracking-widest text-sm">
                                    {artifact.owner.type === 'guardian' ? 'Gardé par' :
                                        artifact.owner.type === 'creator' ? 'Créé par' :
                                            'Lié à'}
                                </h3>
                                <Link
                                    href={artifact.owner.link}
                                    className="group flex items-center gap-4 bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-yellow-500 transition-all hover:bg-gray-800"
                                >
                                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-600 group-hover:border-yellow-500 transition-colors bg-gray-900">
                                        {artifact.owner.image ? (
                                            <Image
                                                src={(artifact.owner.image as any) || ''}
                                                alt={artifact.owner.name || ''}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white group-hover:text-yellow-400 transition-colors">
                                            {artifact.owner.name}
                                        </div>
                                        {artifact.owner.title && (
                                            <div className="text-sm text-gray-500 capitalize">
                                                {artifact.owner.title}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
