import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { regions } from './regions';

describe('regions configuration', () => {
    it('defines an interactive contour for Demacia', () => {
        const demacia = regions.find((region) => region.id === 'demacia');

        expect(demacia?.polygons).toHaveLength(6);
        expect(demacia?.polygons?.every((polygon) => {
            const coordinates = polygon.trim().split(/\s+/);
            return coordinates.length >= 3 && coordinates.every((coordinate) => /^\d+,\d+$/.test(coordinate));
        })).toBe(true);
        expect(demacia?.polygons?.[0]).toMatch(/^1648,2321 /);
    });

    it('uses a polygon rather than the placeholder circle for Targon', () => {
        const targon = regions.find((region) => region.id === 'targon');

        expect(targon?.polygons).toHaveLength(1);
        expect(targon?.circles).toBeUndefined();
    });

    it('anchors the Void marker on the Icathia contour', () => {
        const voidRegion = regions.find((region) => region.id === 'void');

        expect(voidRegion?.polygons).toHaveLength(1);
        expect(voidRegion?.polygons?.[0]).toMatch(/^4585,4556 /);
        expect(voidRegion?.circles).toBeUndefined();
    });

    it('keeps circle coordinates to a center and radius', () => {
        const invalidCircles = regions.flatMap((region) =>
            (region.circles ?? []).filter((circle) => !/^\d+,\d+,\d+$/.test(circle)),
        );

        expect(invalidCircles).toEqual([]);
    });

    it('references existing public icons', () => {
        const missingIcons = regions
            .filter((region) => region.icon)
            .map((region) => ({
                id: region.id,
                icon: region.icon as string,
            }))
            .filter(({ icon }) => !fs.existsSync(path.join(process.cwd(), 'public', icon)));

        expect(missingIcons).toEqual([]);
    });

    it('uses lightweight marker assets for the oversized regional emblems', () => {
        const oversizedMarkerIds = ['shurima', 'targon'];
        const markers = regions
            .filter((region) => oversizedMarkerIds.includes(region.id))
            .map((region) => ({
                id: region.id,
                icon: region.icon as string,
            }));

        expect(markers).toHaveLength(oversizedMarkerIds.length);
        expect(markers.every(({ icon }) => icon.startsWith('/images/markers/'))).toBe(true);
        expect(markers.every(({ icon }) =>
            fs.statSync(path.join(process.cwd(), 'public', icon)).size < 20 * 1024,
        )).toBe(true);
    });
});
