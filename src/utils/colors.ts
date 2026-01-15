export const regionColors: Record<string, string> = {
    demacia: 'text-blue-300 border-blue-500/30 bg-blue-900/20',
    noxus: 'text-red-400 border-red-500/30 bg-red-900/20',
    ionia: 'text-pink-300 border-pink-500/30 bg-pink-900/20',
    freljord: 'text-cyan-300 border-cyan-500/30 bg-cyan-900/20',
    shurima: 'text-yellow-400 border-yellow-500/30 bg-yellow-900/20',
    piltover: 'text-amber-300 border-amber-500/30 bg-amber-900/20',
    zaun: 'text-green-400 border-green-500/30 bg-green-900/20',
    bilgewater: 'text-orange-400 border-orange-500/30 bg-orange-900/20',
    targon: 'text-purple-300 border-purple-500/30 bg-purple-900/20',
    ixtal: 'text-emerald-400 border-emerald-500/30 bg-emerald-900/20',
    'shadow-isles': 'text-teal-300 border-teal-500/30 bg-teal-900/20',
    'bandle-city': 'text-lime-300 border-lime-500/30 bg-lime-900/20',
    void: 'text-violet-400 border-violet-500/30 bg-violet-900/20',
    runeterra: 'text-gray-300 border-gray-500/30 bg-gray-900/20',
    darkin: 'text-red-500 border-red-600/30 bg-red-950/40',
};

export const getRoleColor = (r: string) => {
    const role = r.toLowerCase();
    if (role === 'mage') return 'text-blue-400';
    if (role === 'assassin') return 'text-red-400';
    if (role === 'fighter' || role === 'combattant') return 'text-orange-400';
    if (role === 'tank') return 'text-green-400';
    if (role === 'marksman' || role === 'tireur') return 'text-cyan-400';
    if (role === 'support') return 'text-teal-400';
    return 'text-gray-300';
};

export const getSpeciesColor = (s: string) => {
    const species = s.toLowerCase();
    if (species.includes('human')) return 'text-amber-200';
    if (species.includes('yordle')) return 'text-orange-300';
    if (species.includes('vastaya')) return 'text-pink-300';
    if (species.includes('void')) return 'text-violet-400';
    if (species.includes('undead') || species.includes('revenant') || species.includes('wraith')) return 'text-teal-400';
    if (species.includes('darkin')) return 'text-red-500';
    if (species.includes('god') || species.includes('spirit') || species.includes('celestial') || species.includes('aspect')) return 'text-cyan-300';
    if (species.includes('golem') || species.includes('construct') || species.includes('cyborg')) return 'text-gray-400';
    if (species.includes('dragon')) return 'text-red-400';
    if (species.includes('demon')) return 'text-red-600';
    return 'text-gray-200';
};

export const getGenderColor = (g: string) => {
    const gender = g.toLowerCase();
    if (gender === 'male') return 'text-blue-300';
    if (gender === 'female') return 'text-pink-300';
    return 'text-purple-300';
};

export const getResourceColor = (r: string) => {
    const resource = r.toLowerCase();
    if (resource.includes('mana')) return 'text-blue-400';
    if (resource.includes('energy') || resource.includes('énergie')) return 'text-yellow-400';
    if (resource.includes('rage') || resource.includes('fury') || resource.includes('fureur')) return 'text-red-400';
    if (resource.includes('health') || resource.includes('vie') || resource.includes('pv')) return 'text-green-400';
    if (resource.includes('heat') || resource.includes('chaleur')) return 'text-orange-400';
    if (resource.includes('grit') || resource.includes('courage')) return 'text-orange-300';
    if (resource.includes('flow') || resource.includes('flux')) return 'text-cyan-300';
    if (resource.includes('shield') || resource.includes('bouclier')) return 'text-gray-300';
    if (resource.includes('none') || resource.includes('aucun') || resource.includes('manaless')) return 'text-gray-400';
    return 'text-gray-300';
};

export const getTypeStyle = (type: string) => {
    const t = type.toLowerCase();

    // Family (Blue)
    if ([
        'sibling', 'parent', 'child', 'spouse', 'ancestor', 'descendant', 'adoptive-family', 'family',
        'father', 'mother', 'son', 'daughter', 'brother', 'sister', 'twin-brother', 'twin-sister',
        'husband', 'wife', 'adoptive-father', 'adoptive-mother', 'adoptive-son', 'adoptive-daughter',
        'family/ally', 'family/rival', 'brother/ally', 'brother/enemy', 'brother/rival',
        'sister/ally', 'sister/rival', 'student/family/adoptive-son'
    ].includes(t)) {
        return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: '👨‍👩‍👧‍👦' };
    }

    // Love (Pink)
    if ([
        'lover', 'ex-lover', 'unrequited-love', 'eternal-lover', 'love/crush', 'love/crush/forbidden'
    ].includes(t)) {
        return { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400', icon: '💕' };
    }

    // Allies / Friends / Mentorship (Green)
    if ([
        'friend', 'mentor', 'student', 'ally', 'comrade', 'faction-member', 'apprentice', 'leader/black-rose',
        'subordinate/black-rose', 'employee', 'creator', 'creation', 'host', 'mentor/ally',
        'student/ally', 'student/rival'
    ].includes(t)) {
        return { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', icon: '🤝' };
    }

    // Enemies / Conflicts (Red)
    if ([
        'enemy', 'nemesis', 'betrayed', 'betrayer', 'victim', 'killer', 'hunts', 'hunted-by',
        'corrupted', 'corrupted-by', 'predator', 'prey', 'hunter', 'enemy/shared',
        'conflict', 'conflict/family', 'conflict/permanent', 'conflict/temporary',
        'opposed', 'opposed/ideology', 'nemesis/ex-ally', 'nemesis/ex-brother', 'nemesis/ex-father',
        'nemesis/ex-friend', 'nemesis/ex-mother', 'nemesis/ex-sister', 'nemesis/war', 'student/enemy', 'mentor/enemy', 'sister/enemy',
    ].includes(t)) {
        return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: '⚔️' };
    }

    // Rivals / Tensions (Orange)
    if ([
        'rival', 'strained', 'tense', 'rival/ally', 'rival/corruption', 'rival/ex-ally',
        'rival/ex-brother', 'rival/ex-father', 'rival/ex-friend', 'rival/ex-mother',
        'rival/ex-sister', 'rival/secret'
    ].includes(t)) {
        return { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', icon: '🔥' };
    }

    // Special cases (Purple / Mystical)
    if (['void', 'darkin', 'spirit', 'god', 'aspect', 'self', 'brother/enemy', 'slave', 'master'].some(k => t.includes(k))) {
        return { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', icon: '�' };
    }

    // Default / Neutral (Gray)
    // This includes 'related', 'neutral', 'self', 'complex', 'unknown' and anything not listed
    return { bg: 'bg-gray-500/10', border: 'border-gray-500/30', text: 'text-gray-400', icon: '�' };
};


