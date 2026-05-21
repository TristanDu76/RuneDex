import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';
import { GET } from './route';

const generatedShards = fs
    .readdirSync(path.resolve(process.cwd(), 'src/data/shards'))
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.slice(0, -'.json'.length));

const requestShard = (faction: string) =>
    GET(
        new Request(`http://localhost/api/data/shards/${encodeURIComponent(faction)}`),
        { params: Promise.resolve({ faction }) }
    );

describe('GET /api/data/shards/[faction]', () => {
    it('returns an existing shard', async () => {
        const response = await requestShard('demacia');

        expect(response.status).toBe(200);
    });

    it.each(generatedShards)('returns generated shard "%s"', async (faction) => {
        const response = await requestShard(faction);

        expect(response.status).toBe(200);
    });

    it('returns 404 for a shard outside the allowlist', async () => {
        const response = await requestShard('not-an-authorized-shard');

        expect(response.status).toBe(404);
    });

    it.each([
        ['decoded traversal', '../../../package'],
        ['URL-encoded slashes after routing decode', decodeURIComponent('..%2F..%2F..%2Fpackage')],
        ['URL-encoded dots and slashes after routing decode', decodeURIComponent('%2E%2E%2F%2E%2E%2F%2E%2E%2Fpackage')],
        ['URL-encoded form passed through unchanged', '..%2F..%2F..%2Fpackage'],
        ['double-encoded form after one decode', decodeURIComponent('..%252F..%252F..%252Fpackage')],
        ['double-encoded form after two decodes', decodeURIComponent(decodeURIComponent('..%252F..%252F..%252Fpackage'))],
    ])('rejects %s', async (_label, faction) => {
        const response = await requestShard(faction);

        expect(response.status).toBe(404);
        await expect(response.json()).resolves.toEqual({ error: 'Shard not found' });
    });
});
