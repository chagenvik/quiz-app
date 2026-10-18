import {
  ATLAS_STORAGE_KEY,
  ATLAS_STORAGE_VERSION,
  STORED_RESULTS_LIMIT,
} from './constants';
import type {
  AtlasStorageSnapshot,
  GameResult,
  ScoreKeyConfig,
  StorageLike,
  StoredGameResult,
} from './types';

function createEmptySnapshot(): AtlasStorageSnapshot {
  return {
    version: ATLAS_STORAGE_VERSION,
    bestScores: {},
    lastResults: [],
    totalGamesPlayed: 0,
  };
}

function resolveStorage(storage?: StorageLike): StorageLike | undefined {
  if (storage) {
    return storage;
  }

  if (typeof window === 'undefined') {
    return undefined;
  }

  return window.localStorage;
}

function isStoredGameResult(value: unknown): value is StoredGameResult {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const maybeResult = value as Partial<StoredGameResult>;

  return (
    typeof maybeResult.finishedAt === 'string' &&
    typeof maybeResult.points === 'number' &&
    typeof maybeResult.maxPoints === 'number' &&
    typeof maybeResult.correct === 'number' &&
    typeof maybeResult.total === 'number' &&
    Array.isArray(maybeResult.perQuestion) &&
    !!maybeResult.config
  );
}

function sanitizeSnapshot(value: unknown): AtlasStorageSnapshot {
  if (!value || typeof value !== 'object') {
    return createEmptySnapshot();
  }

  const snapshot = value as Partial<AtlasStorageSnapshot>;
  const bestScores = Object.entries(snapshot.bestScores ?? {}).reduce<Record<string, number>>((scores, [key, score]) => {
    if (typeof score === 'number' && Number.isFinite(score)) {
      scores[key] = score;
    }

    return scores;
  }, {});
  const lastResults = Array.isArray(snapshot.lastResults)
    ? snapshot.lastResults.filter(isStoredGameResult).slice(0, STORED_RESULTS_LIMIT)
    : [];

  return {
    version: ATLAS_STORAGE_VERSION,
    bestScores,
    lastResults,
    totalGamesPlayed: typeof snapshot.totalGamesPlayed === 'number' ? snapshot.totalGamesPlayed : 0,
  };
}

export function createBestScoreKey(config: ScoreKeyConfig) {
  return `${config.category}:${config.region}:${config.questionCount}:${config.maxAttempts}`;
}

export function readAtlasStorage(storage?: StorageLike): AtlasStorageSnapshot {
  const resolvedStorage = resolveStorage(storage);

  if (!resolvedStorage) {
    return createEmptySnapshot();
  }

  const rawValue = resolvedStorage.getItem(ATLAS_STORAGE_KEY);

  if (!rawValue) {
    return createEmptySnapshot();
  }

  try {
    return sanitizeSnapshot(JSON.parse(rawValue));
  } catch {
    return createEmptySnapshot();
  }
}

export function writeAtlasStorage(snapshot: AtlasStorageSnapshot, storage?: StorageLike) {
  const resolvedStorage = resolveStorage(storage);

  if (!resolvedStorage) {
    return;
  }

  resolvedStorage.setItem(ATLAS_STORAGE_KEY, JSON.stringify(snapshot));
}

export function getBestScore(config: ScoreKeyConfig, storage?: StorageLike) {
  const snapshot = readAtlasStorage(storage);
  return snapshot.bestScores[createBestScoreKey(config)] ?? null;
}

export function getLastResults(storage?: StorageLike) {
  return readAtlasStorage(storage).lastResults;
}

export function getTotalGamesPlayed(storage?: StorageLike) {
  return readAtlasStorage(storage).totalGamesPlayed;
}

export function recordGameResult(
  config: ScoreKeyConfig,
  result: GameResult,
  storage?: StorageLike,
  finishedAt = new Date().toISOString(),
) {
  const snapshot = readAtlasStorage(storage);
  const scoreKey = createBestScoreKey(config);
  const storedResult: StoredGameResult = {
    ...result,
    config,
    finishedAt,
  };
  const nextSnapshot: AtlasStorageSnapshot = {
    version: ATLAS_STORAGE_VERSION,
    bestScores: {
      ...snapshot.bestScores,
      [scoreKey]: Math.max(snapshot.bestScores[scoreKey] ?? 0, result.points),
    },
    lastResults: [storedResult, ...snapshot.lastResults].slice(0, STORED_RESULTS_LIMIT),
    totalGamesPlayed: snapshot.totalGamesPlayed + 1,
  };

  writeAtlasStorage(nextSnapshot, storage);

  return nextSnapshot;
}
