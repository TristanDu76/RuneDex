import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE_DIRECTORY = path.join('public', 'map-tiles');
const OUTPUT_DIRECTORY = path.join('public', 'map-tiles-webp');
const MAX_ZOOM = Number(process.env.MAP_WEBP_MAX_ZOOM ?? 6);
const CONCURRENCY = 8;

function findTiles(maxZoom) {
  const tiles = [];

  for (let zoom = 0; zoom <= maxZoom; zoom += 1) {
    const zoomDirectory = path.join(SOURCE_DIRECTORY, String(zoom));
    if (!fs.existsSync(zoomDirectory)) continue;

    for (const y of fs.readdirSync(zoomDirectory)) {
      const yDirectory = path.join(zoomDirectory, y);
      if (!fs.statSync(yDirectory).isDirectory()) continue;

      for (const file of fs.readdirSync(yDirectory)) {
        if (file.endsWith('.png')) tiles.push(path.join(yDirectory, file));
      }
    }
  }

  return tiles;
}

export async function generateWebpMapTiles(maxZoom = MAX_ZOOM) {
  if (!Number.isInteger(maxZoom) || maxZoom < 0) {
    throw new Error('MAP_WEBP_MAX_ZOOM must be a non-negative integer.');
  }

  const tiles = findTiles(maxZoom);
  for (let index = 0; index < tiles.length; index += CONCURRENCY) {
    await Promise.all(tiles.slice(index, index + CONCURRENCY).map(async (sourcePath) => {
      const relativePath = path.relative(SOURCE_DIRECTORY, sourcePath).replace(/\.png$/, '.webp');
      const destinationPath = path.join(OUTPUT_DIRECTORY, relativePath);
      fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
      await sharp(sourcePath).webp({ quality: 82, alphaQuality: 90 }).toFile(destinationPath);
    }));
  }

  return tiles.length;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateWebpMapTiles().then((count) => {
    console.log(`Generated ${count} WebP map tiles through zoom ${MAX_ZOOM}.`);
  }).catch((error) => {
    console.error('WebP tile generation failed:', error);
    process.exitCode = 1;
  });
}
