import { geoMercator } from 'd3-geo';
import { describe, expect, it } from 'vitest';
import {
  MAP_VIEWBOX_HEIGHT,
  MAP_VIEWBOX_WIDTH,
  haversineKm,
  identityViewTransform,
  invertProjectedPoint,
  invertViewportPointToGeo,
  projectGeoPoint,
} from './geo';

describe('geo helpers', () => {
  it('calculates haversine distance in kilometres', () => {
    const oslo = { lat: 59.9139, lon: 10.7522 };
    const stockholm = { lat: 59.3293, lon: 18.0686 };

    expect(haversineKm(oslo, stockholm)).toBeCloseTo(416, -1);
  });

  it('projects and inverts geo points', () => {
    const projection = geoMercator().translate([MAP_VIEWBOX_WIDTH / 2, MAP_VIEWBOX_HEIGHT / 2]).scale(140) as never;
    const point = { lat: 48.8566, lon: 2.3522 };
    const projected = projectGeoPoint(projection, point);

    expect(projected).not.toBeNull();
    expect(invertProjectedPoint(projection, projected ?? { x: 0, y: 0 })).toEqual(
      expect.objectContaining({ lat: expect.closeTo(point.lat, 4), lon: expect.closeTo(point.lon, 4) }),
    );
  });

  it('converts viewport clicks into geo coordinates after zooming', () => {
    const projection = geoMercator().translate([MAP_VIEWBOX_WIDTH / 2, MAP_VIEWBOX_HEIGHT / 2]).scale(140) as never;
    const paris = { lat: 48.8566, lon: 2.3522 };
    const projected = projectGeoPoint(projection, paris);

    expect(projected).not.toBeNull();

    const transform = {
      x: 120,
      y: -40,
      k: 2,
    };

    const viewportPoint = {
      x: (((projected?.x ?? 0) * transform.k + transform.x) / MAP_VIEWBOX_WIDTH) * 500 + 20,
      y: (((projected?.y ?? 0) * transform.k + transform.y) / MAP_VIEWBOX_HEIGHT) * 280 + 10,
    };

    expect(
      invertViewportPointToGeo(
        projection,
        viewportPoint,
        { left: 20, top: 10, width: 500, height: 280 },
        transform,
      ),
    ).toEqual(expect.objectContaining({ lat: expect.closeTo(paris.lat, 4), lon: expect.closeTo(paris.lon, 4) }));

    expect(identityViewTransform).toEqual({ x: 0, y: 0, k: 1 });
  });
});
