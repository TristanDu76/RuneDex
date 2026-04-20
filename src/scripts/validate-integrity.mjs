#!/usr/bin/env node
/**
 * VALIDATION D'INTÉGRITÉ DES DONNÉES RUNEDEX
 * ✓ Vérifie que chaque région dans regions.ts existe dans manifest.json
 * ✓ Vérifie que chaque région a au moins 1 personnage associé
 * ✓ Détecte les orphelins et les mismatches ID
 * ✓ Vérifie la cohérence kebab-case across all systems
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '../..');
const MANIFEST_PATH = path.join(PROJECT_ROOT, 'src/data/manifest.json');
const REGIONS_PATH = path.join(PROJECT_ROOT, 'src/data/regions.ts');
const SHARDS_DIR = path.join(PROJECT_ROOT, 'src/data/shards');

const LOG_PREFIX = {
    check: '▪',
    pass: '✓',
    fail: '✗',
    warn: '⚠',
    info: '•'
};

const VERBOSE_INTEGRITY = process.env.VERBOSE_INTEGRITY === '1';
const MAX_FINAL_REPORT_ITEMS = Number(process.env.MAX_FINAL_REPORT_ITEMS || 15);
const MAX_PHASE_LOG_ITEMS = Number(process.env.MAX_PHASE_LOG_ITEMS || 15);

function log(type, msg) {
    const prefix = LOG_PREFIX[type] || '?';
    console.log(`[${prefix}] ${msg}`);
}

const issues = { warnings: [], errors: [] };

// LOAD MANIFEST
log('check', 'Loading manifest...');
let manifest;
try {
    const rawManifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    manifest = rawManifest;
    log('pass', `Manifest loaded: ${Object.keys(manifest.characters || {}).length} entries`);
} catch (e) {
    log('fail', `Cannot load manifest: ${e.message}`);
    process.exit(1);
}

// LOAD REGIONS
log('check', 'Parsing regions.ts...');
let regions = [];
try {
    const regionsSrc = fs.readFileSync(REGIONS_PATH, 'utf8');
    
    // Parse TypeScript array of objects with regex
    const regexMatch = regionsSrc.match(/export\s+const\s+regions\s*:\s*Region\[\]\s*=\s*\[([\s\S]*?)\]\s*;/);
    if (!regexMatch) {
        log('fail', 'Cannot parse exported regions array from regions.ts');
        process.exit(1);
    }
    
    // Extract all {id: "..."} patterns
    const idMatches = [...regexMatch[1].matchAll(/id:\s*['"]([^'"]+)['"]/g)];
    regions = idMatches.map(m => m[1]);
    
    log('pass', `Found ${regions.length} regions in TypeScript: ${regions.join(', ')}`);
} catch (e) {
    log('fail', `Cannot parse regions.ts: ${e.message}`);
    process.exit(1);
}

// LOAD SHARDS
log('check', 'Checking shards directory...');
const shardFiles = fs.readdirSync(SHARDS_DIR).filter(f => f.endsWith('.json'));
log('pass', `Found ${shardFiles.length} shard files`);

// === VALIDATION PHASE 1: Regional Integrity ===
log('info', '─────────────────────────────────────────────');
log('info', 'PHASE 1: Regional Integrity');
log('info', '─────────────────────────────────────────────');

const factionKeysInManifest = new Set(
    Object.values(manifest.characters || {})
        .map(c => c.factionKey)
        .filter(Boolean)
);

regions.forEach(region => {
    if (!factionKeysInManifest.has(region)) {
        issues.errors.push(`Region "${region}" has no associated characters in manifest`);
        log('fail', `Region "${region}": NO DATA FOUND`);
    } else {
        const regionChars = Object.values(manifest.characters || {})
            .filter(c => c.factionKey === region);
        log('pass', `Region "${region}": ${regionChars.length} characters`);
    }
});

// === VALIDATION PHASE 2: Orphan Detection ===
log('info', '─────────────────────────────────────────────');
log('info', 'PHASE 2: Orphan Detection');
log('info', '─────────────────────────────────────────────');

const orphans = Array.from(factionKeysInManifest).filter(fk => !regions.includes(fk));
if (orphans.length > 0) {
    const shownOrphans = VERBOSE_INTEGRITY ? orphans : orphans.slice(0, MAX_PHASE_LOG_ITEMS);
    shownOrphans.forEach(orphan => {
        issues.warnings.push(`Faction "${orphan}" has no corresponding region in regions.ts`);
        log('warn', `Orphan faction: "${orphan}" (not in regions.ts)`);
    });
    if (!VERBOSE_INTEGRITY && orphans.length > MAX_PHASE_LOG_ITEMS) {
        const hidden = orphans.length - MAX_PHASE_LOG_ITEMS;
        orphans.slice(MAX_PHASE_LOG_ITEMS).forEach(orphan => {
            issues.warnings.push(`Faction "${orphan}" has no corresponding region in regions.ts`);
        });
        log('warn', `... and ${hidden} more orphan factions (set VERBOSE_INTEGRITY=1 to show all)`);
    }
} else {
    log('pass', 'No orphan factions detected');
}

// === VALIDATION PHASE 3: Shard File Consistency ===
log('info', '─────────────────────────────────────────────');
log('info', 'PHASE 3: Shard File Consistency');
log('info', '─────────────────────────────────────────────');

let validShardCount = 0;
let shardWarnCount = 0;
shardFiles.forEach(shardFile => {
    const shardName = shardFile.replace('.json', '');
    const shardPath = path.join(SHARDS_DIR, shardFile);
    
    try {
        const shardData = JSON.parse(fs.readFileSync(shardPath, 'utf8'));
        
        // Check if shard corresponds to a known region
        if (!regions.includes(shardName)) {
            issues.warnings.push(`Shard file "${shardFile}" doesn't correspond to any region`);
            shardWarnCount++;
            if (VERBOSE_INTEGRITY || shardWarnCount <= MAX_PHASE_LOG_ITEMS) {
                log('warn', `Shard "${shardName}": not in regions.ts (orphan file)`);
            }
        }
        
        // Validate shard data structure
        if (!Array.isArray(shardData)) {
            issues.errors.push(`Shard "${shardName}": not an array`);
            log('fail', `Shard "${shardName}": invalid structure (not array)`);
        } else {
            const count = shardData.length;
            if (count === 0) {
                issues.warnings.push(`Shard "${shardName}": empty`);
                if (VERBOSE_INTEGRITY || shardWarnCount <= MAX_PHASE_LOG_ITEMS) {
                    log('warn', `Shard "${shardName}": empty (0 entries)`);
                }
            } else {
                validShardCount++;
                if (VERBOSE_INTEGRITY) {
                    log('pass', `Shard "${shardName}": ${count} entries`);
                }
            }
        }
    } catch (e) {
        issues.errors.push(`Shard "${shardFile}": parse error - ${e.message}`);
        log('fail', `Shard "${shardName}": ${e.message}`);
    }
});

if (!VERBOSE_INTEGRITY) {
    log('info', `Shard summary: ${validShardCount} valid, ${shardWarnCount} warnings`);
    if (shardWarnCount > MAX_PHASE_LOG_ITEMS) {
        log('warn', `... and ${shardWarnCount - MAX_PHASE_LOG_ITEMS} more shard warnings (set VERBOSE_INTEGRITY=1 to show all)`);
    }
}

// === VALIDATION PHASE 4: Bilingual Enforcement ===
log('info', '─────────────────────────────────────────────');
log('info', 'PHASE 4: Bilingual Enforcement (Sample Check)');
log('info', '─────────────────────────────────────────────');

const champCount = Object.values(manifest.characters || {}).filter(c => c.type === 'champion').length;
const relatedWithNotes = Object.values(manifest.characters || {})
    .flatMap(c => c.related_characters || [])
    .filter(r => r.note_fr || r.note_en)
    .length;

const incompleteBilingual = Object.values(manifest.characters || {})
    .flatMap(c => c.related_characters || [])
    .filter(r => (r.note_fr && !r.note_en) || (!r.note_fr && r.note_en))
    .slice(0, 5); // Show first 5

if (incompleteBilingual.length > 0) {
    issues.warnings.push(`Found relations with incomplete bilingual notes (checked first 5)`);
    incompleteBilingual.forEach(r => {
        log('warn', `Relation ${r.id}: incomplete notes (has ${r.note_fr ? 'FR' : ''}${r.note_en ? 'EN' : ''}, missing ${!r.note_fr ? 'FR' : ''}${!r.note_en ? 'EN' : ''})`);
    });
} else {
    log('pass', 'Bilingual enforcement: OK (sampled relations)');
}

// === VALIDATION PHASE 5: ID Format Consistency ===
log('info', '─────────────────────────────────────────────');
log('info', 'PHASE 5: ID Format Consistency (kebab-case)');
log('info', '─────────────────────────────────────────────');

const idRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const badIds = Object.keys(manifest.characters || {}).filter(id => !idRegex.test(id));

if (badIds.length > 0) {
    issues.errors.push(`${badIds.length} IDs don't match kebab-case format`);
    badIds.slice(0, 5).forEach(id => {
        log('fail', `Bad ID format: "${id}" (expected kebab-case)`);
    });
    if (badIds.length > 5) log('fail', `... and ${badIds.length - 5} more`);
} else {
    log('pass', 'All IDs follow kebab-case format');
}

// === FINAL REPORT ===
log('info', '─────────────────────────────────────────────');
log('info', 'INTEGRITY REPORT');
log('info', '─────────────────────────────────────────────');

if (issues.errors.length === 0 && issues.warnings.length === 0) {
    log('pass', '✓ All integrity checks passed!');
    process.exit(0);
} else {
    if (issues.errors.length > 0) {
        log('fail', `${issues.errors.length} ERROR(S) found:`);
        const shownErrors = VERBOSE_INTEGRITY ? issues.errors : issues.errors.slice(0, MAX_FINAL_REPORT_ITEMS);
        shownErrors.forEach((e, i) => log('fail', `  ${i + 1}. ${e}`));
        if (!VERBOSE_INTEGRITY && issues.errors.length > MAX_FINAL_REPORT_ITEMS) {
            log('fail', `  ... and ${issues.errors.length - MAX_FINAL_REPORT_ITEMS} more (set VERBOSE_INTEGRITY=1 to show all)`);
        }
    }
    if (issues.warnings.length > 0) {
        log('warn', `${issues.warnings.length} WARNING(S) found:`);
        const shownWarnings = VERBOSE_INTEGRITY ? issues.warnings : issues.warnings.slice(0, MAX_FINAL_REPORT_ITEMS);
        shownWarnings.forEach((w, i) => log('warn', `  ${i + 1}. ${w}`));
        if (!VERBOSE_INTEGRITY && issues.warnings.length > MAX_FINAL_REPORT_ITEMS) {
            log('warn', `  ... and ${issues.warnings.length - MAX_FINAL_REPORT_ITEMS} more (set VERBOSE_INTEGRITY=1 to show all)`);
        }
    }
    
    if (issues.errors.length > 0) {
        log('fail', '⚠ Build has errors. Fix before deploying.');
        process.exit(1);
    } else {
        log('info', '⚠ Build has warnings. Review before deploying.');
        process.exit(0);
    }
}
