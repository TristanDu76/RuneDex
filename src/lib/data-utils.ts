import { ChampionData, LoreCharacter } from '@/types/champion';

/**
 * Formats the relations data for the frontend.
 */
export const formatRelations = (relationsData: any[], locale: string) => {
    return (relationsData || []).map((rel: any) => {
        const isChampion = !!rel.target_champion;
        const target = isChampion ? rel.target_champion : rel.target_lore;

        return {
            champion: target?.name || 'Inconnu',
            type: rel.type,
            note: locale.startsWith('en') ? rel.note_en : rel.note_fr,
            image: target?.image
        };
    });
};

/**
 * Applies localization to a champion object.
 * Replaces fields with their English versions if the locale is English.
 */
export const localizeChampion = (champion: ChampionData, locale: string) => {
    if (locale.startsWith('en')) {
        if (champion.title_en) champion.title = champion.title_en;
        if (champion.lore_en) champion.lore = champion.lore_en;
        if (champion.spells_en) champion.spells = champion.spells_en;
        if (champion.passive_en) champion.passive = champion.passive_en;
        if (champion.tags_en) champion.tags = champion.tags_en;
        if (champion.skins_en) champion.skins = champion.skins_en;
    }
    return champion;
};

/**
 * Applies localization to a lore character object.
 */
export const localizeLoreCharacter = (character: LoreCharacter, locale: string) => {
    const c = character as LoreCharacter & {
        description_fr?: string;
        lore_fr?: string;
        lore_en?: string;
    };

    if (locale.startsWith('en')) {
        if (c.description_en) c.description = c.description_en;
        else if (c.lore_en) c.description = c.lore_en;
        else if (c.description_fr) c.description = c.description_fr;
        else if (c.lore_fr) c.description = c.lore_fr;
    } else {
        if (c.description_fr) c.description = c.description_fr;
        else if (c.lore_fr) c.description = c.lore_fr;
        else if (c.description_en) c.description = c.description_en;
        else if (c.lore_en) c.description = c.lore_en;
    }
    return character;
};

/**
 * Helper to get the column name based on locale for SQL queries.
 */
export const getColName = (baseName: string, locale: string) => {
    return locale.startsWith('en') ? `${baseName}_en` : baseName;
};
