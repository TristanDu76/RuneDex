import { Region } from '../types/map';

export const IMAGE_WIDTH = 9181;
export const IMAGE_HEIGHT = 5880;

export const coordsToPercentage = (coords: string): string => {
    const points = coords.split(',').map(Number);
    const percentagePoints: string[] = [];

    for (let i = 0; i < points.length; i += 2) {
        const x = (points[i] / IMAGE_WIDTH * 100).toFixed(2);
        const y = (points[i + 1] / IMAGE_HEIGHT * 100).toFixed(2);
        percentagePoints.push(`${x},${y}`);
    }

    return percentagePoints.join(' ');
};

export const getRegionCenter = (region: Region): { x: number; y: number } | null => {
    if (region.circles && region.circles.length > 0) {
        const [cx, cy] = region.circles[0].split(',').map(Number);
        return { x: cx, y: cy };
    }

    if (region.polygons && region.polygons.length > 0) {
        // Simplified polygon support: just take the points of the first one
        const points = region.polygons[0].split(/[\s,]+/).map(Number);
        let sumX = 0, sumY = 0, count = 0;

        for (let i = 0; i < points.length; i += 2) {
            sumX += points[i];
            sumY += points[i + 1];
            count++;
        }

        return { x: sumX / count, y: sumY / count };
    }

    return null;
};
