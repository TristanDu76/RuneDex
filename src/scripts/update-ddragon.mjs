import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateQuizData } from './generate-quiz-data.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_DATA_DIR = path.join(__dirname, '../data');

export async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
}

export async function run({
    dataDir = DEFAULT_DATA_DIR,
    fetchJsonFn = fetchJson,
    force = process.argv.includes('--force'),
    now = () => new Date().toISOString()
} = {}) {
    const championsDir = path.join(dataDir, 'champions');
    const versionFile = path.join(dataDir, 'version.json');
    const summaryFile = path.join(dataDir, 'champions-summary.json');
    const indexFile = path.join(championsDir, 'index.json');

    console.log('Fetching latest DDragon version...');
    const versions = await fetchJsonFn('https://ddragon.leagueoflegends.com/api/versions.json');
    const latestVersion = versions[0];

    const currentVersion = fs.existsSync(versionFile)
        ? JSON.parse(fs.readFileSync(versionFile, 'utf8')).version
        : '0.0.0';

    console.log(`Current: ${currentVersion} | Latest patch: ${latestVersion}`);
    if (currentVersion === latestVersion && !force) {
        console.log('Already on the latest DDragon version! Use --force to update anyway.');
        return { skipped: true, latestVersion };
    }

    console.log(`Downloading champion profiles for patch ${latestVersion}...`);

    const frData = await fetchJsonFn(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/fr_FR/championFull.json`);
    const enData = await fetchJsonFn(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/championFull.json`);

    const championsToProcess = Object.keys(enData.data);
    let updatedCount = 0;
    let newCount = 0;

    const summaryArray = [];
    const indexArray = [];

    // Ensure the directories exist
    if (!fs.existsSync(championsDir)) {
        fs.mkdirSync(championsDir, { recursive: true });
    }

    for (const champId of championsToProcess) {
        const enChamp = enData.data[champId];
        const frChamp = frData.data[champId];
        const localPath = path.join(championsDir, `${champId}.json`);

        let localData = {
            factions: ["unknown"],
            custom_tags: null,
            gender: "Unknown",
            species: "Unknown",
            lanes: [],
            related_characters: [],
            created_at: now()
        };

        if (fs.existsSync(localPath)) {
            try {
                const existing = JSON.parse(fs.readFileSync(localPath, 'utf8'));
                localData.factions = existing.factions || localData.factions;
                localData.gender = existing.gender || localData.gender;
                localData.species = existing.species || localData.species;
                localData.lanes = existing.lanes || localData.lanes;
                localData.related_characters = existing.related_characters || localData.related_characters;
                localData.created_at = existing.created_at || localData.created_at;
                localData.custom_tags = existing.custom_tags || localData.custom_tags;
            } catch {
                console.error(`Failed to read ${champId}.json. Overwriting with defaults...`);
            }
            updatedCount++;
        } else {
            console.log(`[NEW ITEM] Creating new champion file for: ${champId}`);
            newCount++;
        }

        const finalChampion = {
            id: champId,
            key: enChamp.key,
            name: frChamp.name,
            title: frChamp.title,
            version: latestVersion,
            lore: frChamp.lore,
            tags: enChamp.tags,
            partype: frChamp.partype,
            image: enChamp.image,
            spells: frChamp.spells.map((s) => ({
                id: s.id,
                name: s.name,
                vars: s.vars || [],
                image: s.image,
                maxammo: s.maxammo,
                maxrank: s.maxrank,
                tooltip: s.tooltip,
                costBurn: s.costBurn,
                costType: s.costType,
                leveltip: s.leveltip,
                resource: s.resource,
                rangeBurn: s.rangeBurn,
                datavalues: s.datavalues || {},
                description: s.description,
                cooldownBurn: s.cooldownBurn
            })),
            passive: {
                name: frChamp.passive.name,
                image: frChamp.passive.image,
                description: frChamp.passive.description
            },
            created_at: localData.created_at,
            factions: localData.factions,
            custom_tags: localData.custom_tags,
            gender: localData.gender,
            species: localData.species,
            title_en: enChamp.title,
            lore_en: enChamp.lore,
            spells_en: enChamp.spells.map((s) => ({
                id: s.id,
                name: s.name,
                vars: s.vars || [],
                image: s.image,
                maxammo: s.maxammo,
                maxrank: s.maxrank,
                tooltip: s.tooltip,
                costBurn: s.costBurn,
                costType: s.costType,
                leveltip: s.leveltip,
                resource: s.resource,
                rangeBurn: s.rangeBurn,
                datavalues: s.datavalues || {},
                description: s.description,
                cooldownBurn: s.cooldownBurn
            })),
            passive_en: {
                name: enChamp.passive.name,
                image: enChamp.passive.image,
                description: enChamp.passive.description
            },
            partype_en: enChamp.partype,
            lanes: localData.lanes,
            skins_en: enChamp.skins.filter(s => s.parentSkin === undefined),
            skins: frChamp.skins.filter(s => s.parentSkin === undefined),
            related_characters: localData.related_characters
        };

        fs.writeFileSync(localPath, JSON.stringify(finalChampion, null, 2));

        // Push lightweight chunk to the high performance summary file
        summaryArray.push({
            id: champId,
            key: enChamp.key,
            name: frChamp.name,
            title: frChamp.title,
            version: latestVersion,
            image: enChamp.image,
            tags: enChamp.tags,
            partype: frChamp.partype,
            info: enChamp.info,
            stats: enChamp.stats,
            factions: localData.factions,
            faction: localData.factions.length > 0 ? localData.factions[0] : null,
            gender: localData.gender,
            species: localData.species,
            lanes: localData.lanes
        });

        // Keeps backwards compatibility heavily
        indexArray.push({
            id: champId,
            name: frChamp.name,
            key: enChamp.key,
            image: enChamp.image
        });
    }

    fs.writeFileSync(summaryFile, JSON.stringify(summaryArray, null, 2));
    fs.writeFileSync(indexFile, JSON.stringify(indexArray, null, 2));
    fs.writeFileSync(versionFile, JSON.stringify({ version: latestVersion, updated_at: now() }, null, 2));
    generateQuizData(dataDir);

    console.log(`\nUpdate complete! => ${updatedCount} champs updated, ${newCount} created. Patch ${latestVersion}.`);

    return { skipped: false, latestVersion, updatedCount, newCount };
}

export async function runCli(runUpdate = run) {
    try {
        return await runUpdate();
    } catch (error) {
        console.error(error);
        process.exitCode = 1;
    }
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    void runCli();
}
