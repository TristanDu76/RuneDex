/**
 * Types and utilities for the relations system
 */

// ============================================================================
// RELATION TYPES ENUM
// ============================================================================

export enum RelationType {
    // Family - Direct
    SISTER = 'sister',
    BROTHER = 'brother',
    TWIN_SISTER = 'twin-sister',
    TWIN_BROTHER = 'twin-brother',
    HALF_BROTHER = 'half-brother',
    MOTHER = 'mother',
    FATHER = 'father',
    PARENT = 'parent',
    DAUGHTER = 'daughter',
    SON = 'son',

    // Family - Adoptive
    ADOPTIVE_FATHER = 'adoptive-father',
    ADOPTIVE_DAUGHTER = 'adoptive-daughter',
    ADOPTIVE_BROTHER = 'adoptive-brother',

    // Family - Complex
    FAMILY = 'family',
    FAMILY_ALLY = 'family/ally',
    FAMILY_RIVAL = 'family/rival',

    // Family - Combined with other relations
    SISTER_ALLY = 'sister/ally',
    SISTER_ENEMY = 'sister/enemy',
    SISTER_OPPOSED = 'sister/opposed',
    SISTER_RIVAL = 'sister/rival',
    BROTHER_ALLY = 'brother/ally',
    BROTHER_ENEMY = 'brother/enemy',
    BROTHER_OPPOSED = 'brother/opposed',
    BROTHER_RIVAL = 'brother/rival',

    // Alliances
    ALLY = 'ally',
    FRIEND = 'friend',

    // Mentor/Student
    MENTOR = 'mentor',
    STUDENT = 'student',
    STUDENT_ALLY = 'student/ally',
    STUDENT_FAMILY_ADOPTIVE_SON = 'student/family/adoptive-son',

    // Master/Subordinate
    MASTER = 'master',
    SLAVE = 'slave',
    SERVANT = 'servant',

    // Conflicts
    ENEMY = 'enemy',
    RIVAL = 'rival',
    NEMESIS = 'nemesis',
    CONFLICT = 'conflict',
    BETRAYER = 'betrayer',

    // Conflicts - Complex
    ENEMY_SHARED = 'enemy/shared',
    NEMESIS_EX_FRIEND = 'nemesis/ex-friend',
    NEMESIS_WAR = 'nemesis/war',
    RIVAL_ALLY = 'rival/ally',
    RIVAL_CORRUPTION = 'rival/corruption',
    RIVAL_EX_ALLY = 'rival/ex-ally',
    RIVAL_EX_BROTHER = 'rival/ex-brother',
    RIVAL_EX_FRIEND = 'rival/ex-friend',
    RIVAL_SECRET = 'rival/secret',

    // Hunter/Prey
    HUNTER = 'hunter',
    PREY = 'prey',
    TROPHY = 'trophy',

    // Killer/Victim
    KILLER = 'killer',

    // Love
    LOVER = 'lover',
    WIFE = 'wife',
    HUSBAND = 'husband',
    ETERNAL_LOVER = 'eternal-lover',
    UNREQUITED_LOVE = 'unrequited-love',
    EX_LOVER = 'ex-lover',
    LOVE_CRUSH = 'love/crush',
    LOVE_FORBIDDEN = 'love/forbidden',

    // Creation
    CREATOR = 'creator',
    CREATION = 'creation',

    // Special
    HOST = 'host',
    SELF = 'self',
    RELATED = 'related',
    LEADER_BLACK_ROSE = 'leader/black-rose',
}

// ============================================================================
// SYMMETRIC RELATIONS
// ============================================================================

/**
 * Relations that are the same in both directions
 * Example: If A is sister of B, then B is sister of A
 */
export const SYMMETRIC_RELATIONS = new Set<RelationType>([
    RelationType.SISTER,
    RelationType.BROTHER,
    RelationType.TWIN_SISTER,
    RelationType.TWIN_BROTHER,
    RelationType.HALF_BROTHER,
    RelationType.ALLY,
    RelationType.FRIEND,
    RelationType.ENEMY,
    RelationType.RIVAL,
    RelationType.CONFLICT,
    RelationType.LOVER,
    RelationType.ETERNAL_LOVER,
    RelationType.EX_LOVER,
    RelationType.RELATED,

    // Complex symmetric relations
    RelationType.SISTER_ALLY,
    RelationType.SISTER_ENEMY,
    RelationType.SISTER_OPPOSED,
    RelationType.SISTER_RIVAL,
    RelationType.BROTHER_ALLY,
    RelationType.BROTHER_ENEMY,
    RelationType.BROTHER_OPPOSED,
    RelationType.BROTHER_RIVAL,
    RelationType.FAMILY_ALLY,
    RelationType.FAMILY_RIVAL,
    RelationType.RIVAL_ALLY,
    RelationType.RIVAL_EX_ALLY,
    RelationType.RIVAL_EX_BROTHER,
    RelationType.RIVAL_EX_FRIEND,
    RelationType.NEMESIS_EX_FRIEND,
    RelationType.LOVE_FORBIDDEN,
]);

// ============================================================================
// INVERSE RELATIONS MAPPING
// ============================================================================

/**
 * Mapping of asymmetric relations to their inverse
 * Example: If A is mentor of B, then B is student of A
 */
export const INVERSE_RELATIONS: Record<string, RelationType> = {
    // Mentor/Student
    [RelationType.MENTOR]: RelationType.STUDENT,
    [RelationType.STUDENT]: RelationType.MENTOR,
    [RelationType.STUDENT_ALLY]: RelationType.MENTOR, // Approximation

    // Master/Slave
    [RelationType.MASTER]: RelationType.SLAVE,
    [RelationType.SLAVE]: RelationType.MASTER,

    // Family - Parent/Child
    [RelationType.MOTHER]: RelationType.DAUGHTER, // or SON, context-dependent
    [RelationType.FATHER]: RelationType.SON, // or DAUGHTER, context-dependent
    [RelationType.PARENT]: RelationType.SON, // or DAUGHTER, context-dependent
    [RelationType.DAUGHTER]: RelationType.PARENT, // or MOTHER/FATHER
    [RelationType.SON]: RelationType.PARENT, // or MOTHER/FATHER

    // Adoptive Family
    [RelationType.ADOPTIVE_FATHER]: RelationType.ADOPTIVE_DAUGHTER, // or adoptive-son
    [RelationType.ADOPTIVE_DAUGHTER]: RelationType.ADOPTIVE_FATHER,
    [RelationType.STUDENT_FAMILY_ADOPTIVE_SON]: RelationType.MENTOR, // Complex case

    // Love
    [RelationType.WIFE]: RelationType.HUSBAND,
    [RelationType.HUSBAND]: RelationType.WIFE,
    [RelationType.UNREQUITED_LOVE]: RelationType.FRIEND, // Approximation
    [RelationType.LOVE_CRUSH]: RelationType.FRIEND, // Approximation

    // Hunter/Prey
    [RelationType.HUNTER]: RelationType.PREY,
    [RelationType.PREY]: RelationType.HUNTER,
    [RelationType.TROPHY]: RelationType.HUNTER, // Approximation

    // Killer
    [RelationType.KILLER]: RelationType.ENEMY, // Victim doesn't exist as type

    // Creator/Creation
    [RelationType.CREATOR]: RelationType.CREATION,
    [RelationType.CREATION]: RelationType.CREATOR,

    // Special
    [RelationType.HOST]: RelationType.RELATED, // Approximation
    [RelationType.SELF]: RelationType.SELF,
    [RelationType.BETRAYER]: RelationType.ENEMY, // Approximation
    [RelationType.NEMESIS]: RelationType.NEMESIS, // Can be symmetric
    [RelationType.NEMESIS_WAR]: RelationType.NEMESIS_WAR, // Symmetric
    [RelationType.RIVAL_CORRUPTION]: RelationType.ENEMY, // Approximation
    [RelationType.RIVAL_SECRET]: RelationType.RIVAL_SECRET, // Symmetric
    [RelationType.ENEMY_SHARED]: RelationType.ENEMY_SHARED, // Symmetric
    [RelationType.LEADER_BLACK_ROSE]: RelationType.ALLY, // Approximation
};

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Old bidirectional relation format (for migration)
 */
export interface OldRelation {
    id: string;
    created_at: string;
    source_champion_id: string | null;
    source_lore_id: string | null;
    target_champion_id: string | null;
    target_lore_id: string | null;
    type: string;
    note_fr: string | null;
    note_en: string | null;
}

/**
 * New unidirectional relation format
 */
export interface Relation {
    id: string;
    created_at: string;
    entity_a_id: string;
    entity_a_type: 'champion' | 'lore';
    entity_b_id: string;
    entity_b_type: 'champion' | 'lore';
    relation_type: RelationType;
    note_fr?: string;
    note_en?: string;
    // Optional inverse notes for asymmetric relations
    // Used when entity_b views the relation (what entity_a is to entity_b)
    note_inverse_fr?: string;
    note_inverse_en?: string;
}

/**
 * Enriched relation for display (with target entity data)
 */
export interface EnrichedRelation {
    type: string;
    note?: string;
    target: {
        id: string;
        name: string;
        image?: string;
        type: 'champion' | 'lore';
    };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get the inverse type of a relation
 */
export function getInverseRelationType(relationType: RelationType): RelationType {
    // If it's a symmetric relation, return the same type
    if (SYMMETRIC_RELATIONS.has(relationType)) {
        return relationType;
    }

    // Otherwise, look up in the inverse mapping
    const inverse = INVERSE_RELATIONS[relationType];
    if (inverse) {
        return inverse;
    }

    // Fallback: return the same type (treat as symmetric)
    console.warn(`No inverse mapping found for relation type: ${relationType}`);
    return relationType;
}

/**
 * Check if a relation type is symmetric
 */
export function isSymmetricRelation(relationType: RelationType): boolean {
    return SYMMETRIC_RELATIONS.has(relationType);
}

/**
 * Get all relations for a specific entity (champion or lore character)
 * This function handles bidirectional lookup in the unidirectional format
 */
export function getRelationsForEntity(
    relations: Relation[],
    entityId: string,
    entityType: 'champion' | 'lore'
): Array<{
    relation: Relation;
    isEntityA: boolean;
    relationType: RelationType;
}> {
    return relations
        .filter(rel =>
            (rel.entity_a_id === entityId && rel.entity_a_type === entityType) ||
            (rel.entity_b_id === entityId && rel.entity_b_type === entityType)
        )
        .map(rel => {
            const isEntityA = rel.entity_a_id === entityId && rel.entity_a_type === entityType;
            const relationType = isEntityA ? rel.relation_type : getInverseRelationType(rel.relation_type);

            return {
                relation: rel,
                isEntityA,
                relationType
            };
        });
}
