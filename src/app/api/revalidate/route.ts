import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

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

        // 2. Invalider tout le cache du site
        // C'est plus simple et plus robuste que les tags pour l'instant
        console.log(`[Revalidate] Purging global cache due to change in table: ${table}`);
        revalidatePath('/', 'layout');

        return NextResponse.json({ revalidated: true, now: Date.now() });
    } catch (err) {
        return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
    }
}
