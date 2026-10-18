import type { DistanceThresholds, GameRegion } from './types';

export const MAX_POINTS_PER_QUESTION = 100;
export const COUNTRY_SECOND_TRY_POINTS = 50;
export const ATLAS_STORAGE_KEY = 'quiz-app:atlas:v1' as const;
export const ATLAS_STORAGE_VERSION = 1 as const;
export const STORED_RESULTS_LIMIT = 10;

/**
 * Regional games use tighter capital-distance thresholds than the world game so
 * nearby capitals in smaller regions remain meaningfully distinct.
 */
export const CAPITAL_DISTANCE_THRESHOLDS_KM: Record<GameRegion, DistanceThresholds> = {
  world: { perfectKm: 150, zeroKm: 2000 },
  europe: { perfectKm: 90, zeroKm: 1200 },
  africa: { perfectKm: 110, zeroKm: 1600 },
  asia: { perfectKm: 130, zeroKm: 1800 },
  americas: { perfectKm: 130, zeroKm: 1800 },
  oceania: { perfectKm: 140, zeroKm: 1900 },
};

