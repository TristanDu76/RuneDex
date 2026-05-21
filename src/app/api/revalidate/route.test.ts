import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { revalidatePath } = vi.hoisted(() => ({ revalidatePath: vi.fn() }));

vi.mock('next/cache', () => ({ revalidatePath }));

import { POST } from './route';

const originalToken = process.env.REVALIDATE_TOKEN;

function request(token: string | null, body: string): NextRequest {
    const headers = new Headers({ 'content-type': 'application/json' });
    if (token !== null) headers.set('x-revalidate-token', token);

    return new NextRequest('http://localhost/api/revalidate', {
        method: 'POST',
        headers,
        body,
    });
}

describe('POST /api/revalidate', () => {
    beforeEach(() => {
        process.env.REVALIDATE_TOKEN = 'test-token';
        revalidatePath.mockReset();
    });

    afterEach(() => {
        if (originalToken === undefined) delete process.env.REVALIDATE_TOKEN;
        else process.env.REVALIDATE_TOKEN = originalToken;
    });

    it('rejects missing or invalid tokens', async () => {
        await expect(POST(request(null, '{"table":"champions"}'))).resolves.toMatchObject({ status: 401 });
        await expect(POST(request('wrong-token', '{"table":"champions"}'))).resolves.toMatchObject({ status: 401 });
        expect(revalidatePath).not.toHaveBeenCalled();
    });

    it('fails closed when no token is configured', async () => {
        delete process.env.REVALIDATE_TOKEN;

        await expect(POST(request('', '{"table":"champions"}'))).resolves.toMatchObject({ status: 401 });
        expect(revalidatePath).not.toHaveBeenCalled();
    });

    it('requires a non-empty table name', async () => {
        for (const body of ['{}', '{"table":""}', '{"table":123}', 'not-json']) {
            await expect(POST(request('test-token', body))).resolves.toMatchObject({ status: 400 });
        }
        expect(revalidatePath).not.toHaveBeenCalled();
    });

    it('revalidates after authenticating a valid payload', async () => {
        const response = await POST(request('test-token', '{"table":"champions"}'));

        expect(response.status).toBe(200);
        expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
    });
});
