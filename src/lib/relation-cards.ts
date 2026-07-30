import type { LoreCharacterLight, RelatedCharacterDisplay } from '@/types/champion';

interface RelationChampion {
    id: string;
    name: string;
    factions?: string[];
}

interface RelationLoreCharacter extends LoreCharacterLight {
    faction?: string | string[];
}

interface LegacyRelation {
    name: string;
    slug: string;
}

export interface RelationCardData {
    champion: string;
    type: string;
    note?: string | { fr?: string; en?: string };
    image?: string;
    href: string;
    isLore: boolean;
}

interface BuildRelationCardsOptions {
    championName: string;
    championId: string;
    locale: string;
    relations?: RelatedCharacterDisplay[];
    legacyRelations?: LegacyRelation[];
    allChampions: RelationChampion[];
    loreCharacters: RelationLoreCharacter[];
}

const priorityOrder = [
    'family', 'brother', 'sister', 'father', 'mother', 'son', 'daughter',
    'ally', 'friend', 'mentor', 'student', 'lover',
    'rival', 'enemy', 'nemesis',
    'related-lore', 'faction-member', 'related',
];

export function buildRelationCards({
    championName,
    championId,
    locale,
    relations = [],
    legacyRelations = [],
    allChampions,
    loreCharacters,
}: BuildRelationCardsOptions): RelationCardData[] {
    const displayRelations: RelatedCharacterDisplay[] = relations.length > 0
        ? [...relations]
        : legacyRelations.map((relation) => ({ champion: relation.name, type: 'related' }));
    const relationNames = new Set(displayRelations.map((relation) => relation.champion));
    const factionRelations = displayRelations.filter((relation) => relation.type === 'faction');

    for (const relation of factionRelations) {
        const faction = relation.champion.toLowerCase();

        for (const champion of allChampions) {
            if (champion.name !== championName && champion.factions?.includes(faction) && !relationNames.has(champion.name)) {
                displayRelations.push({ champion: champion.name, type: 'faction-member' });
                relationNames.add(champion.name);
            }
        }

        for (const loreCharacter of loreCharacters) {
            const factions = Array.isArray(loreCharacter.faction)
                ? loreCharacter.faction
                : loreCharacter.factions ?? (loreCharacter.faction ? [loreCharacter.faction] : []);
            if (factions.some((entry) => entry.toLowerCase() === faction) && !relationNames.has(loreCharacter.name)) {
                displayRelations.push({ champion: loreCharacter.name, type: 'faction-member' });
                relationNames.add(loreCharacter.name);
            }
        }
    }

    for (const loreCharacter of loreCharacters) {
        const linksToCurrentCharacter = loreCharacter.related_characters?.some((name) =>
            name.toLowerCase() === championName.toLowerCase() || name.toLowerCase() === championId.toLowerCase(),
        );
        if (linksToCurrentCharacter && !relationNames.has(loreCharacter.name)) {
            displayRelations.push({ champion: loreCharacter.name, type: 'related-lore' });
            relationNames.add(loreCharacter.name);
        }
    }

    const championsByName = new Map(allChampions.map((champion) => [champion.name, champion]));
    const loreByName = new Map(loreCharacters.map((character) => [character.name, character]));

    return displayRelations
        .filter((relation) => relation.type !== 'faction')
        .map((relation) => {
            const champion = championsByName.get(relation.champion);
            if (champion) {
                return {
                    champion: relation.champion,
                    type: relation.type,
                    note: relation.note,
                    image: `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`,
                    href: `/${locale}/champion/${champion.id}`,
                    isLore: false,
                };
            }

            const loreCharacter = loreByName.get(relation.champion);
            return {
                champion: relation.champion,
                type: relation.type,
                note: relation.note,
                image: loreCharacter?.image ?? undefined,
                href: `/${locale}/lore/${loreCharacter?.id ?? encodeURIComponent(relation.champion)}`,
                isLore: true,
            };
        })
        .sort((a, b) => {
            const aPriority = priorityOrder.indexOf(a.type);
            const bPriority = priorityOrder.indexOf(b.type);
            if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority;
            if (aPriority !== -1) return -1;
            if (bPriority !== -1) return 1;
            return a.type.localeCompare(b.type);
        });
}
