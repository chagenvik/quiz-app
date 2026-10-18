import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const dataDir = path.join(repoRoot, 'src', 'modules', 'atlas', 'data');

const REGION_ORDER = ['europe', 'africa', 'asia', 'americas', 'oceania'];
const EXTRA_CODES = new Set(['VA', 'PS', 'TW', 'XK']);
const DISPUTED_CODES = new Set(['PS', 'TW', 'XK']);
const COUNTRY_NAME_NB_OVERRIDES = {
  CD: 'Kongo-Kinshasa',
  PS: 'Palestina',
};
const COUNTRY_NAME_EN_OVERRIDES = {
  CG: 'Republic of the Congo',
};
const CAPITAL_NAME_EN_OVERRIDES = {
  PS: 'Ramallah',
  PW: 'Ngerulmud',
};
const CAPITAL_NAME_NB_OVERRIDES = {
  NG: 'Abuja',
  NO: 'Oslo',
  PW: 'Ngerulmud',
  XK: 'Pristina',
};
const KOSOVO_COUNTRY = {
  iso2: 'XK',
  iso3: 'XKX',
  numericId: '983',
  region: 'europe',
  nameEn: 'Kosovo',
  nameNb: 'Kosovo',
  areaKm2: 10908,
};
const KOSOVO_CAPITAL = {
  iso2: 'XK',
  nameEn: 'Pristina',
  nameNb: 'Pristina',
  lat: 42.666667,
  lon: 21.166667,
};

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function fetchJson(url, options) {
  let lastError = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await globalThis.fetch(url, options);
    if (response.ok) {
      return response.json();
    }

    lastError = `Failed to fetch ${url}: ${response.status} ${response.statusText}`;
    await delay(500 * (attempt + 1));
  }

  throw new Error(lastError ?? `Failed to fetch ${url}`);
}

async function fetchText(url, options) {
  let lastError = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await globalThis.fetch(url, options);
    if (response.ok) {
      return response.text();
    }

    lastError = `Failed to fetch ${url}: ${response.status} ${response.statusText}`;
    await delay(500 * (attempt + 1));
  }

  throw new Error(lastError ?? `Failed to fetch ${url}`);
}

function normalizeName(value) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function parsePoint(value) {
  const match = /^Point\(([-0-9.]+) ([-0-9.]+)\)$/.exec(value);
  assert(match, `Unexpected coordinate format: ${value}`);
  return {
    lon: Number(match[1]),
    lat: Number(match[2]),
  };
}

function toRegion(region) {
  const value = region.toLowerCase();
  assert(REGION_ORDER.includes(value), `Unexpected region ${region}`);
  return value;
}

function formatTsArray(value) {
  return JSON.stringify(value, null, 2);
}

function createCountriesModule({ countries, topology50mMissingIso2, topology110mMissingIso2 }) {
  return `export const regions = ['europe', 'africa', 'asia', 'americas', 'oceania'] as const;

export type AtlasRegion = (typeof regions)[number];

export interface AtlasCountry {
  iso2: string;
  iso3: string;
  /**
   * Zero-padded ISO-style numeric code. For world-atlas this matches the TopoJSON geometry id
   * where a polygon exists.
   */
  numericId: string;
  region: AtlasRegion;
  nameEn: string;
  nameNb: string;
  /**
   * Pragmatic quiz flag for tiny countries that usually need special hit-area handling.
   * It uses a <= 20_000 km² heuristic rather than the formal political definition of microstate.
   */
  isMicrostate: boolean;
  /**
   * Non-UN-member quiz entries that are still intentionally included.
   */
  isExtra?: boolean;
  /**
   * Marks politically disputed quiz entries.
   */
  isDisputed?: boolean;
}

/**
 * Recommended world-atlas import: \`world-atlas/countries-50m.json\`.
 * It is the best size/coverage trade-off between the checked 50m and 110m files.
 * 50m misses only ${topology50mMissingIso2.join(', ')}, while 110m additionally omits many small states.
 */
export const recommendedCountryTopologyImport = 'world-atlas/countries-50m.json' as const;
export const recommendedCountryTopologyResolution = '50m' as const;
export const countriesWithoutPolygonsInRecommendedTopology = ${formatTsArray(topology50mMissingIso2)} as const;
export const countriesWithoutPolygonsIn110mTopology = ${formatTsArray(topology110mMissingIso2)} as const;

export const countries: AtlasCountry[] = ${formatTsArray(countries)};

export function getCountries(region?: AtlasRegion): AtlasCountry[] {
  return region ? countries.filter((country) => country.region === region) : [...countries];
}
`;
}

function createCapitalsModule(capitals) {
  return `import { countries, type AtlasRegion } from './countries';

export interface AtlasCapital {
  iso2: string;
  nameEn: string;
  nameNb: string;
  lat: number;
  lon: number;
}

const regionByIso2 = new Map(countries.map((country) => [country.iso2, country.region]));

export const capitals: AtlasCapital[] = ${formatTsArray(capitals)};

export function getCapitals(region?: AtlasRegion): AtlasCapital[] {
  if (!region) {
    return [...capitals];
  }

  return capitals.filter((capital) => regionByIso2.get(capital.iso2) === region);
}
`;
}

function createIndexModule() {
  return `export * from './countries';
export * from './capitals';
`;
}

const sourceCountries = await fetchJson('https://raw.githubusercontent.com/mledoze/countries/master/countries.json');
const [nbLocale, geonamesCountryInfo, countries50m, countries110m, capitalRows] = await Promise.all([
  fetchJson('https://raw.githubusercontent.com/michaelwittig/node-i18n-iso-countries/master/langs/nb.json'),
  fetchText('https://download.geonames.org/export/dump/countryInfo.txt'),
  fetchJson('https://unpkg.com/world-atlas@2/countries-50m.json'),
  fetchJson('https://unpkg.com/world-atlas@2/countries-110m.json'),
  (async () => {
    const nonKosovoIso2 = sourceCountries
      .filter((country) => country.unMember || ['PS', 'TW'].includes(country.cca2))
      .map((country) => country.cca2)
      .sort();
    const query = `SELECT ?iso2 ?capital ?capitalEn ?capitalNb ?capitalNo ?capitalNn ?coord WHERE {
  VALUES ?iso2 { ${nonKosovoIso2.map((iso2) => `"${iso2}"`).join(' ')} }
  ?country wdt:P297 ?iso2; wdt:P36 ?capital.
  OPTIONAL { ?capital rdfs:label ?capitalEn FILTER(LANG(?capitalEn) = 'en') }
  OPTIONAL { ?capital rdfs:label ?capitalNb FILTER(LANG(?capitalNb) = 'nb') }
  OPTIONAL { ?capital rdfs:label ?capitalNo FILTER(LANG(?capitalNo) = 'no') }
  OPTIONAL { ?capital rdfs:label ?capitalNn FILTER(LANG(?capitalNn) = 'nn') }
  OPTIONAL { ?capital wdt:P625 ?coord }
}`;
    const results = await fetchJson('https://query.wikidata.org/sparql?format=json', {
      method: 'POST',
      headers: {
        accept: 'application/sparql-results+json',
        'content-type': 'application/sparql-query; charset=utf-8',
        'user-agent': 'quiz-app-atlas-data-generator/1.0',
      },
      body: query,
    });
    return results.results.bindings;
  })(),
]);

const geonamesRows = geonamesCountryInfo
  .trim()
  .split(/\n/)
  .filter((line) => !line.startsWith('#'))
  .map((line) => line.split('\t'));
const geonamesByIso2 = new Map(
  geonamesRows.map((row) => [
    row[0],
    {
      iso2: row[0],
      iso3: row[1],
      numericId: row[2].padStart(3, '0'),
      countryName: row[4],
      capitalName: row[5],
      areaKm2: Number(row[6]),
      continent: row[8],
    },
  ]),
);
const nbByIso2 = nbLocale.countries;

const countries = sourceCountries
  .filter((country) => country.unMember || ['PS', 'TW'].includes(country.cca2))
  .map((country) => {
    const geonames = geonamesByIso2.get(country.cca2);
    assert(geonames, `Missing GeoNames row for ${country.cca2}`);
    const numericId = (country.ccn3 ?? geonames.numericId).padStart(3, '0');
    const nameEn = COUNTRY_NAME_EN_OVERRIDES[country.cca2] ?? country.name.common;
    const nameNb = COUNTRY_NAME_NB_OVERRIDES[country.cca2] ?? nbByIso2[country.cca2];
    assert(nameNb, `Missing Norwegian country name for ${country.cca2}`);

    return {
      iso2: country.cca2,
      iso3: country.cca3,
      numericId,
      region: toRegion(country.region),
      nameEn,
      nameNb,
      isMicrostate: geonames.areaKm2 <= 20_000,
      ...(EXTRA_CODES.has(country.cca2) ? { isExtra: true } : {}),
      ...(DISPUTED_CODES.has(country.cca2) ? { isDisputed: true } : {}),
      areaKm2: geonames.areaKm2,
    };
  })
  .concat({
    ...KOSOVO_COUNTRY,
    isMicrostate: KOSOVO_COUNTRY.areaKm2 <= 20_000,
    isExtra: true,
    isDisputed: true,
  })
  .sort((left, right) => {
    const regionOrder = REGION_ORDER.indexOf(left.region) - REGION_ORDER.indexOf(right.region);
    return regionOrder !== 0 ? regionOrder : left.nameEn.localeCompare(right.nameEn, 'en');
  });

const ids50m = new Set(countries50m.objects.countries.geometries.map((geometry) => String(geometry.id).padStart(3, '0')));
const ids110m = new Set(countries110m.objects.countries.geometries.map((geometry) => String(geometry.id).padStart(3, '0')));
const topology50mMissingIso2 = countries.filter((country) => !ids50m.has(country.numericId)).map((country) => country.iso2);
const topology110mMissingIso2 = countries.filter((country) => !ids110m.has(country.numericId)).map((country) => country.iso2);

const capitalCandidatesByIso2 = new Map();
for (const row of capitalRows) {
  const iso2 = row.iso2.value;
  const items = capitalCandidatesByIso2.get(iso2) ?? [];
  items.push({
    id: row.capital.value.split('/').pop(),
    nameEn: row.capitalEn?.value ?? '',
    nameNb: row.capitalNb?.value ?? row.capitalNo?.value ?? row.capitalNn?.value ?? '',
    coord: row.coord?.value ?? '',
  });
  capitalCandidatesByIso2.set(iso2, items);
}

const capitals = countries.map((country) => {
  if (country.iso2 === 'XK') {
    return KOSOVO_CAPITAL;
  }

  const geonames = geonamesByIso2.get(country.iso2);
  assert(geonames, `Missing GeoNames row for ${country.iso2}`);
  const targetName = CAPITAL_NAME_EN_OVERRIDES[country.iso2] ?? geonames.capitalName;
  const candidates = (capitalCandidatesByIso2.get(country.iso2) ?? []).filter(
    (candidate, index, array) => array.findIndex((item) => item.id === candidate.id) === index,
  );
  let selected = candidates.find((candidate) => normalizeName(candidate.nameEn) === normalizeName(targetName));
  if (!selected) {
    selected = candidates.find(
      (candidate) =>
        normalizeName(candidate.nameEn).includes(normalizeName(targetName)) ||
        normalizeName(targetName).includes(normalizeName(candidate.nameEn)),
    );
  }
  if (!selected && candidates.length === 1) {
    [selected] = candidates;
  }

  assert(selected, `Could not resolve capital candidate for ${country.iso2} (${targetName})`);
  assert(selected.coord, `Missing capital coordinates for ${country.iso2}`);
  const { lat, lon } = parsePoint(selected.coord);

  return {
    iso2: country.iso2,
    nameEn: targetName,
    nameNb: CAPITAL_NAME_NB_OVERRIDES[country.iso2] ?? selected.nameNb ?? targetName,
    lat: Number(lat.toFixed(6)),
    lon: Number(lon.toFixed(6)),
  };
});

await mkdir(dataDir, { recursive: true });

const countriesForOutput = countries.map((country) => ({
  iso2: country.iso2,
  iso3: country.iso3,
  numericId: country.numericId,
  region: country.region,
  nameEn: country.nameEn,
  nameNb: country.nameNb,
  isMicrostate: country.isMicrostate,
  ...(country.isExtra ? { isExtra: true } : {}),
  ...(country.isDisputed ? { isDisputed: true } : {}),
}));
await writeFile(path.join(dataDir, 'countries.ts'), createCountriesModule({
  countries: countriesForOutput,
  topology50mMissingIso2,
  topology110mMissingIso2,
}));
await writeFile(path.join(dataDir, 'capitals.ts'), createCapitalsModule(capitals));
await writeFile(path.join(dataDir, 'index.ts'), createIndexModule());

globalThis.console.log(`Wrote ${countries.length} countries and ${capitals.length} capitals.`);
globalThis.console.log(`50m missing: ${topology50mMissingIso2.join(', ') || 'none'}`);
globalThis.console.log(`110m missing: ${topology110mMissingIso2.join(', ') || 'none'}`);
