export interface Region {
    id: string;
    name: string;
    nameEn: string;
    description: string;
    descriptionEn: string;
    color: string;
    polygons?: string[];
    circles?: string[];
    icon?: string;
    coords?: { x: number; y: number }; // Added for Fly-to functionality
    virtual?: boolean; // True for regions with no physical location on the map (e.g. Bandle City)
}

export interface RegionShardEntry {
    id: string;
    name: string;
    thumbnail: string;
    factionKey: string;
    factionKeys?: string[];
    type: 'champion' | 'lore';
    canon: boolean;
}
