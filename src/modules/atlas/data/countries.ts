export const regions = ['europe', 'africa', 'asia', 'americas', 'oceania'] as const;

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
 * Recommended world-atlas import: `world-atlas/countries-50m.json`.
 * It is the best size/coverage trade-off between the checked 50m and 110m files.
 * 50m misses only XK, TV, while 110m additionally omits many small states.
 */
export const recommendedCountryTopologyImport = 'world-atlas/countries-50m.json' as const;
export const recommendedCountryTopologyResolution = '50m' as const;
export const countriesWithoutPolygonsInRecommendedTopology = [
  "XK",
  "TV"
] as const;
export const countriesWithoutPolygonsIn110mTopology = [
  "AD",
  "XK",
  "LI",
  "MT",
  "MC",
  "SM",
  "VA",
  "CV",
  "KM",
  "MU",
  "ST",
  "SC",
  "BH",
  "MV",
  "SG",
  "AG",
  "BB",
  "DM",
  "GD",
  "KN",
  "LC",
  "VC",
  "KI",
  "MH",
  "FM",
  "NR",
  "PW",
  "WS",
  "TO",
  "TV"
] as const;

export const countries: AtlasCountry[] = [
  {
    "iso2": "AL",
    "iso3": "ALB",
    "numericId": "008",
    "region": "europe",
    "nameEn": "Albania",
    "nameNb": "Albania",
    "isMicrostate": false
  },
  {
    "iso2": "AD",
    "iso3": "AND",
    "numericId": "020",
    "region": "europe",
    "nameEn": "Andorra",
    "nameNb": "Andorra",
    "isMicrostate": true
  },
  {
    "iso2": "AT",
    "iso3": "AUT",
    "numericId": "040",
    "region": "europe",
    "nameEn": "Austria",
    "nameNb": "Østerrike",
    "isMicrostate": false
  },
  {
    "iso2": "BY",
    "iso3": "BLR",
    "numericId": "112",
    "region": "europe",
    "nameEn": "Belarus",
    "nameNb": "Hviterussland",
    "isMicrostate": false
  },
  {
    "iso2": "BE",
    "iso3": "BEL",
    "numericId": "056",
    "region": "europe",
    "nameEn": "Belgium",
    "nameNb": "Belgia",
    "isMicrostate": false
  },
  {
    "iso2": "BA",
    "iso3": "BIH",
    "numericId": "070",
    "region": "europe",
    "nameEn": "Bosnia and Herzegovina",
    "nameNb": "Bosnia-Hercegovina",
    "isMicrostate": false
  },
  {
    "iso2": "BG",
    "iso3": "BGR",
    "numericId": "100",
    "region": "europe",
    "nameEn": "Bulgaria",
    "nameNb": "Bulgaria",
    "isMicrostate": false
  },
  {
    "iso2": "HR",
    "iso3": "HRV",
    "numericId": "191",
    "region": "europe",
    "nameEn": "Croatia",
    "nameNb": "Kroatia",
    "isMicrostate": false
  },
  {
    "iso2": "CY",
    "iso3": "CYP",
    "numericId": "196",
    "region": "europe",
    "nameEn": "Cyprus",
    "nameNb": "Kypros",
    "isMicrostate": true
  },
  {
    "iso2": "CZ",
    "iso3": "CZE",
    "numericId": "203",
    "region": "europe",
    "nameEn": "Czechia",
    "nameNb": "Tsjekkia",
    "isMicrostate": false
  },
  {
    "iso2": "DK",
    "iso3": "DNK",
    "numericId": "208",
    "region": "europe",
    "nameEn": "Denmark",
    "nameNb": "Danmark",
    "isMicrostate": false
  },
  {
    "iso2": "EE",
    "iso3": "EST",
    "numericId": "233",
    "region": "europe",
    "nameEn": "Estonia",
    "nameNb": "Estland",
    "isMicrostate": false
  },
  {
    "iso2": "FI",
    "iso3": "FIN",
    "numericId": "246",
    "region": "europe",
    "nameEn": "Finland",
    "nameNb": "Finland",
    "isMicrostate": false
  },
  {
    "iso2": "FR",
    "iso3": "FRA",
    "numericId": "250",
    "region": "europe",
    "nameEn": "France",
    "nameNb": "Frankrike",
    "isMicrostate": false
  },
  {
    "iso2": "DE",
    "iso3": "DEU",
    "numericId": "276",
    "region": "europe",
    "nameEn": "Germany",
    "nameNb": "Tyskland",
    "isMicrostate": false
  },
  {
    "iso2": "GR",
    "iso3": "GRC",
    "numericId": "300",
    "region": "europe",
    "nameEn": "Greece",
    "nameNb": "Hellas",
    "isMicrostate": false
  },
  {
    "iso2": "HU",
    "iso3": "HUN",
    "numericId": "348",
    "region": "europe",
    "nameEn": "Hungary",
    "nameNb": "Ungarn",
    "isMicrostate": false
  },
  {
    "iso2": "IS",
    "iso3": "ISL",
    "numericId": "352",
    "region": "europe",
    "nameEn": "Iceland",
    "nameNb": "Island",
    "isMicrostate": false
  },
  {
    "iso2": "IE",
    "iso3": "IRL",
    "numericId": "372",
    "region": "europe",
    "nameEn": "Ireland",
    "nameNb": "Irland",
    "isMicrostate": false
  },
  {
    "iso2": "IT",
    "iso3": "ITA",
    "numericId": "380",
    "region": "europe",
    "nameEn": "Italy",
    "nameNb": "Italia",
    "isMicrostate": false
  },
  {
    "iso2": "XK",
    "iso3": "XKX",
    "numericId": "983",
    "region": "europe",
    "nameEn": "Kosovo",
    "nameNb": "Kosovo",
    "isMicrostate": true,
    "isExtra": true,
    "isDisputed": true
  },
  {
    "iso2": "LV",
    "iso3": "LVA",
    "numericId": "428",
    "region": "europe",
    "nameEn": "Latvia",
    "nameNb": "Latvia",
    "isMicrostate": false
  },
  {
    "iso2": "LI",
    "iso3": "LIE",
    "numericId": "438",
    "region": "europe",
    "nameEn": "Liechtenstein",
    "nameNb": "Liechtenstein",
    "isMicrostate": true
  },
  {
    "iso2": "LT",
    "iso3": "LTU",
    "numericId": "440",
    "region": "europe",
    "nameEn": "Lithuania",
    "nameNb": "Litauen",
    "isMicrostate": false
  },
  {
    "iso2": "LU",
    "iso3": "LUX",
    "numericId": "442",
    "region": "europe",
    "nameEn": "Luxembourg",
    "nameNb": "Luxembourg",
    "isMicrostate": true
  },
  {
    "iso2": "MT",
    "iso3": "MLT",
    "numericId": "470",
    "region": "europe",
    "nameEn": "Malta",
    "nameNb": "Malta",
    "isMicrostate": true
  },
  {
    "iso2": "MD",
    "iso3": "MDA",
    "numericId": "498",
    "region": "europe",
    "nameEn": "Moldova",
    "nameNb": "Moldova",
    "isMicrostate": false
  },
  {
    "iso2": "MC",
    "iso3": "MCO",
    "numericId": "492",
    "region": "europe",
    "nameEn": "Monaco",
    "nameNb": "Monaco",
    "isMicrostate": true
  },
  {
    "iso2": "ME",
    "iso3": "MNE",
    "numericId": "499",
    "region": "europe",
    "nameEn": "Montenegro",
    "nameNb": "Montenegro",
    "isMicrostate": true
  },
  {
    "iso2": "NL",
    "iso3": "NLD",
    "numericId": "528",
    "region": "europe",
    "nameEn": "Netherlands",
    "nameNb": "Nederland",
    "isMicrostate": false
  },
  {
    "iso2": "MK",
    "iso3": "MKD",
    "numericId": "807",
    "region": "europe",
    "nameEn": "North Macedonia",
    "nameNb": "Nord-Makedonia",
    "isMicrostate": false
  },
  {
    "iso2": "NO",
    "iso3": "NOR",
    "numericId": "578",
    "region": "europe",
    "nameEn": "Norway",
    "nameNb": "Norge",
    "isMicrostate": false
  },
  {
    "iso2": "PL",
    "iso3": "POL",
    "numericId": "616",
    "region": "europe",
    "nameEn": "Poland",
    "nameNb": "Polen",
    "isMicrostate": false
  },
  {
    "iso2": "PT",
    "iso3": "PRT",
    "numericId": "620",
    "region": "europe",
    "nameEn": "Portugal",
    "nameNb": "Portugal",
    "isMicrostate": false
  },
  {
    "iso2": "RO",
    "iso3": "ROU",
    "numericId": "642",
    "region": "europe",
    "nameEn": "Romania",
    "nameNb": "Romania",
    "isMicrostate": false
  },
  {
    "iso2": "RU",
    "iso3": "RUS",
    "numericId": "643",
    "region": "europe",
    "nameEn": "Russia",
    "nameNb": "Russland",
    "isMicrostate": false
  },
  {
    "iso2": "SM",
    "iso3": "SMR",
    "numericId": "674",
    "region": "europe",
    "nameEn": "San Marino",
    "nameNb": "San Marino",
    "isMicrostate": true
  },
  {
    "iso2": "RS",
    "iso3": "SRB",
    "numericId": "688",
    "region": "europe",
    "nameEn": "Serbia",
    "nameNb": "Serbia",
    "isMicrostate": false
  },
  {
    "iso2": "SK",
    "iso3": "SVK",
    "numericId": "703",
    "region": "europe",
    "nameEn": "Slovakia",
    "nameNb": "Slovakia",
    "isMicrostate": false
  },
  {
    "iso2": "SI",
    "iso3": "SVN",
    "numericId": "705",
    "region": "europe",
    "nameEn": "Slovenia",
    "nameNb": "Slovenia",
    "isMicrostate": false
  },
  {
    "iso2": "ES",
    "iso3": "ESP",
    "numericId": "724",
    "region": "europe",
    "nameEn": "Spain",
    "nameNb": "Spania",
    "isMicrostate": false
  },
  {
    "iso2": "SE",
    "iso3": "SWE",
    "numericId": "752",
    "region": "europe",
    "nameEn": "Sweden",
    "nameNb": "Sverige",
    "isMicrostate": false
  },
  {
    "iso2": "CH",
    "iso3": "CHE",
    "numericId": "756",
    "region": "europe",
    "nameEn": "Switzerland",
    "nameNb": "Sveits",
    "isMicrostate": false
  },
  {
    "iso2": "UA",
    "iso3": "UKR",
    "numericId": "804",
    "region": "europe",
    "nameEn": "Ukraine",
    "nameNb": "Ukraina",
    "isMicrostate": false
  },
  {
    "iso2": "GB",
    "iso3": "GBR",
    "numericId": "826",
    "region": "europe",
    "nameEn": "United Kingdom",
    "nameNb": "Storbritannia",
    "isMicrostate": false
  },
  {
    "iso2": "VA",
    "iso3": "VAT",
    "numericId": "336",
    "region": "europe",
    "nameEn": "Vatican City",
    "nameNb": "Vatikanstaten",
    "isMicrostate": true,
    "isExtra": true
  },
  {
    "iso2": "DZ",
    "iso3": "DZA",
    "numericId": "012",
    "region": "africa",
    "nameEn": "Algeria",
    "nameNb": "Algerie",
    "isMicrostate": false
  },
  {
    "iso2": "AO",
    "iso3": "AGO",
    "numericId": "024",
    "region": "africa",
    "nameEn": "Angola",
    "nameNb": "Angola",
    "isMicrostate": false
  },
  {
    "iso2": "BJ",
    "iso3": "BEN",
    "numericId": "204",
    "region": "africa",
    "nameEn": "Benin",
    "nameNb": "Benin",
    "isMicrostate": false
  },
  {
    "iso2": "BW",
    "iso3": "BWA",
    "numericId": "072",
    "region": "africa",
    "nameEn": "Botswana",
    "nameNb": "Botswana",
    "isMicrostate": false
  },
  {
    "iso2": "BF",
    "iso3": "BFA",
    "numericId": "854",
    "region": "africa",
    "nameEn": "Burkina Faso",
    "nameNb": "Burkina Faso",
    "isMicrostate": false
  },
  {
    "iso2": "BI",
    "iso3": "BDI",
    "numericId": "108",
    "region": "africa",
    "nameEn": "Burundi",
    "nameNb": "Burundi",
    "isMicrostate": false
  },
  {
    "iso2": "CM",
    "iso3": "CMR",
    "numericId": "120",
    "region": "africa",
    "nameEn": "Cameroon",
    "nameNb": "Kamerun",
    "isMicrostate": false
  },
  {
    "iso2": "CV",
    "iso3": "CPV",
    "numericId": "132",
    "region": "africa",
    "nameEn": "Cape Verde",
    "nameNb": "Kapp Verde",
    "isMicrostate": true
  },
  {
    "iso2": "CF",
    "iso3": "CAF",
    "numericId": "140",
    "region": "africa",
    "nameEn": "Central African Republic",
    "nameNb": "Den sentralafrikanske republikk",
    "isMicrostate": false
  },
  {
    "iso2": "TD",
    "iso3": "TCD",
    "numericId": "148",
    "region": "africa",
    "nameEn": "Chad",
    "nameNb": "Tsjad",
    "isMicrostate": false
  },
  {
    "iso2": "KM",
    "iso3": "COM",
    "numericId": "174",
    "region": "africa",
    "nameEn": "Comoros",
    "nameNb": "Komorene",
    "isMicrostate": true
  },
  {
    "iso2": "DJ",
    "iso3": "DJI",
    "numericId": "262",
    "region": "africa",
    "nameEn": "Djibouti",
    "nameNb": "Djibouti",
    "isMicrostate": false
  },
  {
    "iso2": "CD",
    "iso3": "COD",
    "numericId": "180",
    "region": "africa",
    "nameEn": "DR Congo",
    "nameNb": "Kongo-Kinshasa",
    "isMicrostate": false
  },
  {
    "iso2": "EG",
    "iso3": "EGY",
    "numericId": "818",
    "region": "africa",
    "nameEn": "Egypt",
    "nameNb": "Egypt",
    "isMicrostate": false
  },
  {
    "iso2": "GQ",
    "iso3": "GNQ",
    "numericId": "226",
    "region": "africa",
    "nameEn": "Equatorial Guinea",
    "nameNb": "Ekvatorial-Guinea",
    "isMicrostate": false
  },
  {
    "iso2": "ER",
    "iso3": "ERI",
    "numericId": "232",
    "region": "africa",
    "nameEn": "Eritrea",
    "nameNb": "Eritrea",
    "isMicrostate": false
  },
  {
    "iso2": "SZ",
    "iso3": "SWZ",
    "numericId": "748",
    "region": "africa",
    "nameEn": "Eswatini",
    "nameNb": "Eswatini",
    "isMicrostate": true
  },
  {
    "iso2": "ET",
    "iso3": "ETH",
    "numericId": "231",
    "region": "africa",
    "nameEn": "Ethiopia",
    "nameNb": "Etiopia",
    "isMicrostate": false
  },
  {
    "iso2": "GA",
    "iso3": "GAB",
    "numericId": "266",
    "region": "africa",
    "nameEn": "Gabon",
    "nameNb": "Gabon",
    "isMicrostate": false
  },
  {
    "iso2": "GM",
    "iso3": "GMB",
    "numericId": "270",
    "region": "africa",
    "nameEn": "Gambia",
    "nameNb": "Gambia",
    "isMicrostate": true
  },
  {
    "iso2": "GH",
    "iso3": "GHA",
    "numericId": "288",
    "region": "africa",
    "nameEn": "Ghana",
    "nameNb": "Ghana",
    "isMicrostate": false
  },
  {
    "iso2": "GN",
    "iso3": "GIN",
    "numericId": "324",
    "region": "africa",
    "nameEn": "Guinea",
    "nameNb": "Guinea",
    "isMicrostate": false
  },
  {
    "iso2": "GW",
    "iso3": "GNB",
    "numericId": "624",
    "region": "africa",
    "nameEn": "Guinea-Bissau",
    "nameNb": "Guinea-Bissau",
    "isMicrostate": false
  },
  {
    "iso2": "CI",
    "iso3": "CIV",
    "numericId": "384",
    "region": "africa",
    "nameEn": "Ivory Coast",
    "nameNb": "Elfenbenskysten",
    "isMicrostate": false
  },
  {
    "iso2": "KE",
    "iso3": "KEN",
    "numericId": "404",
    "region": "africa",
    "nameEn": "Kenya",
    "nameNb": "Kenya",
    "isMicrostate": false
  },
  {
    "iso2": "LS",
    "iso3": "LSO",
    "numericId": "426",
    "region": "africa",
    "nameEn": "Lesotho",
    "nameNb": "Lesotho",
    "isMicrostate": false
  },
  {
    "iso2": "LR",
    "iso3": "LBR",
    "numericId": "430",
    "region": "africa",
    "nameEn": "Liberia",
    "nameNb": "Liberia",
    "isMicrostate": false
  },
  {
    "iso2": "LY",
    "iso3": "LBY",
    "numericId": "434",
    "region": "africa",
    "nameEn": "Libya",
    "nameNb": "Libya",
    "isMicrostate": false
  },
  {
    "iso2": "MG",
    "iso3": "MDG",
    "numericId": "450",
    "region": "africa",
    "nameEn": "Madagascar",
    "nameNb": "Madagaskar",
    "isMicrostate": false
  },
  {
    "iso2": "MW",
    "iso3": "MWI",
    "numericId": "454",
    "region": "africa",
    "nameEn": "Malawi",
    "nameNb": "Malawi",
    "isMicrostate": false
  },
  {
    "iso2": "ML",
    "iso3": "MLI",
    "numericId": "466",
    "region": "africa",
    "nameEn": "Mali",
    "nameNb": "Mali",
    "isMicrostate": false
  },
  {
    "iso2": "MR",
    "iso3": "MRT",
    "numericId": "478",
    "region": "africa",
    "nameEn": "Mauritania",
    "nameNb": "Mauritania",
    "isMicrostate": false
  },
  {
    "iso2": "MU",
    "iso3": "MUS",
    "numericId": "480",
    "region": "africa",
    "nameEn": "Mauritius",
    "nameNb": "Mauritius",
    "isMicrostate": true
  },
  {
    "iso2": "MA",
    "iso3": "MAR",
    "numericId": "504",
    "region": "africa",
    "nameEn": "Morocco",
    "nameNb": "Marokko",
    "isMicrostate": false
  },
  {
    "iso2": "MZ",
    "iso3": "MOZ",
    "numericId": "508",
    "region": "africa",
    "nameEn": "Mozambique",
    "nameNb": "Mosambik",
    "isMicrostate": false
  },
  {
    "iso2": "NA",
    "iso3": "NAM",
    "numericId": "516",
    "region": "africa",
    "nameEn": "Namibia",
    "nameNb": "Namibia",
    "isMicrostate": false
  },
  {
    "iso2": "NE",
    "iso3": "NER",
    "numericId": "562",
    "region": "africa",
    "nameEn": "Niger",
    "nameNb": "Niger",
    "isMicrostate": false
  },
  {
    "iso2": "NG",
    "iso3": "NGA",
    "numericId": "566",
    "region": "africa",
    "nameEn": "Nigeria",
    "nameNb": "Nigeria",
    "isMicrostate": false
  },
  {
    "iso2": "CG",
    "iso3": "COG",
    "numericId": "178",
    "region": "africa",
    "nameEn": "Republic of the Congo",
    "nameNb": "Kongo-Brazzaville",
    "isMicrostate": false
  },
  {
    "iso2": "RW",
    "iso3": "RWA",
    "numericId": "646",
    "region": "africa",
    "nameEn": "Rwanda",
    "nameNb": "Rwanda",
    "isMicrostate": false
  },
  {
    "iso2": "ST",
    "iso3": "STP",
    "numericId": "678",
    "region": "africa",
    "nameEn": "São Tomé and Príncipe",
    "nameNb": "São Tomé og Príncipe",
    "isMicrostate": true
  },
  {
    "iso2": "SN",
    "iso3": "SEN",
    "numericId": "686",
    "region": "africa",
    "nameEn": "Senegal",
    "nameNb": "Senegal",
    "isMicrostate": false
  },
  {
    "iso2": "SC",
    "iso3": "SYC",
    "numericId": "690",
    "region": "africa",
    "nameEn": "Seychelles",
    "nameNb": "Seychellene",
    "isMicrostate": true
  },
  {
    "iso2": "SL",
    "iso3": "SLE",
    "numericId": "694",
    "region": "africa",
    "nameEn": "Sierra Leone",
    "nameNb": "Sierra Leone",
    "isMicrostate": false
  },
  {
    "iso2": "SO",
    "iso3": "SOM",
    "numericId": "706",
    "region": "africa",
    "nameEn": "Somalia",
    "nameNb": "Somalia",
    "isMicrostate": false
  },
  {
    "iso2": "ZA",
    "iso3": "ZAF",
    "numericId": "710",
    "region": "africa",
    "nameEn": "South Africa",
    "nameNb": "Sør-Afrika",
    "isMicrostate": false
  },
  {
    "iso2": "SS",
    "iso3": "SSD",
    "numericId": "728",
    "region": "africa",
    "nameEn": "South Sudan",
    "nameNb": "Sør-Sudan",
    "isMicrostate": false
  },
  {
    "iso2": "SD",
    "iso3": "SDN",
    "numericId": "729",
    "region": "africa",
    "nameEn": "Sudan",
    "nameNb": "Sudan",
    "isMicrostate": false
  },
  {
    "iso2": "TZ",
    "iso3": "TZA",
    "numericId": "834",
    "region": "africa",
    "nameEn": "Tanzania",
    "nameNb": "Tanzania",
    "isMicrostate": false
  },
  {
    "iso2": "TG",
    "iso3": "TGO",
    "numericId": "768",
    "region": "africa",
    "nameEn": "Togo",
    "nameNb": "Togo",
    "isMicrostate": false
  },
  {
    "iso2": "TN",
    "iso3": "TUN",
    "numericId": "788",
    "region": "africa",
    "nameEn": "Tunisia",
    "nameNb": "Tunisia",
    "isMicrostate": false
  },
  {
    "iso2": "UG",
    "iso3": "UGA",
    "numericId": "800",
    "region": "africa",
    "nameEn": "Uganda",
    "nameNb": "Uganda",
    "isMicrostate": false
  },
  {
    "iso2": "ZM",
    "iso3": "ZMB",
    "numericId": "894",
    "region": "africa",
    "nameEn": "Zambia",
    "nameNb": "Zambia",
    "isMicrostate": false
  },
  {
    "iso2": "ZW",
    "iso3": "ZWE",
    "numericId": "716",
    "region": "africa",
    "nameEn": "Zimbabwe",
    "nameNb": "Zimbabwe",
    "isMicrostate": false
  },
  {
    "iso2": "AF",
    "iso3": "AFG",
    "numericId": "004",
    "region": "asia",
    "nameEn": "Afghanistan",
    "nameNb": "Afghanistan",
    "isMicrostate": false
  },
  {
    "iso2": "AM",
    "iso3": "ARM",
    "numericId": "051",
    "region": "asia",
    "nameEn": "Armenia",
    "nameNb": "Armenia",
    "isMicrostate": false
  },
  {
    "iso2": "AZ",
    "iso3": "AZE",
    "numericId": "031",
    "region": "asia",
    "nameEn": "Azerbaijan",
    "nameNb": "Aserbajdsjan",
    "isMicrostate": false
  },
  {
    "iso2": "BH",
    "iso3": "BHR",
    "numericId": "048",
    "region": "asia",
    "nameEn": "Bahrain",
    "nameNb": "Bahrain",
    "isMicrostate": true
  },
  {
    "iso2": "BD",
    "iso3": "BGD",
    "numericId": "050",
    "region": "asia",
    "nameEn": "Bangladesh",
    "nameNb": "Bangladesh",
    "isMicrostate": false
  },
  {
    "iso2": "BT",
    "iso3": "BTN",
    "numericId": "064",
    "region": "asia",
    "nameEn": "Bhutan",
    "nameNb": "Bhutan",
    "isMicrostate": false
  },
  {
    "iso2": "BN",
    "iso3": "BRN",
    "numericId": "096",
    "region": "asia",
    "nameEn": "Brunei",
    "nameNb": "Brunei",
    "isMicrostate": true
  },
  {
    "iso2": "KH",
    "iso3": "KHM",
    "numericId": "116",
    "region": "asia",
    "nameEn": "Cambodia",
    "nameNb": "Kambodsja",
    "isMicrostate": false
  },
  {
    "iso2": "CN",
    "iso3": "CHN",
    "numericId": "156",
    "region": "asia",
    "nameEn": "China",
    "nameNb": "Kina",
    "isMicrostate": false
  },
  {
    "iso2": "GE",
    "iso3": "GEO",
    "numericId": "268",
    "region": "asia",
    "nameEn": "Georgia",
    "nameNb": "Georgia",
    "isMicrostate": false
  },
  {
    "iso2": "IN",
    "iso3": "IND",
    "numericId": "356",
    "region": "asia",
    "nameEn": "India",
    "nameNb": "India",
    "isMicrostate": false
  },
  {
    "iso2": "ID",
    "iso3": "IDN",
    "numericId": "360",
    "region": "asia",
    "nameEn": "Indonesia",
    "nameNb": "Indonesia",
    "isMicrostate": false
  },
  {
    "iso2": "IR",
    "iso3": "IRN",
    "numericId": "364",
    "region": "asia",
    "nameEn": "Iran",
    "nameNb": "Iran",
    "isMicrostate": false
  },
  {
    "iso2": "IQ",
    "iso3": "IRQ",
    "numericId": "368",
    "region": "asia",
    "nameEn": "Iraq",
    "nameNb": "Irak",
    "isMicrostate": false
  },
  {
    "iso2": "IL",
    "iso3": "ISR",
    "numericId": "376",
    "region": "asia",
    "nameEn": "Israel",
    "nameNb": "Israel",
    "isMicrostate": false
  },
  {
    "iso2": "JP",
    "iso3": "JPN",
    "numericId": "392",
    "region": "asia",
    "nameEn": "Japan",
    "nameNb": "Japan",
    "isMicrostate": false
  },
  {
    "iso2": "JO",
    "iso3": "JOR",
    "numericId": "400",
    "region": "asia",
    "nameEn": "Jordan",
    "nameNb": "Jordan",
    "isMicrostate": false
  },
  {
    "iso2": "KZ",
    "iso3": "KAZ",
    "numericId": "398",
    "region": "asia",
    "nameEn": "Kazakhstan",
    "nameNb": "Kasakhstan",
    "isMicrostate": false
  },
  {
    "iso2": "KW",
    "iso3": "KWT",
    "numericId": "414",
    "region": "asia",
    "nameEn": "Kuwait",
    "nameNb": "Kuwait",
    "isMicrostate": true
  },
  {
    "iso2": "KG",
    "iso3": "KGZ",
    "numericId": "417",
    "region": "asia",
    "nameEn": "Kyrgyzstan",
    "nameNb": "Kirgisistan",
    "isMicrostate": false
  },
  {
    "iso2": "LA",
    "iso3": "LAO",
    "numericId": "418",
    "region": "asia",
    "nameEn": "Laos",
    "nameNb": "Laos",
    "isMicrostate": false
  },
  {
    "iso2": "LB",
    "iso3": "LBN",
    "numericId": "422",
    "region": "asia",
    "nameEn": "Lebanon",
    "nameNb": "Libanon",
    "isMicrostate": true
  },
  {
    "iso2": "MY",
    "iso3": "MYS",
    "numericId": "458",
    "region": "asia",
    "nameEn": "Malaysia",
    "nameNb": "Malaysia",
    "isMicrostate": false
  },
  {
    "iso2": "MV",
    "iso3": "MDV",
    "numericId": "462",
    "region": "asia",
    "nameEn": "Maldives",
    "nameNb": "Maldivene",
    "isMicrostate": true
  },
  {
    "iso2": "MN",
    "iso3": "MNG",
    "numericId": "496",
    "region": "asia",
    "nameEn": "Mongolia",
    "nameNb": "Mongolia",
    "isMicrostate": false
  },
  {
    "iso2": "MM",
    "iso3": "MMR",
    "numericId": "104",
    "region": "asia",
    "nameEn": "Myanmar",
    "nameNb": "Myanmar (Burma)",
    "isMicrostate": false
  },
  {
    "iso2": "NP",
    "iso3": "NPL",
    "numericId": "524",
    "region": "asia",
    "nameEn": "Nepal",
    "nameNb": "Nepal",
    "isMicrostate": false
  },
  {
    "iso2": "KP",
    "iso3": "PRK",
    "numericId": "408",
    "region": "asia",
    "nameEn": "North Korea",
    "nameNb": "Nord-Korea",
    "isMicrostate": false
  },
  {
    "iso2": "OM",
    "iso3": "OMN",
    "numericId": "512",
    "region": "asia",
    "nameEn": "Oman",
    "nameNb": "Oman",
    "isMicrostate": false
  },
  {
    "iso2": "PK",
    "iso3": "PAK",
    "numericId": "586",
    "region": "asia",
    "nameEn": "Pakistan",
    "nameNb": "Pakistan",
    "isMicrostate": false
  },
  {
    "iso2": "PS",
    "iso3": "PSE",
    "numericId": "275",
    "region": "asia",
    "nameEn": "Palestine",
    "nameNb": "Palestina",
    "isMicrostate": true,
    "isExtra": true,
    "isDisputed": true
  },
  {
    "iso2": "PH",
    "iso3": "PHL",
    "numericId": "608",
    "region": "asia",
    "nameEn": "Philippines",
    "nameNb": "Filippinene",
    "isMicrostate": false
  },
  {
    "iso2": "QA",
    "iso3": "QAT",
    "numericId": "634",
    "region": "asia",
    "nameEn": "Qatar",
    "nameNb": "Qatar",
    "isMicrostate": true
  },
  {
    "iso2": "SA",
    "iso3": "SAU",
    "numericId": "682",
    "region": "asia",
    "nameEn": "Saudi Arabia",
    "nameNb": "Saudi-Arabia",
    "isMicrostate": false
  },
  {
    "iso2": "SG",
    "iso3": "SGP",
    "numericId": "702",
    "region": "asia",
    "nameEn": "Singapore",
    "nameNb": "Singapore",
    "isMicrostate": true
  },
  {
    "iso2": "KR",
    "iso3": "KOR",
    "numericId": "410",
    "region": "asia",
    "nameEn": "South Korea",
    "nameNb": "Sør-Korea",
    "isMicrostate": false
  },
  {
    "iso2": "LK",
    "iso3": "LKA",
    "numericId": "144",
    "region": "asia",
    "nameEn": "Sri Lanka",
    "nameNb": "Sri Lanka",
    "isMicrostate": false
  },
  {
    "iso2": "SY",
    "iso3": "SYR",
    "numericId": "760",
    "region": "asia",
    "nameEn": "Syria",
    "nameNb": "Syria",
    "isMicrostate": false
  },
  {
    "iso2": "TW",
    "iso3": "TWN",
    "numericId": "158",
    "region": "asia",
    "nameEn": "Taiwan",
    "nameNb": "Taiwan",
    "isMicrostate": false,
    "isExtra": true,
    "isDisputed": true
  },
  {
    "iso2": "TJ",
    "iso3": "TJK",
    "numericId": "762",
    "region": "asia",
    "nameEn": "Tajikistan",
    "nameNb": "Tadsjikistan",
    "isMicrostate": false
  },
  {
    "iso2": "TH",
    "iso3": "THA",
    "numericId": "764",
    "region": "asia",
    "nameEn": "Thailand",
    "nameNb": "Thailand",
    "isMicrostate": false
  },
  {
    "iso2": "TL",
    "iso3": "TLS",
    "numericId": "626",
    "region": "asia",
    "nameEn": "Timor-Leste",
    "nameNb": "Øst-Timor",
    "isMicrostate": true
  },
  {
    "iso2": "TR",
    "iso3": "TUR",
    "numericId": "792",
    "region": "asia",
    "nameEn": "Türkiye",
    "nameNb": "Tyrkia",
    "isMicrostate": false
  },
  {
    "iso2": "TM",
    "iso3": "TKM",
    "numericId": "795",
    "region": "asia",
    "nameEn": "Turkmenistan",
    "nameNb": "Turkmenistan",
    "isMicrostate": false
  },
  {
    "iso2": "AE",
    "iso3": "ARE",
    "numericId": "784",
    "region": "asia",
    "nameEn": "United Arab Emirates",
    "nameNb": "De forente arabiske emirater",
    "isMicrostate": false
  },
  {
    "iso2": "UZ",
    "iso3": "UZB",
    "numericId": "860",
    "region": "asia",
    "nameEn": "Uzbekistan",
    "nameNb": "Usbekistan",
    "isMicrostate": false
  },
  {
    "iso2": "VN",
    "iso3": "VNM",
    "numericId": "704",
    "region": "asia",
    "nameEn": "Vietnam",
    "nameNb": "Vietnam",
    "isMicrostate": false
  },
  {
    "iso2": "YE",
    "iso3": "YEM",
    "numericId": "887",
    "region": "asia",
    "nameEn": "Yemen",
    "nameNb": "Jemen",
    "isMicrostate": false
  },
  {
    "iso2": "AG",
    "iso3": "ATG",
    "numericId": "028",
    "region": "americas",
    "nameEn": "Antigua and Barbuda",
    "nameNb": "Antigua og Barbuda",
    "isMicrostate": true
  },
  {
    "iso2": "AR",
    "iso3": "ARG",
    "numericId": "032",
    "region": "americas",
    "nameEn": "Argentina",
    "nameNb": "Argentina",
    "isMicrostate": false
  },
  {
    "iso2": "BS",
    "iso3": "BHS",
    "numericId": "044",
    "region": "americas",
    "nameEn": "Bahamas",
    "nameNb": "Bahamas",
    "isMicrostate": true
  },
  {
    "iso2": "BB",
    "iso3": "BRB",
    "numericId": "052",
    "region": "americas",
    "nameEn": "Barbados",
    "nameNb": "Barbados",
    "isMicrostate": true
  },
  {
    "iso2": "BZ",
    "iso3": "BLZ",
    "numericId": "084",
    "region": "americas",
    "nameEn": "Belize",
    "nameNb": "Belize",
    "isMicrostate": false
  },
  {
    "iso2": "BO",
    "iso3": "BOL",
    "numericId": "068",
    "region": "americas",
    "nameEn": "Bolivia",
    "nameNb": "Bolivia",
    "isMicrostate": false
  },
  {
    "iso2": "BR",
    "iso3": "BRA",
    "numericId": "076",
    "region": "americas",
    "nameEn": "Brazil",
    "nameNb": "Brasil",
    "isMicrostate": false
  },
  {
    "iso2": "CA",
    "iso3": "CAN",
    "numericId": "124",
    "region": "americas",
    "nameEn": "Canada",
    "nameNb": "Canada",
    "isMicrostate": false
  },
  {
    "iso2": "CL",
    "iso3": "CHL",
    "numericId": "152",
    "region": "americas",
    "nameEn": "Chile",
    "nameNb": "Chile",
    "isMicrostate": false
  },
  {
    "iso2": "CO",
    "iso3": "COL",
    "numericId": "170",
    "region": "americas",
    "nameEn": "Colombia",
    "nameNb": "Colombia",
    "isMicrostate": false
  },
  {
    "iso2": "CR",
    "iso3": "CRI",
    "numericId": "188",
    "region": "americas",
    "nameEn": "Costa Rica",
    "nameNb": "Costa Rica",
    "isMicrostate": false
  },
  {
    "iso2": "CU",
    "iso3": "CUB",
    "numericId": "192",
    "region": "americas",
    "nameEn": "Cuba",
    "nameNb": "Cuba",
    "isMicrostate": false
  },
  {
    "iso2": "DM",
    "iso3": "DMA",
    "numericId": "212",
    "region": "americas",
    "nameEn": "Dominica",
    "nameNb": "Dominica",
    "isMicrostate": true
  },
  {
    "iso2": "DO",
    "iso3": "DOM",
    "numericId": "214",
    "region": "americas",
    "nameEn": "Dominican Republic",
    "nameNb": "Den dominikanske republikk",
    "isMicrostate": false
  },
  {
    "iso2": "EC",
    "iso3": "ECU",
    "numericId": "218",
    "region": "americas",
    "nameEn": "Ecuador",
    "nameNb": "Ecuador",
    "isMicrostate": false
  },
  {
    "iso2": "SV",
    "iso3": "SLV",
    "numericId": "222",
    "region": "americas",
    "nameEn": "El Salvador",
    "nameNb": "El Salvador",
    "isMicrostate": false
  },
  {
    "iso2": "GD",
    "iso3": "GRD",
    "numericId": "308",
    "region": "americas",
    "nameEn": "Grenada",
    "nameNb": "Grenada",
    "isMicrostate": true
  },
  {
    "iso2": "GT",
    "iso3": "GTM",
    "numericId": "320",
    "region": "americas",
    "nameEn": "Guatemala",
    "nameNb": "Guatemala",
    "isMicrostate": false
  },
  {
    "iso2": "GY",
    "iso3": "GUY",
    "numericId": "328",
    "region": "americas",
    "nameEn": "Guyana",
    "nameNb": "Guyana",
    "isMicrostate": false
  },
  {
    "iso2": "HT",
    "iso3": "HTI",
    "numericId": "332",
    "region": "americas",
    "nameEn": "Haiti",
    "nameNb": "Haiti",
    "isMicrostate": false
  },
  {
    "iso2": "HN",
    "iso3": "HND",
    "numericId": "340",
    "region": "americas",
    "nameEn": "Honduras",
    "nameNb": "Honduras",
    "isMicrostate": false
  },
  {
    "iso2": "JM",
    "iso3": "JAM",
    "numericId": "388",
    "region": "americas",
    "nameEn": "Jamaica",
    "nameNb": "Jamaica",
    "isMicrostate": true
  },
  {
    "iso2": "MX",
    "iso3": "MEX",
    "numericId": "484",
    "region": "americas",
    "nameEn": "Mexico",
    "nameNb": "Mexico",
    "isMicrostate": false
  },
  {
    "iso2": "NI",
    "iso3": "NIC",
    "numericId": "558",
    "region": "americas",
    "nameEn": "Nicaragua",
    "nameNb": "Nicaragua",
    "isMicrostate": false
  },
  {
    "iso2": "PA",
    "iso3": "PAN",
    "numericId": "591",
    "region": "americas",
    "nameEn": "Panama",
    "nameNb": "Panama",
    "isMicrostate": false
  },
  {
    "iso2": "PY",
    "iso3": "PRY",
    "numericId": "600",
    "region": "americas",
    "nameEn": "Paraguay",
    "nameNb": "Paraguay",
    "isMicrostate": false
  },
  {
    "iso2": "PE",
    "iso3": "PER",
    "numericId": "604",
    "region": "americas",
    "nameEn": "Peru",
    "nameNb": "Peru",
    "isMicrostate": false
  },
  {
    "iso2": "KN",
    "iso3": "KNA",
    "numericId": "659",
    "region": "americas",
    "nameEn": "Saint Kitts and Nevis",
    "nameNb": "Saint Kitts og Nevis",
    "isMicrostate": true
  },
  {
    "iso2": "LC",
    "iso3": "LCA",
    "numericId": "662",
    "region": "americas",
    "nameEn": "Saint Lucia",
    "nameNb": "Saint Lucia",
    "isMicrostate": true
  },
  {
    "iso2": "VC",
    "iso3": "VCT",
    "numericId": "670",
    "region": "americas",
    "nameEn": "Saint Vincent and the Grenadines",
    "nameNb": "Saint Vincent og Grenadinene",
    "isMicrostate": true
  },
  {
    "iso2": "SR",
    "iso3": "SUR",
    "numericId": "740",
    "region": "americas",
    "nameEn": "Suriname",
    "nameNb": "Surinam",
    "isMicrostate": false
  },
  {
    "iso2": "TT",
    "iso3": "TTO",
    "numericId": "780",
    "region": "americas",
    "nameEn": "Trinidad and Tobago",
    "nameNb": "Trinidad og Tobago",
    "isMicrostate": true
  },
  {
    "iso2": "US",
    "iso3": "USA",
    "numericId": "840",
    "region": "americas",
    "nameEn": "United States",
    "nameNb": "USA",
    "isMicrostate": false
  },
  {
    "iso2": "UY",
    "iso3": "URY",
    "numericId": "858",
    "region": "americas",
    "nameEn": "Uruguay",
    "nameNb": "Uruguay",
    "isMicrostate": false
  },
  {
    "iso2": "VE",
    "iso3": "VEN",
    "numericId": "862",
    "region": "americas",
    "nameEn": "Venezuela",
    "nameNb": "Venezuela",
    "isMicrostate": false
  },
  {
    "iso2": "AU",
    "iso3": "AUS",
    "numericId": "036",
    "region": "oceania",
    "nameEn": "Australia",
    "nameNb": "Australia",
    "isMicrostate": false
  },
  {
    "iso2": "FJ",
    "iso3": "FJI",
    "numericId": "242",
    "region": "oceania",
    "nameEn": "Fiji",
    "nameNb": "Fiji",
    "isMicrostate": true
  },
  {
    "iso2": "KI",
    "iso3": "KIR",
    "numericId": "296",
    "region": "oceania",
    "nameEn": "Kiribati",
    "nameNb": "Kiribati",
    "isMicrostate": true
  },
  {
    "iso2": "MH",
    "iso3": "MHL",
    "numericId": "584",
    "region": "oceania",
    "nameEn": "Marshall Islands",
    "nameNb": "Marshalløyene",
    "isMicrostate": true
  },
  {
    "iso2": "FM",
    "iso3": "FSM",
    "numericId": "583",
    "region": "oceania",
    "nameEn": "Micronesia",
    "nameNb": "Mikronesiaføderasjonen",
    "isMicrostate": true
  },
  {
    "iso2": "NR",
    "iso3": "NRU",
    "numericId": "520",
    "region": "oceania",
    "nameEn": "Nauru",
    "nameNb": "Nauru",
    "isMicrostate": true
  },
  {
    "iso2": "NZ",
    "iso3": "NZL",
    "numericId": "554",
    "region": "oceania",
    "nameEn": "New Zealand",
    "nameNb": "New Zealand",
    "isMicrostate": false
  },
  {
    "iso2": "PW",
    "iso3": "PLW",
    "numericId": "585",
    "region": "oceania",
    "nameEn": "Palau",
    "nameNb": "Palau",
    "isMicrostate": true
  },
  {
    "iso2": "PG",
    "iso3": "PNG",
    "numericId": "598",
    "region": "oceania",
    "nameEn": "Papua New Guinea",
    "nameNb": "Papua Ny-Guinea",
    "isMicrostate": false
  },
  {
    "iso2": "WS",
    "iso3": "WSM",
    "numericId": "882",
    "region": "oceania",
    "nameEn": "Samoa",
    "nameNb": "Samoa",
    "isMicrostate": true
  },
  {
    "iso2": "SB",
    "iso3": "SLB",
    "numericId": "090",
    "region": "oceania",
    "nameEn": "Solomon Islands",
    "nameNb": "Salomonøyene",
    "isMicrostate": false
  },
  {
    "iso2": "TO",
    "iso3": "TON",
    "numericId": "776",
    "region": "oceania",
    "nameEn": "Tonga",
    "nameNb": "Tonga",
    "isMicrostate": true
  },
  {
    "iso2": "TV",
    "iso3": "TUV",
    "numericId": "798",
    "region": "oceania",
    "nameEn": "Tuvalu",
    "nameNb": "Tuvalu",
    "isMicrostate": true
  },
  {
    "iso2": "VU",
    "iso3": "VUT",
    "numericId": "548",
    "region": "oceania",
    "nameEn": "Vanuatu",
    "nameNb": "Vanuatu",
    "isMicrostate": true
  }
];

export function getCountries(region?: AtlasRegion): AtlasCountry[] {
  return region ? countries.filter((country) => country.region === region) : [...countries];
}
