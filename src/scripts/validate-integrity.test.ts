import { afterEach, describe, expect, it } from 'vitest';
import {
  mkdtempSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const VALIDATOR_PATH = new URL('./validate-integrity.mjs', import.meta.url);
const temporaryProjects: string[] = [];

function createProject() {
  const projectRoot = mkdtempSync(path.join(tmpdir(), 'runedex-integrity-'));
  temporaryProjects.push(projectRoot);

  mkdirSync(path.join(projectRoot, 'src/data/shards'), { recursive: true });
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

async function runValidator(projectRoot: string) {
  const logs: string[] = [];
  const previousRoot = process.env.RUNEDEX_PROJECT_ROOT;
  const previousExitCode = process.exitCode;
  const originalLog = console.log;

  process.env.RUNEDEX_PROJECT_ROOT = projectRoot;
  process.exitCode = undefined;
  console.log = (...args: unknown[]) => logs.push(args.join(' '));

  try {
    await import(`${pathToFileURL(VALIDATOR_PATH.pathname).href}?test=${Date.now()}`);
    return { exitCode: process.exitCode ?? 0, output: logs.join('\n') };
  } finally {
    console.log = originalLog;
    process.exitCode = previousExitCode;
    if (previousRoot === undefined) delete process.env.RUNEDEX_PROJECT_ROOT;
    else process.env.RUNEDEX_PROJECT_ROOT = previousRoot;
  }
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
  it('validates shard membership independently from the region list', async () => {
    const projectRoot = createProject();
    const character = createCharacter();
    writeJson(projectRoot, 'manifest.json', {
      characters: { [character.id]: character },
    });
    writeJson(projectRoot, 'shards/demacia.json', []);
    writeJson(projectRoot, 'shards/house-test.json', [character]);
    writeJson(projectRoot, 'shards/stale.json', [character]);

    const result = await runValidator(projectRoot);
    const output = result.output;

    expect(result.exitCode, output).toBe(1);
    expect(output).toContain('Missing shard file "missing-faction.json"');
    expect(output).toContain('Stale shard file "stale.json"');
    expect(output).toContain('Shard "demacia": missing test-character');
    expect(output).not.toContain('Shard "house-test": not in regions.ts');
  });
});
