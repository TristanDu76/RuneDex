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
}  