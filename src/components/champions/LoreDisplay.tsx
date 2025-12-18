'use client';

import { useState } from 'react';

interface LoreDisplayProps {
    lore: string;
    showMoreText: string;
    showLessText: string;
}

export default function LoreDisplay({ lore, showMoreText, showLessText }: LoreDisplayProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <div className="relative">
            <div className={`relative transition-all duration-500 ease-in-out ${!isExpanded ? 'max-h-40 overflow-hidden' : ''}`}>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line text-justify text-lg">
                    {lore}
                </p>
                {!isExpanded && (
                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-800 via-gray-800/60 to-transparent pointer-events-none" />
                )}
            </div>

            <button
                onClick={toggleExpand}
                className="mt-4 text-yellow-500 hover:text-yellow-400 font-semibold transition-colors flex items-center gap-2 group focus:outline-none"
            >
                <span>{isExpanded ? showLessText : showMoreText}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
}
