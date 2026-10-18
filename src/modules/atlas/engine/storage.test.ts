import { describe, expect, it } from 'vitest';
import { ATLAS_STORAGE_KEY } from './constants';
import {
  createBestScoreKey,
  getBestScore,
  getLastResults,
  getTotalGamesPlayed,
  readAtlasStorage,
  recordGameResult,
} from './storage';
import type { GameResult, StorageLike } from './types';

function createMemoryStorage(initial: Record<string, string> = {}): StorageLike {
  const values = new Map(Object.entries(initial));

  return {
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, value);
    },
    removeItem(key) {
      values.delete(key);
    },
  };
}

function createResult(points: number): GameResult {
  return {
    points,
    maxPoints: 300,
    correct: Math.floor(points / 100),
    total: 3,
    perQuestion: [],
  };
}

describe('atlas engine storage', () => {
  it('returns an empty versioned snapshot by default', () => {
    const storage = createMemoryStorage();
    const snapshot = readAtlasStorage(storage);

    expect(snapshot).toEqual({
      version: 1,
      bestScores: {},
      lastResults: [],
      totalGamesPlayed: 0,
    });
  });

  it('records results, updates best scores, and tracks games played', () => {
    const storage = createMemoryStorage();
    const config = {
      category: 'countries' as const,
      region: 'world' as const,
      questionCount: 10 as const,
      maxAttempts: 2 as const,
    };

    const firstSnapshot = recordGameResult(config, createResult(180), storage, '2026-10-18T12:00:00.000Z');
    const secondSnapshot = recordGameResult(config, createResult(140), storage, '2026-10-18T12:05:00.000Z');

    expect(firstSnapshot.bestScores[createBestScoreKey(config)]).toBe(180);
    expect(secondSnapshot.bestScores[createBestScoreKey(config)]).toBe(180);
    expect(getBestScore(config, storage)).toBe(180);
    expect(getTotalGamesPlayed(storage)).toBe(2);
    expect(getLastResults(storage).map((result) => result.finishedAt)).toEqual([
      '2026-10-18T12:05:00.000Z',
      '2026-10-18T12:00:00.000Z',
    ]);
    expect(storage.getItem(ATLAS_STORAGE_KEY)).toContain('"version":1');
  });

  it('caps stored recent results', () => {
    const storage = createMemoryStorage();

    for (let index = 0; index < 12; index += 1) {
      recordGameResult(
        {
          category: 'capitals',
          region: 'europe',
          questionCount: 'all',
          maxAttempts: 1,
        },
        createResult(index),
        storage,
        `2026-10-18T12:${String(index).padStart(2, '0')}:00.000Z`,
      );
    }

    expect(getLastResults(storage)).toHaveLength(10);
    expect(getLastResults(storage)[0].points).toBe(11);
    expect(getLastResults(storage)[9].points).toBe(2);
  });
});
