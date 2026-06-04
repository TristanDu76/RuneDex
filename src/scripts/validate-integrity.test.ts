import { afterEach, describe, expect, it } from 'vitest';
import {
  copyFileSync,
  mkdtempSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const VALIDATOR_PATH = fileURLToPath(new URL('./validate-integrity.mjs', import.meta.url));
const temporaryProjects: string[] = [];

function createProject() {
  const projectRoot = mkdtempSync(path.join(tmpdir(), 'runedex-integrity-'));
  temporaryProjects.push(projectRoot);

  mkdirSync(path.join(projectRoot, 'src/data/shards'), { recursive: true });
  mkdirSync(path.join(projectRoot, 'src/scripts'), { recursive: true });
  copyFileSync(VALIDATOR_PATH, path.join(projectRoot, 'src/scripts/validate-integrity.mjs'));
  writeFileSync(
    path.join(projectRoot, 'src/data/regions.ts'),
    "export const regions: Region[] = [{ id: 'demacia' }];\n"
  );

  return projectRoot;
}

function writeJson(projectRoot: string, relativePath: string, value: unknown) {
  writeFileSync(
    path.join(projectRoot, 'src/data', relativePath),
    JSON.stringify(value, null, 2)
  );
}

function runValidator(projectRoot: string) {
  return spawnSync(
    process.execPath,
    [path.join(projectRoot, 'src/scripts/validate-integrity.mjs')],
    { cwd: projectRoot, encoding: 'utf8' }
  );
}

function createCharacter() {
  return {
    id: 'test-character',
    name: 'Test Character',
    factionKey: 'demacia',
    factionKeys: ['demacia', 'house-test', 'missing-faction'],
    type: 'lore',
    related_characters: [],
  };
}

afterEach(() => {
  for (const projectRoot of temporaryProjects.splice(0)) {
    rmSync(projectRoot, { recursive: true, force: true });
  }
});

describe('validate-integrity', () => {
  it('validates shard membership independently from the region list', () => {
    const projectRoot = createProject();
    const character = createCharacter();
    writeJson(projectRoot, 'manifest.json', {
      characters: { [character.id]: character },
    });
    writeJson(projectRoot, 'shards/demacia.json', []);
    writeJson(projectRoot, 'shards/house-test.json', [character]);
    writeJson(projectRoot, 'shards/stale.json', [character]);

    const result = runValidator(projectRoot);
    const output = result.stdout + result.stderr;

    expect(result.status, output).toBe(1);
    expect(output).toContain('Missing shard file "missing-faction.json"');
    expect(output).toContain('Stale shard file "stale.json"');
    expect(output).toContain('Shard "demacia": missing test-character');
    expect(output).not.toContain('Shard "house-test": not in regions.ts');
  });
});
