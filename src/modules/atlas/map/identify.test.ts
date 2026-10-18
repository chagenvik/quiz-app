import { describe, expect, it } from 'vitest';
import { identifyCountryByPoint, isCountryTooSmallForDirectHit } from './identify';

describe('identifyCountryByPoint', () => {
  const squareFeature = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [0, 0],
          [0, 10],
          [10, 10],
          [10, 0],
          [0, 0],
        ],
      ],
    },
  };

  it('prefers polygon hits when the point is inside a country', () => {
    expect(
      identifyCountryByPoint(
        { lat: 5, lon: 5 },
        [{ iso2: 'AA', numericId: '001', features: [squareFeature] }],
        [{ iso2: 'BB', numericId: '002', source: 'helper', lat: 5, lon: 5, radiusKm: 2000 }],
      ),
    ).toEqual({ iso2: 'AA', numericId: '001', source: 'polygon' });
  });

  it('falls back to helper targets for tiny or missing countries', () => {
    expect(
      identifyCountryByPoint(
        { lat: 41.9028, lon: 12.4964 },
        [],
        [
          { iso2: 'VA', numericId: '336', source: 'helper', lat: 41.9028, lon: 12.4534, radiusKm: 10 },
          { iso2: 'SM', numericId: '674', source: 'helper', lat: 43.9424, lon: 12.4578, radiusKm: 10 },
        ],
      ),
    ).toEqual({ iso2: 'VA', numericId: '336', source: 'helper' });
  });

  it('classifies very small projected bounds for helper markers', () => {
    expect(isCountryTooSmallForDirectHit([[10, 10], [18, 17]])).toBe(true);
    expect(isCountryTooSmallForDirectHit([[10, 10], [60, 55]])).toBe(false);
  });
});
