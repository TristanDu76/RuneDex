export interface ChampionSkin {
    id: string;
    num: number;
    name: string;
    chromas: boolean;
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
    faction?: string;
    relatedChampions?: {
        name: string;
        slug: string;
        image?: string; // Optional image for related champion
    }[];
}