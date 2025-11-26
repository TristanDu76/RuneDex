export interface ChampionSkin {
    id: string;
    num: number;
    name: string;
    chromas: boolean;
}

export interface LoreCharacter {
    id: string;
    name: string;
    faction: string;
    gender?: string;
    species?: string;
    description?: string;
    image?: string;
}

export interface ChampionImage {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface ChampionSpell {
    id: string;
    name: string;
    description: string;
    tooltip: string;
    leveltip?: {
        label: string[];
        effect: string[];
    };
    maxrank: number;
    cooldown: number[];
    cooldownBurn: string;
    cost: number[];
    costBurn: string;
    range: number[] | string;
    rangeBurn: string;
    image: ChampionImage;
    resource?: string;
    effectBurn?: (string | null)[];
}

export interface ChampionPassive {
    name: string;
    description: string;
    image: ChampionImage;
}

export interface ChampionData {
    id: string;
    key: string;
    name: string;
    title: string;

    blurb: string;
    tags: string[];
    partype: string;

    info: {
        attack: number;
        defense: number;
        magic: number;
        difficulty: number;
    };

    version: string;
    image: ChampionImage;

    // Detailed fields (optional because they might not be in the list view)
    lore?: string;
    skins?: ChampionSkin[];
    spells?: ChampionSpell[];
    passive?: ChampionPassive;
    faction?: string; // Gardé pour compatibilité, mais on préfère factions
    factions?: string[]; // Nouvelle colonne DB
    custom_tags?: string[]; // Nouvelle colonne DB
    relatedChampions?: { // Ancien champ (API ?)
        name: string;
        slug: string;
        image?: string;
    }[];
    related_champions?: { // Nouveau champ DB
        champion: string;
        type: string;
        note?: string;
    }[];
    gender?: string; // Nouvelle colonne DB
    species?: string; // Nouvelle colonne DB

    // Champs de traduction (anglais)
    title_en?: string;
    lore_en?: string;
    blurb_en?: string;
    spells_en?: ChampionSpell[];
    passive_en?: ChampionPassive;
    tags_en?: string[];
}