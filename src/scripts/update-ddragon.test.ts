import { afterEach, describe, expect, it, vi } from 'vitest';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { run, runCli } from './update-ddragon.mjs';

const temporaryDirectories: string[] = [];

function createDataDirectory() {
  const dataDir = mkdtempSync(path.join(tmpdir(), 'runedex-ddragon-'));
  temporaryDirectories.push(dataDir);
  mkdirSync(path.join(dataDir, 'champions'), { recursive: true });
  return dataDir;
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe('update-ddragon', () => {
  it('does not download or rewrite champion data when the version is current', async () => {
    const dataDir = createDataDirectory();
    writeFileSync(
      path.join(dataDir, 'version.json'),
      JSON.stringify({ version: '1.2.3', updated_at: 'existing' })
    );
    const requestedUrls: string[] = [];
    const fetchJsonFn = async (url: string) => {
      requestedUrls.push(url);
      if (url.endsWith('/api/versions.json')) return ['1.2.3'];
      throw new Error(`Unexpected download: ${url}`);
    };

    const result = await run({ dataDir, fetchJsonFn, force: false });

    expect(result).toEqual({ skipped: true, latestVersion: '1.2.3' });
    expect(requestedUrls).toHaveLength(1);
  });

  it('sets a failing exit code when the CLI update rejects', async () => {
    const previousExitCode = process.exitCode;
    const updateError = new Error('DDragon unavailable');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    process.exitCode = undefined;

    try {
      await runCli(async () => {
        throw updateError;
      });

      expect(process.exitCode).toBe(1);
      expect(consoleError).toHaveBeenCalledWith(updateError);
    } finally {
      process.exitCode = previousExitCode;
      consoleError.mockRestore();
    }
  });

  it('writes champion outputs when an update is forced', async () => {
    const dataDir = createDataDirectory();
    const image = { full: 'TestChampion.png' };
    const passive = { name: 'Passive', image, description: 'Passive description' };
    const englishChampion = {
      key: '1',
      name: 'Test Champion',
      title: 'The Tester',
      lore: 'English lore',
      tags: ['Mage'],
      partype: 'Mana',
      image,
      spells: [],
      passive,
      skins: [],
      info: {},
      stats: {},
    };
    const frenchChampion = {
      ...englishChampion,
      name: 'Champion Test',
      title: 'Le Testeur',
      lore: 'Lore française',
    };
    const fetchJsonFn = async (url: string) => {
      if (url.endsWith('/api/versions.json')) return ['1.2.3'];
      if (url.includes('/fr_FR/')) return { data: { TestChampion: frenchChampion } };
      return { data: { TestChampion: englishChampion } };
    };

    const result = await run({
      dataDir,
      fetchJsonFn,
      force: true,
      now: () => '2026-01-01T00:00:00.000Z',
    });

    expect(result).toEqual({
      skipped: false,
      latestVersion: '1.2.3',
      updatedCount: 0,
      newCount: 1,
    });
    expect(
      JSON.parse(readFileSync(path.join(dataDir, 'version.json'), 'utf8'))
    ).toEqual({ version: '1.2.3', updated_at: '2026-01-01T00:00:00.000Z' });
    expect(
      JSON.parse(readFileSync(path.join(dataDir, 'champions/TestChampion.json'), 'utf8'))
    ).toMatchObject({ id: 'TestChampion', name: 'Champion Test', lore_en: 'English lore' });
    expect(
      JSON.parse(readFileSync(path.join(dataDir, 'quiz-ability.json'), 'utf8'))
    ).toEqual([
      expect.objectContaining({
        id: 'TestChampion',
        spells: [],
        passive: { name: 'Passive', image },
      }),
    ]);
    expect(
      JSON.parse(readFileSync(path.join(dataDir, 'quiz-skins.json'), 'utf8'))
    ).toEqual([
      expect.objectContaining({ id: 'TestChampion', skins: [] }),
    ]);
  });
});
