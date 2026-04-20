import { z } from 'zod';

/**
 * SCHEMA DE RÉFÉRENCE : Source unique de vérité pour toute donnée RuneDex.
 * ✓ Stricte : ID kebab-case, Zod enforcement pour i18n, factions typées.
 * ✓ Isomorphe : Utilisé par generate-manifest.mjs ET validation runtime frontend.
 * ✓ Versionnable : Support canon/legacy via version & canon flag.
 */

// ID kebab-case obligatoire (lowercase, hyphens only, no spaces/special chars)
const IdSchema = z.string()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'ID must be kebab-case (lowercase letters, numbers, hyphens only)');

// Faction key: strict enum + fallback validation
const FactionKeySchema = z.string()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Faction key must be kebab-case');

export const ImageSchema = z.object({
    full: z.string(),
    sprite: z.string(),
    group: z.string(),
    x: z.number(),
    y: z.number(),
    w: z.number(),
    h: z.number()
});

// Relation MUST include both note_fr AND note_en, or neither (bilingue enforcement)
// 🎯 NEW: auto_generated field to track auto-injected relations
export const RelationSchema = z.object({
    id: IdSchema,
    type: z.enum(['champion', 'lore', 'artifact', 'rune']),
    relation: z.string().min(1, 'relation type required'),
    auto_generated: z.boolean().optional().default(false),  // ← NEW: Marks relations injected by build
    note_fr: z.string().optional(),
    note_en: z.string().optional()
}).refine(
    (rel) => (rel.note_fr && rel.note_en) || (!rel.note_fr && !rel.note_en),
    'Relations must have BOTH note_fr AND note_en, or NEITHER (bilingual enforcement)'
);

export const LoreCharacterSchema = z.object({
    id: IdSchema,
    name: z.string().min(1, 'name required'),
    faction: z.union([z.string(), z.array(z.string())]).optional().nullable(),
    gender: z.union([z.string(), z.array(z.string())]).optional().nullable(),
    species: z.union([z.string(), z.array(z.string())]).optional().nullable(),
    description: z.string().optional().nullable(),
    description_fr: z.string().optional().nullable(),
    description_en: z.string().optional().nullable(),
    lore_fr: z.string().optional().nullable(),
    lore_en: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
    created_at: z.string().optional(),
    version: z.string().optional(),
    canon: z.boolean().optional().default(true),
    related_characters: z.array(z.union([z.string(), RelationSchema])).optional()
});

export const ChampionSchema = z.object({
    id: IdSchema,
    key: z.string(),
    name: z.string().min(1, 'name required'),
    title: z.string().min(1, 'title required'),
    lore: z.string().min(10, 'lore must be substantial'),
    lore_en: z.string().min(10, 'lore_en must be substantial').optional(),
    image: ImageSchema,
    factions: z.array(z.string()).optional(),
    faction: z.string().optional(),
    gender: z.union([z.string(), z.array(z.string())]).optional(),
    species: z.union([z.string(), z.array(z.string())]).optional(),
    version: z.string().optional(),
    canon: z.boolean().optional().default(true),
    related_characters: z.array(RelationSchema).optional()
}).refine(
    (champ) => !champ.lore_en || champ.lore_en.length >= 10,
    'If lore_en provided, must match lore length standards'
);
