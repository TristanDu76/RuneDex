import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
        const versions = await response.json();
        const latestVersion = versions[0];

        const localVersionPath = path.join(process.cwd(), 'src/data/version.json');
        let currentVersion = '0.0.0';
        let updatedAt = null;

        if (fs.existsSync(localVersionPath)) {
            const data = JSON.parse(fs.readFileSync(localVersionPath, 'utf8'));
            currentVersion = data.version;
            updatedAt = data.updated_at;
        }

        return NextResponse.json({
            currentVersion,
            latestVersion,
            updatedAt,
            hasUpdate: currentVersion !== latestVersion
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to verify updates' }, { status: 500 });
    }
}
