import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ faction: string }> }
) {
    const { faction } = await params;
    const shardPath = path.join(process.cwd(), 'src/data/shards', `${faction}.json`);

    if (fs.existsSync(shardPath)) {
        const fileContent = fs.readFileSync(shardPath, 'utf8');
        return NextResponse.json(JSON.parse(fileContent));
    }

    return NextResponse.json({ error: 'Shard not found' }, { status: 404 });
}
