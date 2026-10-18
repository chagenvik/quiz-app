import { geoContains } from 'd3-geo';
import { haversineKm, type AtlasProjectedBounds } from './geo';
import type { AtlasCountryPick, AtlasPoint } from './types';

export interface AtlasCountryGeometryTarget {
  iso2: string;
  numericId: string;
  features: readonly unknown[];
}

export interface AtlasCountryHelperTarget extends AtlasCountryPick, AtlasPoint {
  radiusKm: number;
}

export function identifyCountryByPoint(
  point: AtlasPoint,
  polygonTargets: readonly AtlasCountryGeometryTarget[],
  helperTargets: readonly AtlasCountryHelperTarget[],
): AtlasCountryPick | null {
  for (const polygonTarget of polygonTargets) {
    const matchedFeature = polygonTarget.features.some((featureLike) =>
      geoContains(featureLike as never, [point.lon, point.lat]),
    );

    if (matchedFeature) {
      return {
        iso2: polygonTarget.iso2,
        numericId: polygonTarget.numericId,
        source: 'polygon',
      };
    }
  }

  let nearestMatch: AtlasCountryHelperTarget | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const helperTarget of helperTargets) {
    const distance = haversineKm(point, helperTarget);

    if (distance <= helperTarget.radiusKm && distance < nearestDistance) {
      nearestMatch = helperTarget;
      nearestDistance = distance;
    }
  }

  return nearestMatch
    ? {
        iso2: nearestMatch.iso2,
        numericId: nearestMatch.numericId,
        source: 'helper',
      }
    : null;
}

export function isCountryTooSmallForDirectHit(
  bounds: AtlasProjectedBounds,
  minimumDimension = 14,
  minimumArea = 320,
): boolean {
  const width = Math.max(0, bounds[1][0] - bounds[0][0]);
  const height = Math.max(0, bounds[1][1] - bounds[0][1]);
  return Math.min(width, height) < minimumDimension || width * height < minimumArea;
}
