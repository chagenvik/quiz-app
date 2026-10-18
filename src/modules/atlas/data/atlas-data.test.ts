import { geoBounds, geoContains } from 'd3-geo';
import { feature } from 'topojson-client';
import { describe, expect, it } from 'vitest';
import worldAtlas50m from 'world-atlas/countries-50m.json';
import { capitals, getCapitals } from './capitals';
import {
  countries,
  countriesWithoutPolygonsInRecommendedTopology,
  getCountries,
  regions,
} from './countries';

type WorldAtlasTopology = {
  objects: {
    countries: {
      geometries: Array<{
        id?: string | number;
      }>;
    };
  };
};

type FeatureLike = {
  id?: string | number;
};

const recommendedTopology = worldAtlas50m as WorldAtlasTopology;
const recommendedGeometryIds = new Set(
  recommendedTopology.objects.countries.geometries.map((geometry) => String(geometry.id).padStart(3, '0')),
);
const recommendedFeatures = feature(
  recommendedTopology as never,
  recommendedTopology.objects.countries as never,
) as unknown as {
  features: FeatureLike[];
};
const recommendedFeaturesById = new Map<string, FeatureLike[]>();

for (const countryFeature of recommendedFeatures.features) {
  const numericId = String(countryFeature.id).padStart(3, '0');
  const groupedFeatures = recommendedFeaturesById.get(numericId) ?? [];
  groupedFeatures.push(countryFeature);
  recommendedFeaturesById.set(numericId, groupedFeatures);
}

const countriesWithoutRecommendedPolygons = new Set<string>(countriesWithoutPolygonsInRecommendedTopology);
const countriesByIso2 = new Map(countries.map((country) => [country.iso2, country]));

function isWithinExpandedBounds(lon: number, lat: number, countryFeature: FeatureLike): boolean {
  const [[west, south], [east, north]] = geoBounds(countryFeature as never);
  const withinLatitude = lat >= south - 2 && lat <= north + 2;
  const withinLongitude = west <= east ? lon >= west - 2 && lon <= east + 2 : lon >= west - 2 || lon <= east + 2;
  return withinLatitude && withinLongitude;
}

describe('atlas country and capital datasets', () => {
  it('keeps iso and numeric ids unique', () => {
    expect(new Set(countries.map((country) => country.iso2)).size).toBe(countries.length);
    expect(new Set(countries.map((country) => country.numericId)).size).toBe(countries.length);
  });

  it('keeps Norwegian names filled in', () => {
    expect(countries.every((country) => country.nameNb.trim().length > 0)).toBe(true);
    expect(capitals.every((capital) => capital.nameNb.trim().length > 0)).toBe(true);
  });

  it('gives every country exactly one capital', () => {
    expect(new Set(capitals.map((capital) => capital.iso2))).toEqual(new Set(countries.map((country) => country.iso2)));
    expect(capitals).toHaveLength(countries.length);
  });

  it('documents the missing polygons in the recommended 50m topology', () => {
    const unresolved = countries
      .filter((country) => !recommendedGeometryIds.has(country.numericId))
      .map((country) => country.iso2)
      .sort();

    expect(unresolved).toEqual([...countriesWithoutPolygonsInRecommendedTopology].sort());
  });

  it('resolves every other country id in the recommended topology', () => {
    const resolvedCountries = countries.filter((country) => !countriesWithoutRecommendedPolygons.has(country.iso2));
    expect(resolvedCountries.every((country) => recommendedGeometryIds.has(country.numericId))).toBe(true);
  });

  it('keeps capital coordinates within valid ranges and near their country polygons', () => {
    for (const capital of capitals) {
      expect(capital.lat).toBeGreaterThanOrEqual(-90);
      expect(capital.lat).toBeLessThanOrEqual(90);
      expect(capital.lon).toBeGreaterThanOrEqual(-180);
      expect(capital.lon).toBeLessThanOrEqual(180);

      if (countriesWithoutRecommendedPolygons.has(capital.iso2)) {
        continue;
      }

      const country = countriesByIso2.get(capital.iso2);
      const countryFeatures = country ? recommendedFeaturesById.get(country.numericId) : undefined;

      expect(country).toBeDefined();
      expect(countryFeatures).toBeDefined();

      const point: [number, number] = [capital.lon, capital.lat];
      const nearAtLeastOneFeature = (countryFeatures ?? []).some(
        (countryFeature) =>
          geoContains(countryFeature as never, point) || isWithinExpandedBounds(capital.lon, capital.lat, countryFeature),
      );

      expect(nearAtLeastOneFeature).toBe(true);
    }
  });

  it('filters helpers by region', () => {
    for (const region of regions) {
      expect(getCountries(region).every((country) => country.region === region)).toBe(true);
      expect(
        getCapitals(region).every((capital) => countriesByIso2.get(capital.iso2)?.region === region),
      ).toBe(true);
    }
  });
});
