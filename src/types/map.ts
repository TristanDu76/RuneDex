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
}
