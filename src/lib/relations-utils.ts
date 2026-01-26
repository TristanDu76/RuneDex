/**
 * Utility functions for handling relations in the new unidirectional format
 */

import {
    Relation,
    RelationType,
    EnrichedRelation,
    getInverseRelationType,
    isSymmetricRelation
} from '@/types/relations';

// ============================================================================
// RELATION LOOKUP FUNCTIONS
// ============================================================================

/**
 * Get all relations for a specific entity (champion or lore character)
 * This function handles bidirectional lookup in the unidirectional format
 * 
 * @param relations - Array of all relations
 * @param entityId - ID of the entity to find relations for
 * @param entityType - Type of entity ('champion' or 'lore')
 * @returns Array of relations with metadata about direction
 */
export function getRelationsForEntity(
    relations: Relation[],
    entityId: string,
    entityType: 'champion' | 'lore'
): Array<{
    relation: Relation;
    isEntityA: boolean;
    relationType: RelationType;
    targetId: string;
    targetType: 'champion' | 'lore';
}> {
    return relations
        .filter(rel =>
            (rel.entity_a_id === entityId && rel.entity_a_type === entityType) ||
            (rel.entity_b_id === entityId && rel.entity_b_type === entityType)
        )
        .map(rel => {
            const isEntityA = rel.entity_a_id === entityId && rel.entity_a_type === entityType;
            const relationType = isEntityA
                ? rel.relation_type
                : getInverseRelationType(rel.relation_type);

            return {
                relation: rel,
                isEntityA,
                relationType,
                targetId: isEntityA ? rel.entity_b_id : rel.entity_a_id,
                targetType: isEntityA ? rel.entity_b_type : rel.entity_a_type
            };
        });
}

/**
 * Get the note for a relation from the perspective of a specific entity
 * 
 * For asymmetric relations, the note describes what the OTHER entity is.
 * Example: If Lissandra is "master" of Trundle:
 *   - From Lissandra's perspective: note describes Trundle as "Serviteur"
 *   - From Trundle's perspective: use note_inverse if available, otherwise format the inverse type
 * 
 * @param relation - The relation object
 * @param isEntityA - Whether we're viewing from entity A's perspective
 * @param relationType - The relation type (already inverted if needed)
 * @param locale - Locale string (e.g., 'fr_FR' or 'en_US')
 * @returns The appropriate note for this perspective
 */
export function getRelationNote(
    relation: Relation,
    isEntityA: boolean,
    relationType: RelationType,
    locale: string
): string | undefined {
    const useEnglish = locale.startsWith('en');

    // If we're entity A, use the regular note (describes entity B)
    if (isEntityA) {
        const note = useEnglish ? relation.note_en : relation.note_fr;
        // If no note, fall back to formatted relation type
        return note || formatRelationType(relationType, locale);
    }

    // If we're entity B, check for inverse notes first
    const inverseNote = useEnglish ? relation.note_inverse_en : relation.note_inverse_fr;
    if (inverseNote) {
        return inverseNote;
    }

    // No inverse note, fall back to formatted relation type
    // This ensures we always show something meaningful
    return formatRelationType(relationType, locale);
}

/**
 * Format a relation type for display
 * Returns a GENERIC name for the relationship (not describing a person)
 * Example: "Mentorat" instead of "Mentor", "Lien fraternel" instead of "Sœur"
 * 
 * @param relationType - The relation type
 * @param locale - Locale string
 * @returns Formatted relation type string (generic relationship name)
 */
export function formatRelationType(
    relationType: RelationType,
    locale: string
): string {
    const useEnglish = locale.startsWith('en');

    // Mapping of relation types to GENERIC relationship names
    const translations: Record<RelationType, { fr: string; en: string }> = {
        // Family - Generic names
        [RelationType.SISTER]: { fr: 'Lien fraternel', en: 'Sibling bond' },
        [RelationType.BROTHER]: { fr: 'Lien fraternel', en: 'Sibling bond' },
        [RelationType.TWIN_SISTER]: { fr: 'Gémellité', en: 'Twin bond' },
        [RelationType.TWIN_BROTHER]: { fr: 'Gémellité', en: 'Twin bond' },
        [RelationType.HALF_BROTHER]: { fr: 'Demi-fratrie', en: 'Half-sibling bond' },
        [RelationType.MOTHER]: { fr: 'Lien maternel', en: 'Maternal bond' },
        [RelationType.FATHER]: { fr: 'Lien paternel', en: 'Paternal bond' },
        [RelationType.PARENT]: { fr: 'Lien parental', en: 'Parental bond' },
        [RelationType.DAUGHTER]: { fr: 'Lien filial', en: 'Filial bond' },
        [RelationType.SON]: { fr: 'Lien filial', en: 'Filial bond' },
        [RelationType.ADOPTIVE_FATHER]: { fr: 'Adoption', en: 'Adoption' },
        [RelationType.ADOPTIVE_DAUGHTER]: { fr: 'Adoption', en: 'Adoption' },
        [RelationType.ADOPTIVE_BROTHER]: { fr: 'Fratrie adoptive', en: 'Adoptive sibling bond' },
        [RelationType.FAMILY]: { fr: 'Lien familial', en: 'Family bond' },
        [RelationType.FAMILY_ALLY]: { fr: 'Famille et alliance', en: 'Family and alliance' },
        [RelationType.FAMILY_RIVAL]: { fr: 'Famille et rivalité', en: 'Family and rivalry' },

        // Family combined
        [RelationType.SISTER_ALLY]: { fr: 'Fratrie et alliance', en: 'Sibling and alliance' },
        [RelationType.SISTER_ENEMY]: { fr: 'Fratrie et inimitié', en: 'Sibling and enmity' },
        [RelationType.SISTER_OPPOSED]: { fr: 'Fratrie et opposition', en: 'Sibling and opposition' },
        [RelationType.SISTER_RIVAL]: { fr: 'Fratrie et rivalité', en: 'Sibling and rivalry' },
        [RelationType.BROTHER_ALLY]: { fr: 'Fratrie et alliance', en: 'Sibling and alliance' },
        [RelationType.BROTHER_ENEMY]: { fr: 'Fratrie et inimitié', en: 'Sibling and enmity' },
        [RelationType.BROTHER_OPPOSED]: { fr: 'Fratrie et opposition', en: 'Sibling and opposition' },
        [RelationType.BROTHER_RIVAL]: { fr: 'Fratrie et rivalité', en: 'Sibling and rivalry' },

        // Alliances
        [RelationType.ALLY]: { fr: 'Alliance', en: 'Alliance' },
        [RelationType.FRIEND]: { fr: 'Amitié', en: 'Friendship' },

        // Mentor/Student
        [RelationType.MENTOR]: { fr: 'Mentorat', en: 'Mentorship' },
        [RelationType.STUDENT]: { fr: 'Mentorat', en: 'Mentorship' },
        [RelationType.STUDENT_ALLY]: { fr: 'Mentorat et alliance', en: 'Mentorship and alliance' },
        [RelationType.STUDENT_FAMILY_ADOPTIVE_SON]: { fr: 'Mentorat et adoption', en: 'Mentorship and adoption' },

        // Master/Subordinate
        [RelationType.MASTER]: { fr: 'Servitude', en: 'Servitude' },
        [RelationType.SLAVE]: { fr: 'Servitude', en: 'Servitude' },
        [RelationType.SERVANT]: { fr: 'Servitude', en: 'Servitude' },

        // Conflicts
        [RelationType.ENEMY]: { fr: 'Inimitié', en: 'Enmity' },
        [RelationType.RIVAL]: { fr: 'Rivalité', en: 'Rivalry' },
        [RelationType.NEMESIS]: { fr: 'Némésis', en: 'Nemesis' },
        [RelationType.CONFLICT]: { fr: 'Conflit', en: 'Conflict' },
        [RelationType.BETRAYER]: { fr: 'Trahison', en: 'Betrayal' },
        [RelationType.ENEMY_SHARED]: { fr: 'Ennemi commun', en: 'Shared enemy' },
        [RelationType.NEMESIS_EX_FRIEND]: { fr: 'Némésis (ex-ami)', en: 'Nemesis (ex-friend)' },
        [RelationType.NEMESIS_WAR]: { fr: 'Némésis de guerre', en: 'War nemesis' },
        [RelationType.RIVAL_ALLY]: { fr: 'Rivalité et alliance', en: 'Rivalry and alliance' },
        [RelationType.RIVAL_CORRUPTION]: { fr: 'Rivalité (corruption)', en: 'Rivalry (corruption)' },
        [RelationType.RIVAL_EX_ALLY]: { fr: 'Rivalité (ex-allié)', en: 'Rivalry (ex-ally)' },
        [RelationType.RIVAL_EX_BROTHER]: { fr: 'Rivalité (ex-frère)', en: 'Rivalry (ex-brother)' },
        [RelationType.RIVAL_EX_FRIEND]: { fr: 'Rivalité (ex-ami)', en: 'Rivalry (ex-friend)' },
        [RelationType.RIVAL_SECRET]: { fr: 'Rivalité secrète', en: 'Secret rivalry' },

        // Hunter/Prey
        [RelationType.HUNTER]: { fr: 'Chasse', en: 'Hunt' },
        [RelationType.PREY]: { fr: 'Chasse', en: 'Hunt' },
        [RelationType.TROPHY]: { fr: 'Trophée', en: 'Trophy' },

        // Killer
        [RelationType.KILLER]: { fr: 'Meurtre', en: 'Murder' },

        // Love
        [RelationType.LOVER]: { fr: 'Relation amoureuse', en: 'Romantic relationship' },
        [RelationType.WIFE]: { fr: 'Mariage', en: 'Marriage' },
        [RelationType.HUSBAND]: { fr: 'Mariage', en: 'Marriage' },
        [RelationType.ETERNAL_LOVER]: { fr: 'Amour éternel', en: 'Eternal love' },
        [RelationType.UNREQUITED_LOVE]: { fr: 'Amour non partagé', en: 'Unrequited love' },
        [RelationType.EX_LOVER]: { fr: 'Ancienne relation', en: 'Past relationship' },
        [RelationType.LOVE_CRUSH]: { fr: 'Béguin', en: 'Crush' },
        [RelationType.LOVE_FORBIDDEN]: { fr: 'Amour interdit', en: 'Forbidden love' },

        // Creation
        [RelationType.CREATOR]: { fr: 'Création', en: 'Creation' },
        [RelationType.CREATION]: { fr: 'Création', en: 'Creation' },

        // Special
        [RelationType.HOST]: { fr: 'Hôte', en: 'Host' },
        [RelationType.SELF]: { fr: 'Identité', en: 'Identity' },
        [RelationType.RELATED]: { fr: 'Lien', en: 'Connection' },
        [RelationType.LEADER_BLACK_ROSE]: { fr: 'Rose Noire', en: 'Black Rose' },
    };

    const translation = translations[relationType];
    if (!translation) {
        console.warn(`No translation found for relation type: ${relationType}`);
        return relationType;
    }

    return useEnglish ? translation.en : translation.fr;
}

/**
 * Group relations by type for display
 * 
 * @param relations - Array of relation metadata
 * @returns Object with relations grouped by type
 */
export function groupRelationsByType(
    relations: Array<{
        relation: Relation;
        isEntityA: boolean;
        relationType: RelationType;
        targetId: string;
        targetType: 'champion' | 'lore';
    }>
): Record<string, typeof relations> {
    const grouped: Record<string, typeof relations> = {};

    relations.forEach(rel => {
        const typeKey = rel.relationType;
        if (!grouped[typeKey]) {
            grouped[typeKey] = [];
        }
        grouped[typeKey].push(rel);
    });

    return grouped;
}
