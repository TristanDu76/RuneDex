
import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

interface ChampionArtifactsProps {
    artifacts: any[];
    runes: any[];
    t: any;
}

export default function ChampionArtifacts({ artifacts, runes, t }: ChampionArtifactsProps) {
    if ((!artifacts || artifacts.length === 0) && (!runes || runes.length === 0)) {
        return null;
    }

    return (
        <div className="mt-8 pt-8 border-t border-gray-700">
            <h3 className="text-xl font-bold text-gray-200 mb-4">
                {t('champion.artifacts') || 'Artefacts & Runes'}
            </h3>

            <div className="flex flex-col gap-4">
                {/* Runes */}
                {runes && runes.map((rune) => (
                    <Link
                        key={rune.id}
                        href={`/rune/${rune.id}`}
                        className="group flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg border border-gray-700 hover:border-blue-500 transition-all"
                    >
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-600 group-hover:border-blue-400">
                            {rune.image_url ? (
                                <Image
                                    src={rune.image_url}
                                    alt={rune.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-blue-900 flex items-center justify-center text-xs">?</div>
                            )}
                        </div>
                        <div>
                            <div className="font-bold text-sm text-gray-200 group-hover:text-blue-400 transition-colors">
                                {rune.name}
                            </div>
                            <div className="text-xs text-blue-400 uppercase tracking-wider">
                                {rune.relation_type === 'guardian' ? 'Gardien' : rune.relation_type}
                            </div>
                        </div>
                    </Link>
                ))}

                {/* Artifacts */}
                {artifacts && artifacts.map((artifact) => (
                    <Link
                        key={artifact.id}
                        href={`/artifact/${artifact.id}`}
                        className="group flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg border border-gray-700 hover:border-yellow-500 transition-all"
                    >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-600 group-hover:border-yellow-400">
                            {artifact.image_url ? (
                                <Image
                                    src={artifact.image_url}
                                    alt={artifact.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-yellow-900 flex items-center justify-center text-xs">?</div>
                            )}
                        </div>
                        <div>
                            <div className="font-bold text-sm text-gray-200 group-hover:text-yellow-400 transition-colors">
                                {artifact.name}
                            </div>
                            <div className="text-xs text-yellow-500 uppercase tracking-wider">
                                {artifact.relation_type || 'Possesseur'}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
