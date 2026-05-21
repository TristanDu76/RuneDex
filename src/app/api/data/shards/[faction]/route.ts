import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SHARDS_DIRECTORY = path.resolve(process.cwd(), 'src/data/shards');

const ALLOWED_SHARDS = new Set([
    'ancient',
    'baleful-guard',
    'bandle-city',
    'bilgewater',
    'black-rose',
    'chem-barons',
    'church-of-the-glorious-evolved',
    'clan-kiramman',
    'council-of-piltover',
    'crimson-circle',
    'darkin',
    'dauntless-vanguard',
    'demacia',
    'freljord',
    'house-crownguard',
    'house-darkwill',
    'house-lightshield',
    'house-medarda',
    'icathia',
    'independent',
    'ionia',
    'ixtal',
    'kinkou-order',
    'lunari',
    'mageseekers',
    'mount-targon',
    'navori-brotherhood',
    'ninth-battalion',
    'noxus',
    'piltover-enforcers',
    'piltover',
    'rakkor',
    'reckoners',
    'runeterra',
    'sentinels-of-light',
    'shadow-isles',
    'shurima',
    'slickjaws',
    'sludgerunners',
    'sumpsnipes',
    'syrens',
    'targon',
    'the-hush-company',
    'the-scrap-hackers',
    'the-vyx',
    'trifarian-legion',
    'unknown',
    'unnamed-clan-in-the',
    'void',
    'winters-claw',
    'wuju-order',
    'zaun',
]);

function resolveShardPath(faction: string): string | null {
    if (!ALLOWED_SHARDS.has(faction)) {
        return null;
    }

    const shardPath = path.resolve(SHARDS_DIRECTORY, `${faction}.json`);
    const relativePath = path.relative(SHARDS_DIRECTORY, shardPath);

    if (
        relativePath === '..' ||
        relativePath.startsWith(`..${path.sep}`) ||
        path.isAbsolute(relativePath)
    ) {
        return null;
    }

    return shardPath;
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ faction: string }> }
) {
    const { faction } = await params;
    const shardPath = resolveShardPath(faction);

    if (shardPath && fs.existsSync(shardPath)) {
        const fileContent = fs.readFileSync(shardPath, 'utf8');
        return NextResponse.json(JSON.parse(fileContent));
    }

    return NextResponse.json({ error: 'Shard not found' }, { status: 404 });
}
