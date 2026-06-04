import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const GENERATOR_PATH = fileURLToPath(new URL('./generate-manifest.mjs', import.meta.url));
const temporaryProjects: string[] = [];

function createProject() {
  const projectRoot = mkdtempSync(path.join(tmpdir(), 'runedex-manifest-'));
  temporaryProjects.push(projectRoot);

  for (const directory of ['champions', 'lore-characters', 'shards']) {
    mkdirSync(path.join(projectRoot, 'src/data', directory), { recursive: true });
  }

  return projectRoot;
}

function writeJson(projectRoot: string, relativePath: string, value: unknown) {
  writeFileSync(
    path.join(projectRoot, 'src/data', relativePath),
    JSON.stringify(value, null, 2)
  );
}

function runGenerator(projectRoot: string) {
  return spawnSync(process.execPath, [GENERATOR_PATH], {
    cwd: projectRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      MAX_RELATION_LOGS: '0',
    },
  });
}

afterEach(() => {
  for (const projectRoot of temporaryProjects.splice(0)) {
    rmSync(projectRoot, { recursive: true, force: true });
  }
});

describe('generate-manifest', () => {
  it('generates every faction shard and removes stale shard files', () => {
    const projectRoot = createProject();
    writeJson(projectRoot, 'champions/test-champion.json', {
      id: 'test-champion',
      name: 'Test Champion',
      faction: ['Demacia', 'Noxus'],
    });
    writeJson(projectRoot, 'shards/stale.json', []);

    const result = runGenerator(projectRoot);

    expect(result.status, result.stdout + result.stderr).toBe(0);
    const manifest = JSON.parse(
      readFileSync(path.join(projectRoot, 'src/data/manifest.json'), 'utf8')
    );
    expect(manifest.characters['test-champion']).toMatchObject({
      factionKey: 'demacia',
      factionKeys: ['demacia', 'noxus'],
    });
    expect(readFileSync(path.join(projectRoot, 'src/data/shards/demacia.json'), 'utf8'))
      .toContain('test-champion');
    expect(readFileSync(path.join(projectRoot, 'src/data/shards/noxus.json'), 'utf8'))
      .toContain('test-champion');
    expect(() => readFileSync(path.join(projectRoot, 'src/data/shards/stale.json')))
      .toThrow();
    expect(readdirSync(path.join(projectRoot, 'src/data')))
      .not.toContainEqual(expect.stringMatching(/^\.manifest-staging-/));
  });

  it('uses unknown when a faction normalizes to an empty shard key', () => {
    const projectRoot = createProject();
    writeJson(projectRoot, 'champions/punctuation-faction.json', {
      id: 'punctuation-faction',
      name: 'Punctuation Faction',
      faction: '!!!',
    });

    const result = runGenerator(projectRoot);

    expect(result.status, result.stdout + result.stderr).toBe(0);
    const manifest = JSON.parse(
      readFileSync(path.join(projectRoot, 'src/data/manifest.json'), 'utf8')
    );
    expect(manifest.characters['punctuation-faction']).toMatchObject({
      factionKey: 'unknown',
      factionKeys: ['unknown'],
    });
    expect(readFileSync(path.join(projectRoot, 'src/data/shards/unknown.json'), 'utf8'))
      .toContain('punctuation-faction');
    expect(() => readFileSync(path.join(projectRoot, 'src/data/shards/.json')))
      .toThrow();
  });

  it('fails without overwriting generated data when a source file is invalid', () => {
    const projectRoot = createProject();
    const existingManifest = { sentinel: 'keep-me' };
    const existingShard = [{ id: 'keep-me' }];
    writeJson(projectRoot, 'manifest.json', existingManifest);
    writeJson(projectRoot, 'shards/keep.json', existingShard);
    writeJson(projectRoot, 'champions/invalid.json', {
      id: 'invalid id',
      name: 'Invalid Champion',
      faction: 'Demacia',
    });

    const result = runGenerator(projectRoot);

    expect(result.status).toBe(1);
    expect(
      JSON.parse(readFileSync(path.join(projectRoot, 'src/data/manifest.json'), 'utf8'))
    ).toEqual(existingManifest);
    expect(
      JSON.parse(readFileSync(path.join(projectRoot, 'src/data/shards/keep.json'), 'utf8'))
    ).toEqual(existingShard);
  });

  it('rolls back published shards when a destination cannot be replaced', () => {
    const projectRoot = createProject();
    const existingManifest = { sentinel: 'keep-me' };
    const existingDemaciaShard = [{ id: 'keep-demacia' }];
    writeJson(projectRoot, 'manifest.json', existingManifest);
    writeJson(projectRoot, 'shards/demacia.json', existingDemaciaShard);
    mkdirSync(path.join(projectRoot, 'src/data/shards/noxus.json'));
    writeJson(projectRoot, 'champions/test-champion.json', {
      id: 'test-champion',
      name: 'Test Champion',
      faction: ['Demacia', 'Noxus'],
    });

    const result = runGenerator(projectRoot);

    expect(result.status).toBe(1);
    expect(JSON.parse(readFileSync(path.join(projectRoot, 'src/data/manifest.json'), 'utf8')))
      .toEqual(existingManifest);
    expect(JSON.parse(readFileSync(path.join(projectRoot, 'src/data/shards/demacia.json'), 'utf8')))
      .toEqual(existingDemaciaShard);
  });
});
