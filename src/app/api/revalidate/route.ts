import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
    const expectedSecret = process.env.REVALIDATE_TOKEN;
    const secret = request.headers.get('x-revalidate-token');

    if (!expectedSecret || !secret || secret !== expectedSecret) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    if (
        !body ||
        typeof body !== 'object' ||
        Array.isArray(body) ||
        typeof (body as { table?: unknown }).table !== 'string' ||
        !(body as { table: string }).table.trim()
    ) {
        return NextResponse.json({ message: 'Missing table name' }, { status: 400 });
    }

    try {
        // 2. Invalider tout le cache du site
        // C'est plus simple et plus robuste que les tags pour l'instant
        console.log(`[Revalidate] Purging global cache due to change in table: ${(body as { table: string }).table}`);
        revalidatePath('/', 'layout');

        return NextResponse.json({ revalidated: true, now: Date.now() });
    } catch {
        return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
    }
}
