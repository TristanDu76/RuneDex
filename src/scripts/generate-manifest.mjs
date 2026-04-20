import fs from 'fs';
import path from 'path';
import { z } from 'zod';

const DATA_DIR = path.join(process.cwd(), 'src/data');
const MANIFEST_PATH = path.join(DATA_DIR, 'manifest.json');
const SHARDS_DIR = path.join(DATA_DIR, 'shards');

if (!fs.existsSync(SHARDS_DIR)) {
    fs.mkdirSync(SHARDS_DIR, { recursive: true });
}

// SHARED LOGGING & STATS
const stats = {
    totalScanned: 0,
    totalPassed: 0,
    totalFailed: 0,
    reciprocityInjected: 0,
    bilingueWarnings: 0,
    orphanRelations: 0,
    suppressedInjectLogs: 0,
    suppressedOrphanLogs: 0
};

const VERBOSE_RELATIONS = process.env.VERBOSE_RELATIONS === '1';
const MAX_RELATION_LOGS = Number(process.env.MAX_RELATION_LOGS || 30);

function log(level, msg) {
    const prefix = { info: '✓', warn: '⚠', error: '✗' }[level] || '•';
    console.log(`[${prefix}] ${msg}`);
}

// Zod Schemas with STRICT validation
const IdSchema = z.string()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'ID must be kebab-case');

const RelationSchema = z.object({
    id: z.string().min(1),
    type: z.enum(['champion', 'lore', 'artifact', 'rune']).optional(),
    relation: z.string().min(1).optional(),
    auto_generated: z.boolean().optional().default(false),
    note_fr: z.string().optional(),
    note_en: z.string().optional()
});

const CharacterSchema = z.object({
    id: IdSchema,
    name: z.string().min(1),
    faction: z.union([z.string(), z.array(z.string())]).optional().nullable(),
    factions: z.array(z.string()).optional(),
    gender: z.union([z.string(), z.array(z.string())]).optional().nullable(),
    species: z.union([z.string(), z.array(z.string())]).optional().nullable(),
    description: z.string().optional().nullable(),
    description_fr: z.string().optional().nullable(),
    description_en: z.string().optional().nullable(),
    lore: z.string().optional().nullable(),
    lore_fr: z.string().optional().nullable(),
    lore_en: z.string().optional().nullable(),
    image: z.any().optional().nullable(),
    version: z.string().optional(),
    canon: z.boolean().optional().default(true),
    related_characters: z.array(z.union([z.string(), RelationSchema])).optional()
});

const manifest = { characters: {}, meta: { generated: new Date().toISOString(), integrity: { warnings: [] } } };
const shards = {};
const allIds = new Set();
const relationMap = new Map(); // Track all relations for bidirectional enforcement

/**
 * SLUG FUNCTIONS (ISOMORPHIC with frontend)
 * ✓ Used by build AND frontend for consistency
 * Source: src/lib/slug-config.ts (single source of truth)
 */
function slugify(text) {
    if (!text) return 'unknown';
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

function normalizeKey(text) {
    if (!text) return 'unknown';
    const base = text.split(',')[0].trim().replace(/\s*\([^)]*\)/g, '').trim();
    return slugify(base);
}

function normalizeRelatedCharacters(relatedCharacters, defaultType = 'lore') {
    if (!Array.isArray(relatedCharacters)) return [];

    return relatedCharacters
        .map((entry) => {
            if (typeof entry === 'string') {
                return {
                    id: normalizeKey(entry),
                    type: defaultType,
                    relation: 'mentioned',
                    auto_generated: false
                };
            }

            if (entry && typeof entry === 'object') {
                return {
                    ...entry,
                    id: normalizeKey(entry.id),
                    type: entry.type || defaultType,
                    relation: entry.relation || 'related',
                    note_fr: entry.note_fr && entry.note_en ? entry.note_fr : undefined,
                    note_en: entry.note_fr && entry.note_en ? entry.note_en : undefined,
                    auto_generated: entry.auto_generated === true
                };
            }

            return null;
        })
        .filter(Boolean);
}

function processDirectory(dirName, type) {
    const dirPath = path.join(DATA_DIR, dirName);
    if (!fs.existsSync(dirPath)) return;

    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json') && f !== 'index.json');
    log('info', `Scanning ${dirName} (${files.length} files)...`);

    for (const file of files) {
        stats.totalScanned++;
        try {
            const rawData = JSON.parse(fs.readFileSync(path.join(dirPath, file), 'utf8'));
            const char = CharacterSchema.parse(rawData);
            stats.totalPassed++;

            const id = char.id.toLowerCase();
            allIds.add(id);

            const normalizedRelations = normalizeRelatedCharacters(char.related_characters, type === 'champion' ? 'champion' : 'lore');

            // BILINGUAL CHECK: warn if incomplete
            if (type === 'champion' && char.lore && !char.lore_en) {
                stats.bilingueWarnings++;
                manifest.meta.integrity.warnings.push(`${id}: lore_en missing`);
                log('warn', `${id}: lore_en missing (bilingual enforcement)`);
            }

            if (type === 'lore') {
                const hasDescFr = Boolean(char.description_fr);
                const hasDescEn = Boolean(char.description_en);
                if (hasDescFr !== hasDescEn) {
                    stats.bilingueWarnings++;
                    manifest.meta.integrity.warnings.push(`${id}: description_fr/description_en incomplete`);
                    log('warn', `${id}: description_fr/description_en incomplete (bilingual enforcement)`);
                }

                const hasLoreFr = Boolean(char.lore_fr);
                const hasLoreEn = Boolean(char.lore_en);
                if (hasLoreFr !== hasLoreEn) {
                    stats.bilingueWarnings++;
                    manifest.meta.integrity.warnings.push(`${id}: lore_fr/lore_en incomplete`);
                    log('warn', `${id}: lore_fr/lore_en incomplete (bilingual enforcement)`);
                }
            }

            let thumbnail = '';
            if (type === 'champion' && char.image && char.image.full) {
                thumbnail = `https://ddragon.leagueoflegends.com/cdn/${char.version || '15.23.1'}/img/champion/${char.image.full}`;
            } else if (type === 'lore' && char.image && typeof char.image === 'string') {
                thumbnail = char.image;
            } else {
                thumbnail = 'https://wiki.leagueoflegends.com/en-us/images/Unknown_Character.png';
            }

            const factionFromField = Array.isArray(char.faction) ? char.faction[0] : char.faction;
            const factionRaw = factionFromField || (char.factions && char.factions[0]) || 'Unknown';
            const factionKey = normalizeKey(factionRaw);

            manifest.characters[id] = {
                id: id,
                name: char.name,
                thumbnail: thumbnail,
                factionKey: factionKey,
                type: type,
                canon: char.canon !== false,
                version: char.version,
                related_characters: normalizedRelations
            };

            // TRACK ALL RELATIONS for bidirectional injection
            const rels = new Set();
            if (normalizedRelations.length > 0) {
                normalizedRelations.forEach(r => {
                    const relId = r.id.toLowerCase();
                    rels.add(relId);
                });
            }
            relationMap.set(id, rels);

            if (!shards[factionKey]) shards[factionKey] = [];
            shards[factionKey].push(id);

        } catch (e) {
            stats.totalFailed++;
            // 🎯 IMPROVED ERROR: Include file path + field context
            let fieldPath = 'unknown';
            let details = e.message;
            if (e.issues && e.issues[0]) {
                fieldPath = e.issues[0].path.join('.');
                details = e.issues[0].message;
            }
            const errorMsg = `${dirName}/${file} → [${fieldPath}] ${details}`;
            log('error', errorMsg);
            manifest.meta.integrity.warnings.push(errorMsg);
        }
    }
}

log('info', '═══════════════════════════════════════════');
log('info', 'PHASE 1: Scan Data Files');
log('info', '═══════════════════════════════════════════');
processDirectory('champions', 'champion');
processDirectory('lore-characters', 'lore');

log('info', `Scanned: ${stats.totalScanned} | Passed: ${stats.totalPassed} | Failed: ${stats.totalFailed}`);

// ✓ PHASE 2: BIDIRECTIONAL RELATION INJECTION
log('info', '═══════════════════════════════════════════');
log('info', 'PHASE 2: Enforce Reciprocal Relations');
log('info', '═══════════════════════════════════════════');

const snapshot = Array.from(relationMap.entries());
snapshot.forEach(([id, rels]) => {
    rels.forEach(targetId => {
        if (manifest.characters[targetId]) {
            const targetRels = relationMap.get(targetId) || new Set();
            
            // Check if reverse relation exists
            if (!targetRels.has(id)) {
                // AUTO-INJECT reciprocal relation
                // 🎯 MARK WITH auto_generated: true so frontend can distinguish manual vs auto
                manifest.characters[targetId].related_characters.push({
                    id,
                    type: manifest.characters[id].type,
                    relation: 'related',
                    auto_generated: true,  // ← NEW: Allows frontend to render differently
                    note_fr: 'Lien réciproque automatique',
                    note_en: 'Auto-generated reciprocal link'
                });
                stats.reciprocityInjected++;
                if (VERBOSE_RELATIONS || stats.reciprocityInjected <= MAX_RELATION_LOGS) {
                    log('info', `Injected: ${targetId} ← ${id} [auto-generated]`);
                } else {
                    stats.suppressedInjectLogs++;
                }
            }
        } else {
            // ORPHAN RELATION DETECTED
            stats.orphanRelations++;
            manifest.meta.integrity.warnings.push(`Orphan relation: ${id} → ${targetId} (target not found)`);
            if (VERBOSE_RELATIONS || stats.orphanRelations <= MAX_RELATION_LOGS) {
                log('warn', `Orphan: ${id} → ${targetId} (${targetId} not in manifest)`);
            } else {
                stats.suppressedOrphanLogs++;
            }
        }
    });
});

if (!VERBOSE_RELATIONS) {
    if (stats.suppressedInjectLogs > 0) {
        log('info', `Injected logs suppressed: ${stats.suppressedInjectLogs} (set VERBOSE_RELATIONS=1 to show all)`);
    }
    if (stats.suppressedOrphanLogs > 0) {
        log('warn', `Orphan logs suppressed: ${stats.suppressedOrphanLogs} (set VERBOSE_RELATIONS=1 to show all)`);
    }
}

// ✓ PHASE 2B: CLASSIFY ENTRIES (canon/legacy/wip)
log('info', '═══════════════════════════════════════════');
log('info', 'PHASE 2B: Classify Entries (Canon/Legacy)');
log('info', '═══════════════════════════════════════════');

const classifications = {
    canonical: [],
    legacy: [],
    wip: []
};

Object.entries(manifest.characters).forEach(([id, char]) => {
    if (char.version?.startsWith('wip-')) {
        classifications.wip.push({ id, version: char.version });
    } else if (!char.canon) {
        classifications.legacy.push({ id, version: char.version });
    } else {
        classifications.canonical.push(id);
    }
});

log('info', `Canonical: ${classifications.canonical.length}`);
log('info', `Legacy: ${classifications.legacy.length}`);
log('info', `WIP: ${classifications.wip.length}`);

manifest.meta.classifications = classifications;

// ✓ PHASE 3: WRITE MANIFEST & SHARDS
log('info', '═══════════════════════════════════════════');
log('info', 'PHASE 3: Write Manifest & Generate Shards');
log('info', '═══════════════════════════════════════════');

log('info', `Writing manifest and ${Object.keys(shards).length} shards...`);
fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

for (const [key, ids] of Object.entries(shards)) {
    const data = ids.map(id => manifest.characters[id]);
    fs.writeFileSync(path.join(SHARDS_DIR, `${key}.json`), JSON.stringify(data, null, 2));
}

log('info', '═══════════════════════════════════════════');
log('info', 'SUMMARY');
log('info', '═══════════════════════════════════════════');
log('info', `Total Scanned: ${stats.totalScanned}`);
log('info', `Passed: ${stats.totalPassed}`);
log('info', `Failed: ${stats.totalFailed}`);
log('info', `Reciprocity Injected: ${stats.reciprocityInjected}`);
log('info', `Orphan Relations: ${stats.orphanRelations}`);
log('info', `Bilingual Warnings: ${stats.bilingueWarnings}`);
log('info', `Entries in Manifest: ${Object.keys(manifest.characters).length}`);
log('info', `Shards Generated: ${Object.keys(shards).length}`);
if (manifest.meta.integrity.warnings.length > 0) {
    log('warn', `Integrity Issues: ${manifest.meta.integrity.warnings.length}`);
    manifest.meta.integrity.warnings.slice(0, 5).forEach(w => log('warn', `  - ${w}`));
    if (manifest.meta.integrity.warnings.length > 5) {
        log('warn', `  ... and ${manifest.meta.integrity.warnings.length - 5} more`);
    }
}
log('info', '✓ Build Complete!');
