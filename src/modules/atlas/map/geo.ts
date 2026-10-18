import type { AtlasPoint } from './types';

export const MAP_VIEWBOX_WIDTH = 1000;
export const MAP_VIEWBOX_HEIGHT = 560;
export const MAP_VIEWBOX = {
  width: MAP_VIEWBOX_WIDTH,
  height: MAP_VIEWBOX_HEIGHT,
} as const;

export interface AtlasViewportPoint {
  x: number;
  y: number;
}

export type AtlasProjectedPoint = AtlasViewportPoint;

export interface AtlasProjectedBounds {
  0: [number, number];
  1: [number, number];
}

export interface AtlasViewportRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface AtlasViewTransform {
  x: number;
  y: number;
  k: number;
}

export type AtlasProjectionLike = ((coordinates: [number, number]) => [number, number] | null | undefined) & {
  invert?: (coordinates: [number, number]) => [number, number] | null | undefined;
};

export const identityViewTransform: AtlasViewTransform = {
  x: 0,
  y: 0,
  k: 1,
};

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function haversineKm(from: AtlasPoint, to: AtlasPoint): number {
  const earthRadiusKm = 6371;
  const latDelta = toRadians(to.lat - from.lat);
  const lonDelta = toRadians(to.lon - from.lon);
  const fromLat = toRadians(from.lat);
  const toLat = toRadians(to.lat);
  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(lonDelta / 2) ** 2;

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function projectGeoPoint(
  projection: AtlasProjectionLike,
  point: AtlasPoint,
): AtlasProjectedPoint | null {
  const projected = projection([point.lon, point.lat]);

  if (!projected) {
    return null;
  }

  return {
    x: projected[0],
    y: projected[1],
  };
}

export function invertProjectedPoint(
  projection: AtlasProjectionLike,
  point: AtlasProjectedPoint,
): AtlasPoint | null {
  const inverted = projection.invert?.([point.x, point.y]);

  if (!inverted) {
    return null;
  }

  return {
    lon: inverted[0],
    lat: inverted[1],
  };
}

export function viewportPointToViewBoxPoint(
  point: AtlasViewportPoint,
  rect: AtlasViewportRect,
  width = MAP_VIEWBOX_WIDTH,
  height = MAP_VIEWBOX_HEIGHT,
): AtlasProjectedPoint | null {
  if (rect.width <= 0 || rect.height <= 0) {
    return null;
  }

  return {
    x: ((point.x - rect.left) / rect.width) * width,
    y: ((point.y - rect.top) / rect.height) * height,
  };
}

export function invertViewTransformPoint(
  point: AtlasProjectedPoint,
  transform: AtlasViewTransform,
): AtlasProjectedPoint {
  return {
    x: (point.x - transform.x) / transform.k,
    y: (point.y - transform.y) / transform.k,
  };
}

export function invertViewportPointToGeo(
  projection: AtlasProjectionLike,
  viewportPoint: AtlasViewportPoint,
  rect: AtlasViewportRect,
  transform: AtlasViewTransform,
  width = MAP_VIEWBOX_WIDTH,
  height = MAP_VIEWBOX_HEIGHT,
): AtlasPoint | null {
  const viewBoxPoint = viewportPointToViewBoxPoint(viewportPoint, rect, width, height);

  if (!viewBoxPoint) {
    return null;
  }

  const untransformedPoint = invertViewTransformPoint(viewBoxPoint, transform);
  return invertProjectedPoint(projection, untransformedPoint);
}

export function boundsFromProjectedPoint(
  point: AtlasProjectedPoint,
  radius = 0,
): AtlasProjectedBounds {
  return [
    [point.x - radius, point.y - radius],
    [point.x + radius, point.y + radius],
  ];
}

export function expandProjectedBounds(
  bounds: AtlasProjectedBounds,
  padding: number,
): AtlasProjectedBounds {
  return [
    [bounds[0][0] - padding, bounds[0][1] - padding],
    [bounds[1][0] + padding, bounds[1][1] + padding],
  ];
}

export function mergeProjectedBounds(
  boundsCollection: Iterable<AtlasProjectedBounds | null | undefined>,
): AtlasProjectedBounds | null {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  let found = false;

  for (const bounds of boundsCollection) {
    if (!bounds) {
      continue;
    }

    found = true;
    minX = Math.min(minX, bounds[0][0]);
    minY = Math.min(minY, bounds[0][1]);
    maxX = Math.max(maxX, bounds[1][0]);
    maxY = Math.max(maxY, bounds[1][1]);
  }

  return found
    ? [
        [minX, minY],
        [maxX, maxY],
      ]
    : null;
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}
