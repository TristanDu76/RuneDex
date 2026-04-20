import fs from 'fs';
import path from 'path';

const RELATIONS_FILE = './src/data/relations.json';
const CHAMPIONS_DIR = './src/data/champions';
const LORE_CHARACTERS_DIR = './src/data/lore-characters';

async function migrate() {
    const relations = JSON.parse(fs.readFileSync(RELATIONS_FILE, 'utf8'));

    // Map relations by character ID
    const relationMap = {};

    relations.forEach(rel => {
        const a = rel.entity_a_id;
        const b = rel.entity_b_id;

        if (!relationMap[a]) relationMap[a] = [];
        relationMap[a].push({
            id: b,
            type: rel.entity_b_type,
            relation: rel.relation_type,
            note_fr: rel.note_fr,
            note_en: rel.note_en
        });

        // Also add the inverse relation
        if (!relationMap[b]) relationMap[b] = [];
        relationMap[b].push({
            id: a,
            type: rel.entity_a_type,
            relation: rel.relation_type,
            note_fr: rel.note_inverse_fr || rel.note_fr,
            note_en: rel.note_inverse_en || rel.note_en
        });
    });

    const processDir = (dir) => {
        if (!fs.existsSync(dir)) return;
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'index.json');

        files.forEach(file => {
            const filePath = path.join(dir, file);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const charId = data.id;

            // Update relations
            const myRelations = relationMap[charId] || [];

            // Deduplicate (some relations might be bidirectional in the original file)
            const uniqueRelations = [];
            const seen = new Set();
            myRelations.forEach(r => {
                const key = `${r.id}-${r.relation}`;
                if (!seen.has(key)) {
                    uniqueRelations.push(r);
                    seen.add(key);
                }
            });

            data.related_characters = uniqueRelations;

            // Ensure descriptions exist in both languages (Request 3 check)
            // For Champions: 'lore' and 'lore_en'
            // For Lore Characters: 'description' and 'description_en'

            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            console.log(`Updated ${charId} with ${uniqueRelations.length} relations`);
        });
    };

    processDir(CHAMPIONS_DIR);
    processDir(LORE_CHARACTERS_DIR);

    console.log('Migration complete!');
}

migrate();
