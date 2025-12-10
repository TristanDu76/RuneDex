import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
    try {
        const secret = request.headers.get('x-revalidate-token');

        // 1. Sécurité basique : vérifier le token secret
        if (secret !== process.env.REVALIDATE_TOKEN) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        const body = await request.json();
        const { table } = body;

        if (!table) {
            return NextResponse.json({ message: 'Missing table name' }, { status: 400 });
        }

        // 2. Invalider le tag correspondant à la table modifiée
        // Dans data.ts, nous avons utilisé des tags comme 'champions', 'lore', 'items', etc.
        // On peut mapper le nom de la table au tag si besoin, ou utiliser le nom de la table directement.
        // Ici, on assume que le tag = nom de la table (ex: table 'champions' -> tag 'champions')

        console.log(`[Revalidate] Purging cache for tag: ${table}`);
        revalidateTag(table);

        return NextResponse.json({ revalidated: true, now: Date.now() });
    } catch (err) {
        return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
    }
}
