import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const identity = (champion) => ({ id: champion.id, name: champion.name, version: champion.version, image: { full: champion.image.full } });

export function generateQuizData(dataDir = path.resolve(process.cwd(), 'src/data')) {
  const championsDirectory = path.join(dataDir, 'champions');
  const championIndex = JSON.parse(fs.readFileSync(path.join(championsDirectory, 'index.json'), 'utf8'));
  const champions = championIndex.map(({ id }) => JSON.parse(fs.readFileSync(path.join(championsDirectory, `${id}.json`), 'utf8')));
  const ability = champions.map((champion) => ({ ...identity(champion), spells: champion.spells?.map(({ name, image }) => ({ name, image: { full: image.full } })), passive: champion.passive ? { name: champion.passive.name, image: { full: champion.passive.image.full } } : undefined, spells_en: champion.spells_en?.map(({ name, image }) => ({ name, image: { full: image.full } })), passive_en: champion.passive_en ? { name: champion.passive_en.name, image: { full: champion.passive_en.image.full } } : undefined }));
  const skins = champions.map((champion) => ({ ...identity(champion), skins: champion.skins?.map(({ id, num, name }) => ({ id, num, name })), skins_en: champion.skins_en?.map(({ id, num, name }) => ({ id, num, name })) }));
  fs.writeFileSync(path.join(dataDir, 'quiz-ability.json'), JSON.stringify(ability, null, 2));
  fs.writeFileSync(path.join(dataDir, 'quiz-skins.json'), JSON.stringify(skins, null, 2));
  return { ability: ability.length, skins: skins.length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(`Generated quiz catalogs for ${generateQuizData().ability} champions.`);
