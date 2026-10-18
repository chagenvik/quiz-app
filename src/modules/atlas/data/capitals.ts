import { countries, type AtlasRegion } from './countries';

export interface AtlasCapital {
  iso2: string;
  nameEn: string;
  nameNb: string;
  lat: number;
  lon: number;
}

const regionByIso2 = new Map(countries.map((country) => [country.iso2, country.region]));

export const capitals: AtlasCapital[] = [
  {
    "iso2": "AL",
    "nameEn": "Tirana",
    "nameNb": "Tirana",
    "lat": 41.328333,
    "lon": 19.818056
  },
  {
    "iso2": "AD",
    "nameEn": "Andorra la Vella",
    "nameNb": "Andorra la Vella",
    "lat": 42.507222,
    "lon": 1.522222
  },
  {
    "iso2": "AT",
    "nameEn": "Vienna",
    "nameNb": "Wien",
    "lat": 48.208333,
    "lon": 16.3725
  },
  {
    "iso2": "BY",
    "nameEn": "Minsk",
    "nameNb": "Minsk",
    "lat": 53.902246,
    "lon": 27.561837
  },
  {
    "iso2": "BE",
    "nameEn": "Brussels",
    "nameNb": "Brussel",
    "lat": 50.846667,
    "lon": 4.351667
  },
  {
    "iso2": "BA",
    "nameEn": "Sarajevo",
    "nameNb": "Sarajevo",
    "lat": 43.856389,
    "lon": 18.413056
  },
  {
    "iso2": "BG",
    "nameEn": "Sofia",
    "nameNb": "Sofia",
    "lat": 42.697886,
    "lon": 23.321726
  },
  {
    "iso2": "HR",
    "nameEn": "Zagreb",
    "nameNb": "Zagreb",
    "lat": 45.813056,
    "lon": 15.977222
  },
  {
    "iso2": "CY",
    "nameEn": "Nicosia",
    "nameNb": "Nikosia",
    "lat": 35.1725,
    "lon": 33.365
  },
  {
    "iso2": "CZ",
    "nameEn": "Prague",
    "nameNb": "Praha",
    "lat": 50.0875,
    "lon": 14.421389
  },
  {
    "iso2": "DK",
    "nameEn": "Copenhagen",
    "nameNb": "København",
    "lat": 55.676111,
    "lon": 12.568889
  },
  {
    "iso2": "EE",
    "nameEn": "Tallinn",
    "nameNb": "Tallinn",
    "lat": 59.437222,
    "lon": 24.745
  },
  {
    "iso2": "FI",
    "nameEn": "Helsinki",
    "nameNb": "Helsingfors",
    "lat": 60.170833,
    "lon": 24.9375
  },
  {
    "iso2": "FR",
    "nameEn": "Paris",
    "nameNb": "Paris",
    "lat": 48.856667,
    "lon": 2.352222
  },
  {
    "iso2": "DE",
    "nameEn": "Berlin",
    "nameNb": "Berlin",
    "lat": 52.516667,
    "lon": 13.383333
  },
  {
    "iso2": "GR",
    "nameEn": "Athens",
    "nameNb": "Athen",
    "lat": 37.984167,
    "lon": 23.728056
  },
  {
    "iso2": "HU",
    "nameEn": "Budapest",
    "nameNb": "Budapest",
    "lat": 47.498333,
    "lon": 19.040833
  },
  {
    "iso2": "IS",
    "nameEn": "Reykjavik",
    "nameNb": "Reykjavík",
    "lat": 64.1475,
    "lon": -21.935
  },
  {
    "iso2": "IE",
    "nameEn": "Dublin",
    "nameNb": "Dublin",
    "lat": 53.349722,
    "lon": -6.260278
  },
  {
    "iso2": "IT",
    "nameEn": "Rome",
    "nameNb": "Roma",
    "lat": 41.893056,
    "lon": 12.482778
  },
  {
    "iso2": "XK",
    "nameEn": "Pristina",
    "nameNb": "Pristina",
    "lat": 42.666667,
    "lon": 21.166667
  },
  {
    "iso2": "LV",
    "nameEn": "Riga",
    "nameNb": "Riga",
    "lat": 56.9475,
    "lon": 24.106944
  },
  {
    "iso2": "LI",
    "nameEn": "Vaduz",
    "nameNb": "Vaduz",
    "lat": 47.140556,
    "lon": 9.522222
  },
  {
    "iso2": "LT",
    "nameEn": "Vilnius",
    "nameNb": "Vilnius",
    "lat": 54.687222,
    "lon": 25.28
  },
  {
    "iso2": "LU",
    "nameEn": "Luxembourg",
    "nameNb": "Luxembourg by",
    "lat": 49.611389,
    "lon": 6.13
  },
  {
    "iso2": "MT",
    "nameEn": "Valletta",
    "nameNb": "Valletta",
    "lat": 35.897778,
    "lon": 14.5125
  },
  {
    "iso2": "MD",
    "nameEn": "Chisinau",
    "nameNb": "Chișinău",
    "lat": 47.022778,
    "lon": 28.835278
  },
  {
    "iso2": "MC",
    "nameEn": "Monaco",
    "nameNb": "Monaco",
    "lat": 43.731111,
    "lon": 7.42
  },
  {
    "iso2": "ME",
    "nameEn": "Podgorica",
    "nameNb": "Podgorica",
    "lat": 42.441389,
    "lon": 19.262778
  },
  {
    "iso2": "NL",
    "nameEn": "Amsterdam",
    "nameNb": "Amsterdam",
    "lat": 52.366667,
    "lon": 4.883333
  },
  {
    "iso2": "MK",
    "nameEn": "Skopje",
    "nameNb": "Skopje",
    "lat": 41.996111,
    "lon": 21.431667
  },
  {
    "iso2": "NO",
    "nameEn": "Oslo",
    "nameNb": "Oslo",
    "lat": 59.913333,
    "lon": 10.738889
  },
  {
    "iso2": "PL",
    "nameEn": "Warsaw",
    "nameNb": "Warszawa",
    "lat": 52.23,
    "lon": 21.011111
  },
  {
    "iso2": "PT",
    "nameEn": "Lisbon",
    "nameNb": "Lisboa",
    "lat": 38.708042,
    "lon": -9.139016
  },
  {
    "iso2": "RO",
    "nameEn": "Bucharest",
    "nameNb": "București",
    "lat": 44.413361,
    "lon": 26.097778
  },
  {
    "iso2": "RU",
    "nameEn": "Moscow",
    "nameNb": "Moskva",
    "lat": 55.750556,
    "lon": 37.6175
  },
  {
    "iso2": "SM",
    "nameEn": "San Marino",
    "nameNb": "San Marino",
    "lat": 43.932011,
    "lon": 12.44845
  },
  {
    "iso2": "RS",
    "nameEn": "Belgrade",
    "nameNb": "Beograd",
    "lat": 44.817778,
    "lon": 20.456944
  },
  {
    "iso2": "SK",
    "nameEn": "Bratislava",
    "nameNb": "Bratislava",
    "lat": 48.151699,
    "lon": 17.109306
  },
  {
    "iso2": "SI",
    "nameEn": "Ljubljana",
    "nameNb": "Ljubljana",
    "lat": 46.051389,
    "lon": 14.506111
  },
  {
    "iso2": "ES",
    "nameEn": "Madrid",
    "nameNb": "Madrid",
    "lat": 40.416944,
    "lon": -3.703333
  },
  {
    "iso2": "SE",
    "nameEn": "Stockholm",
    "nameNb": "Stockholm",
    "lat": 59.329444,
    "lon": 18.068611
  },
  {
    "iso2": "CH",
    "nameEn": "Bern",
    "nameNb": "Bern",
    "lat": 46.94798,
    "lon": 7.44743
  },
  {
    "iso2": "UA",
    "nameEn": "Kyiv",
    "nameNb": "Kyiv",
    "lat": 50.45,
    "lon": 30.523611
  },
  {
    "iso2": "GB",
    "nameEn": "London",
    "nameNb": "London",
    "lat": 51.507222,
    "lon": -0.1275
  },
  {
    "iso2": "VA",
    "nameEn": "Vatican City",
    "nameNb": "Vatikanstaten",
    "lat": 41.904,
    "lon": 12.453
  },
  {
    "iso2": "DZ",
    "nameEn": "Algiers",
    "nameNb": "Alger",
    "lat": 36.776389,
    "lon": 3.058611
  },
  {
    "iso2": "AO",
    "nameEn": "Luanda",
    "nameNb": "Luanda",
    "lat": -8.838333,
    "lon": 13.234444
  },
  {
    "iso2": "BJ",
    "nameEn": "Porto-Novo",
    "nameNb": "Porto-Novo",
    "lat": 6.483333,
    "lon": 2.616667
  },
  {
    "iso2": "BW",
    "nameEn": "Gaborone",
    "nameNb": "Gaborone",
    "lat": -24.656944,
    "lon": 25.908611
  },
  {
    "iso2": "BF",
    "nameEn": "Ouagadougou",
    "nameNb": "Ouagadougou",
    "lat": 12.368611,
    "lon": -1.5275
  },
  {
    "iso2": "BI",
    "nameEn": "Gitega",
    "nameNb": "Gitega",
    "lat": -3.428333,
    "lon": 29.925
  },
  {
    "iso2": "CM",
    "nameEn": "Yaounde",
    "nameNb": "Yaoundé",
    "lat": 3.857778,
    "lon": 11.518056
  },
  {
    "iso2": "CV",
    "nameEn": "Praia",
    "nameNb": "Praia",
    "lat": 14.917719,
    "lon": -23.509156
  },
  {
    "iso2": "CF",
    "nameEn": "Bangui",
    "nameNb": "Bangui",
    "lat": 4.37325,
    "lon": 18.562833
  },
  {
    "iso2": "TD",
    "nameEn": "N'Djamena",
    "nameNb": "N'Djamena",
    "lat": 12.11,
    "lon": 15.05
  },
  {
    "iso2": "KM",
    "nameEn": "Moroni",
    "nameNb": "Moroni",
    "lat": -11.703611,
    "lon": 43.253611
  },
  {
    "iso2": "DJ",
    "nameEn": "Djibouti",
    "nameNb": "Djibouti",
    "lat": 11.595,
    "lon": 43.148056
  },
  {
    "iso2": "CD",
    "nameEn": "Kinshasa",
    "nameNb": "Kinshasa",
    "lat": -4.321944,
    "lon": 15.311944
  },
  {
    "iso2": "EG",
    "nameEn": "Cairo",
    "nameNb": "Kairo",
    "lat": 30.044444,
    "lon": 31.235833
  },
  {
    "iso2": "GQ",
    "nameEn": "Ciudad de la Paz",
    "nameNb": "Ciudad de la Paz",
    "lat": 1.591667,
    "lon": 10.822222
  },
  {
    "iso2": "ER",
    "nameEn": "Asmara",
    "nameNb": "Asmara",
    "lat": 15.333333,
    "lon": 38.916667
  },
  {
    "iso2": "SZ",
    "nameEn": "Mbabane",
    "nameNb": "Mbabane",
    "lat": -26.316667,
    "lon": 31.133333
  },
  {
    "iso2": "ET",
    "nameEn": "Addis Ababa",
    "nameNb": "Addis Abeba",
    "lat": 9.035833,
    "lon": 38.7525
  },
  {
    "iso2": "GA",
    "nameEn": "Libreville",
    "nameNb": "Libreville",
    "lat": 0.407778,
    "lon": 9.440278
  },
  {
    "iso2": "GM",
    "nameEn": "Banjul",
    "nameNb": "Banjul",
    "lat": 13.453056,
    "lon": -16.5775
  },
  {
    "iso2": "GH",
    "nameEn": "Accra",
    "nameNb": "Accra",
    "lat": 5.55602,
    "lon": -0.1969
  },
  {
    "iso2": "GN",
    "nameEn": "Conakry",
    "nameNb": "Conakry",
    "lat": 9.509167,
    "lon": -13.712222
  },
  {
    "iso2": "GW",
    "nameEn": "Bissau",
    "nameNb": "Bissau",
    "lat": 11.86,
    "lon": -15.583333
  },
  {
    "iso2": "CI",
    "nameEn": "Yamoussoukro",
    "nameNb": "Yamoussoukro",
    "lat": 6.816111,
    "lon": -5.274167
  },
  {
    "iso2": "KE",
    "nameEn": "Nairobi",
    "nameNb": "Nairobi",
    "lat": -1.286389,
    "lon": 36.817222
  },
  {
    "iso2": "LS",
    "nameEn": "Maseru",
    "nameNb": "Maseru",
    "lat": -29.31,
    "lon": 27.48
  },
  {
    "iso2": "LR",
    "nameEn": "Monrovia",
    "nameNb": "Monrovia",
    "lat": 6.310556,
    "lon": -10.804722
  },
  {
    "iso2": "LY",
    "nameEn": "Tripoli",
    "nameNb": "Tripoli",
    "lat": 32.8875,
    "lon": 13.1875
  },
  {
    "iso2": "MG",
    "nameEn": "Antananarivo",
    "nameNb": "Antananarivo",
    "lat": -18.91,
    "lon": 47.525
  },
  {
    "iso2": "MW",
    "nameEn": "Lilongwe",
    "nameNb": "Lilongwe",
    "lat": -13.986389,
    "lon": 33.768056
  },
  {
    "iso2": "ML",
    "nameEn": "Bamako",
    "nameNb": "Bamako",
    "lat": 12.645833,
    "lon": -7.992222
  },
  {
    "iso2": "MR",
    "nameEn": "Nouakchott",
    "nameNb": "Nouakchott",
    "lat": 18.08581,
    "lon": -15.9785
  },
  {
    "iso2": "MU",
    "nameEn": "Port Louis",
    "nameNb": "Port Louis",
    "lat": -20.161944,
    "lon": 57.498889
  },
  {
    "iso2": "MA",
    "nameEn": "Rabat",
    "nameNb": "Rabat",
    "lat": 34.021111,
    "lon": -6.841389
  },
  {
    "iso2": "MZ",
    "nameEn": "Maputo",
    "nameNb": "Maputo",
    "lat": -25.968889,
    "lon": 32.573333
  },
  {
    "iso2": "NA",
    "nameEn": "Windhoek",
    "nameNb": "Windhoek",
    "lat": -22.57,
    "lon": 17.083611
  },
  {
    "iso2": "NE",
    "nameEn": "Niamey",
    "nameNb": "Niamey",
    "lat": 13.515,
    "lon": 2.1175
  },
  {
    "iso2": "NG",
    "nameEn": "Abuja",
    "nameNb": "Abuja",
    "lat": 9.055556,
    "lon": 7.491389
  },
  {
    "iso2": "CG",
    "nameEn": "Brazzaville",
    "nameNb": "Brazzaville",
    "lat": -4.269444,
    "lon": 15.271111
  },
  {
    "iso2": "RW",
    "nameEn": "Kigali",
    "nameNb": "Kigali",
    "lat": -1.9525,
    "lon": 30.115
  },
  {
    "iso2": "ST",
    "nameEn": "Sao Tome",
    "nameNb": "São Tomé",
    "lat": 0.3375,
    "lon": 6.728333
  },
  {
    "iso2": "SN",
    "nameEn": "Dakar",
    "nameNb": "Dakar",
    "lat": 14.672556,
    "lon": -17.432
  },
  {
    "iso2": "SC",
    "nameEn": "Victoria",
    "nameNb": "Victoria",
    "lat": -4.623611,
    "lon": 55.454444
  },
  {
    "iso2": "SL",
    "nameEn": "Freetown",
    "nameNb": "Freetown",
    "lat": 8.487222,
    "lon": -13.235556
  },
  {
    "iso2": "SO",
    "nameEn": "Mogadishu",
    "nameNb": "Mogadishu",
    "lat": 2.039167,
    "lon": 45.341944
  },
  {
    "iso2": "ZA",
    "nameEn": "Pretoria",
    "nameNb": "Pretoria",
    "lat": -25.746389,
    "lon": 28.188056
  },
  {
    "iso2": "SS",
    "nameEn": "Juba",
    "nameNb": "Juba",
    "lat": 4.853889,
    "lon": 31.5825
  },
  {
    "iso2": "SD",
    "nameEn": "Khartoum",
    "nameNb": "Khartoum",
    "lat": 15.60308,
    "lon": 32.52654
  },
  {
    "iso2": "TZ",
    "nameEn": "Dodoma",
    "nameNb": "Dodoma",
    "lat": -6.1835,
    "lon": 35.746
  },
  {
    "iso2": "TG",
    "nameEn": "Lome",
    "nameNb": "Lomé",
    "lat": 6.13,
    "lon": 1.215833
  },
  {
    "iso2": "TN",
    "nameEn": "Tunis",
    "nameNb": "Tunis",
    "lat": 36.800833,
    "lon": 10.18
  },
  {
    "iso2": "UG",
    "nameEn": "Kampala",
    "nameNb": "Kampala",
    "lat": 0.313611,
    "lon": 32.581111
  },
  {
    "iso2": "ZM",
    "nameEn": "Lusaka",
    "nameNb": "Lusaka",
    "lat": -15.416667,
    "lon": 28.283333
  },
  {
    "iso2": "ZW",
    "nameEn": "Harare",
    "nameNb": "Harare",
    "lat": -17.829167,
    "lon": 31.052222
  },
  {
    "iso2": "AF",
    "nameEn": "Kabul",
    "nameNb": "Kabul",
    "lat": 34.532778,
    "lon": 69.165833
  },
  {
    "iso2": "AM",
    "nameEn": "Yerevan",
    "nameNb": "Jerevan",
    "lat": 40.181389,
    "lon": 44.514444
  },
  {
    "iso2": "AZ",
    "nameEn": "Baku",
    "nameNb": "Baku",
    "lat": 40.366656,
    "lon": 49.835183
  },
  {
    "iso2": "BH",
    "nameEn": "Manama",
    "nameNb": "Manama",
    "lat": 26.216667,
    "lon": 50.583333
  },
  {
    "iso2": "BD",
    "nameEn": "Dhaka",
    "nameNb": "Dhaka",
    "lat": 23.728889,
    "lon": 90.394444
  },
  {
    "iso2": "BT",
    "nameEn": "Thimphu",
    "nameNb": "Thimphu",
    "lat": 27.47135,
    "lon": 89.63367
  },
  {
    "iso2": "BN",
    "nameEn": "Bandar Seri Begawan",
    "nameNb": "Bandar Seri Begawan",
    "lat": 4.916667,
    "lon": 114.916667
  },
  {
    "iso2": "KH",
    "nameEn": "Phnom Penh",
    "nameNb": "Phnom Penh",
    "lat": 11.569583,
    "lon": 104.921028
  },
  {
    "iso2": "CN",
    "nameEn": "Beijing",
    "nameNb": "Beijing",
    "lat": 39.90403,
    "lon": 116.407526
  },
  {
    "iso2": "GE",
    "nameEn": "Tbilisi",
    "nameNb": "Tbilisi",
    "lat": 41.7225,
    "lon": 44.7925
  },
  {
    "iso2": "IN",
    "nameEn": "New Delhi",
    "nameNb": "New Delhi",
    "lat": 28.613889,
    "lon": 77.208889
  },
  {
    "iso2": "ID",
    "nameEn": "Jakarta",
    "nameNb": "Jakarta",
    "lat": -6.175278,
    "lon": 106.826944
  },
  {
    "iso2": "IR",
    "nameEn": "Tehran",
    "nameNb": "Teheran",
    "lat": 35.688889,
    "lon": 51.389722
  },
  {
    "iso2": "IQ",
    "nameEn": "Baghdad",
    "nameNb": "Bagdad",
    "lat": 33.315278,
    "lon": 44.366111
  },
  {
    "iso2": "IL",
    "nameEn": "Jerusalem",
    "nameNb": "Jerusalem",
    "lat": 31.776679,
    "lon": 35.234156
  },
  {
    "iso2": "JP",
    "nameEn": "Tokyo",
    "nameNb": "Tokyo",
    "lat": 35.689444,
    "lon": 139.691667
  },
  {
    "iso2": "JO",
    "nameEn": "Amman",
    "nameNb": "Amman",
    "lat": 31.930983,
    "lon": 35.926084
  },
  {
    "iso2": "KZ",
    "nameEn": "Nur-Sultan",
    "nameNb": "Astana",
    "lat": 51.133333,
    "lon": 71.433333
  },
  {
    "iso2": "KW",
    "nameEn": "Kuwait City",
    "nameNb": "Kuwait",
    "lat": 29.375,
    "lon": 47.98
  },
  {
    "iso2": "KG",
    "nameEn": "Bishkek",
    "nameNb": "Bisjkek",
    "lat": 42.866667,
    "lon": 74.566667
  },
  {
    "iso2": "LA",
    "nameEn": "Vientiane",
    "nameNb": "Vientiane",
    "lat": 17.98,
    "lon": 102.63
  },
  {
    "iso2": "LB",
    "nameEn": "Beirut",
    "nameNb": "Beirut",
    "lat": 33.886944,
    "lon": 35.513056
  },
  {
    "iso2": "MY",
    "nameEn": "Kuala Lumpur",
    "nameNb": "Kuala Lumpur",
    "lat": 3.147778,
    "lon": 101.695278
  },
  {
    "iso2": "MV",
    "nameEn": "Male",
    "nameNb": "Malé",
    "lat": 4.175,
    "lon": 73.508333
  },
  {
    "iso2": "MN",
    "nameEn": "Ulaanbaatar",
    "nameNb": "Ulan Bator",
    "lat": 47.921357,
    "lon": 106.905515
  },
  {
    "iso2": "MM",
    "nameEn": "Nay Pyi Taw",
    "nameNb": "Nay Pyi Taw",
    "lat": 19.7475,
    "lon": 96.115
  },
  {
    "iso2": "NP",
    "nameEn": "Kathmandu",
    "nameNb": "Katmandu",
    "lat": 27.71,
    "lon": 85.32
  },
  {
    "iso2": "KP",
    "nameEn": "Pyongyang",
    "nameNb": "Pyongyang",
    "lat": 39.016667,
    "lon": 125.7475
  },
  {
    "iso2": "OM",
    "nameEn": "Muscat",
    "nameNb": "Muskat",
    "lat": 23.613889,
    "lon": 58.592222
  },
  {
    "iso2": "PK",
    "nameEn": "Islamabad",
    "nameNb": "Islamabad",
    "lat": 33.698889,
    "lon": 73.036944
  },
  {
    "iso2": "PS",
    "nameEn": "Ramallah",
    "nameNb": "Ramallah",
    "lat": 31.896944,
    "lon": 35.201667
  },
  {
    "iso2": "PH",
    "nameEn": "Manila",
    "nameNb": "Manila",
    "lat": 14.595833,
    "lon": 120.977222
  },
  {
    "iso2": "QA",
    "nameEn": "Doha",
    "nameNb": "Doha",
    "lat": 25.286111,
    "lon": 51.529444
  },
  {
    "iso2": "SA",
    "nameEn": "Riyadh",
    "nameNb": "Riyadh",
    "lat": 24.638333,
    "lon": 46.715
  },
  {
    "iso2": "SG",
    "nameEn": "Singapore",
    "nameNb": "Singapore",
    "lat": 1.3,
    "lon": 103.8
  },
  {
    "iso2": "KR",
    "nameEn": "Seoul",
    "nameNb": "Seoul",
    "lat": 37.56,
    "lon": 126.99
  },
  {
    "iso2": "LK",
    "nameEn": "Colombo",
    "nameNb": "Colombo",
    "lat": 6.926667,
    "lon": 79.860556
  },
  {
    "iso2": "SY",
    "nameEn": "Damascus",
    "nameNb": "Damaskus",
    "lat": 33.513,
    "lon": 36.292
  },
  {
    "iso2": "TW",
    "nameEn": "Taipei",
    "nameNb": "Taipei",
    "lat": 25.0375,
    "lon": 121.5625
  },
  {
    "iso2": "TJ",
    "nameEn": "Dushanbe",
    "nameNb": "Dusjanbe",
    "lat": 38.573056,
    "lon": 68.786389
  },
  {
    "iso2": "TH",
    "nameEn": "Bangkok",
    "nameNb": "Bangkok",
    "lat": 13.75,
    "lon": 100.516667
  },
  {
    "iso2": "TL",
    "nameEn": "Dili",
    "nameNb": "Dili",
    "lat": -8.553611,
    "lon": 125.578333
  },
  {
    "iso2": "TR",
    "nameEn": "Ankara",
    "nameNb": "Ankara",
    "lat": 39.93576,
    "lon": 32.83869
  },
  {
    "iso2": "TM",
    "nameEn": "Ashgabat",
    "nameNb": "Asjkhabad",
    "lat": 37.95,
    "lon": 58.383333
  },
  {
    "iso2": "AE",
    "nameEn": "Abu Dhabi",
    "nameNb": "Abu Dhabi",
    "lat": 24.451111,
    "lon": 54.396944
  },
  {
    "iso2": "UZ",
    "nameEn": "Tashkent",
    "nameNb": "Tasjkent",
    "lat": 41.311111,
    "lon": 69.279722
  },
  {
    "iso2": "VN",
    "nameEn": "Hanoi",
    "nameNb": "Hanoi",
    "lat": 21.0245,
    "lon": 105.84117
  },
  {
    "iso2": "YE",
    "nameEn": "Sanaa",
    "nameNb": "Sana",
    "lat": 15.35,
    "lon": 44.2
  },
  {
    "iso2": "AG",
    "nameEn": "St. John's",
    "nameNb": "Saint John's",
    "lat": 17.121111,
    "lon": -61.844722
  },
  {
    "iso2": "AR",
    "nameEn": "Buenos Aires",
    "nameNb": "Buenos Aires",
    "lat": -34.599722,
    "lon": -58.381944
  },
  {
    "iso2": "BS",
    "nameEn": "Nassau",
    "nameNb": "Nassau",
    "lat": 25.078056,
    "lon": -77.338611
  },
  {
    "iso2": "BB",
    "nameEn": "Bridgetown",
    "nameNb": "Bridgetown",
    "lat": 13.0975,
    "lon": -59.616667
  },
  {
    "iso2": "BZ",
    "nameEn": "Belmopan",
    "nameNb": "Belmopan",
    "lat": 17.25,
    "lon": -88.7675
  },
  {
    "iso2": "BO",
    "nameEn": "Sucre",
    "nameNb": "Sucre",
    "lat": -19.0475,
    "lon": -65.26
  },
  {
    "iso2": "BR",
    "nameEn": "Brasilia",
    "nameNb": "Brasília",
    "lat": -15.793889,
    "lon": -47.882778
  },
  {
    "iso2": "CA",
    "nameEn": "Ottawa",
    "nameNb": "Ottawa",
    "lat": 45.424722,
    "lon": -75.695
  },
  {
    "iso2": "CL",
    "nameEn": "Santiago",
    "nameNb": "Santiago de Chile",
    "lat": -33.4375,
    "lon": -70.65
  },
  {
    "iso2": "CO",
    "nameEn": "Bogota",
    "nameNb": "Bogotá",
    "lat": 4.60971,
    "lon": -74.08175
  },
  {
    "iso2": "CR",
    "nameEn": "San Jose",
    "nameNb": "San José",
    "lat": 9.932739,
    "lon": -84.079614
  },
  {
    "iso2": "CU",
    "nameEn": "Havana",
    "nameNb": "Havanna",
    "lat": 23.136667,
    "lon": -82.358889
  },
  {
    "iso2": "DM",
    "nameEn": "Roseau",
    "nameNb": "Roseau",
    "lat": 15.3,
    "lon": -61.383333
  },
  {
    "iso2": "DO",
    "nameEn": "Santo Domingo",
    "nameNb": "Santo Domingo",
    "lat": 18.4625,
    "lon": -69.936111
  },
  {
    "iso2": "EC",
    "nameEn": "Quito",
    "nameNb": "Quito",
    "lat": -0.22,
    "lon": -78.5125
  },
  {
    "iso2": "SV",
    "nameEn": "San Salvador",
    "nameNb": "San Salvador",
    "lat": 13.697597,
    "lon": -89.191156
  },
  {
    "iso2": "GD",
    "nameEn": "St. George's",
    "nameNb": "St. George's",
    "lat": 12.0525,
    "lon": -61.753056
  },
  {
    "iso2": "GT",
    "nameEn": "Guatemala City",
    "nameNb": "Guatemala by",
    "lat": 14.641667,
    "lon": -90.513333
  },
  {
    "iso2": "GY",
    "nameEn": "Georgetown",
    "nameNb": "Georgetown",
    "lat": 6.805833,
    "lon": -58.150833
  },
  {
    "iso2": "HT",
    "nameEn": "Port-au-Prince",
    "nameNb": "Port-au-Prince",
    "lat": 18.546944,
    "lon": -72.340278
  },
  {
    "iso2": "HN",
    "nameEn": "Tegucigalpa",
    "nameNb": "Tegucigalpa",
    "lat": 14.105783,
    "lon": -87.204706
  },
  {
    "iso2": "JM",
    "nameEn": "Kingston",
    "nameNb": "Kingston",
    "lat": 17.971389,
    "lon": -76.793056
  },
  {
    "iso2": "MX",
    "nameEn": "Mexico City",
    "nameNb": "Mexico by",
    "lat": 19.353773,
    "lon": -99.13589
  },
  {
    "iso2": "NI",
    "nameEn": "Managua",
    "nameNb": "Managua",
    "lat": 12.154681,
    "lon": -86.273725
  },
  {
    "iso2": "PA",
    "nameEn": "Panama City",
    "nameNb": "Panama by",
    "lat": 8.971111,
    "lon": -79.534722
  },
  {
    "iso2": "PY",
    "nameEn": "Asuncion",
    "nameNb": "Asunción",
    "lat": -25.28,
    "lon": -57.634444
  },
  {
    "iso2": "PE",
    "nameEn": "Lima",
    "nameNb": "Lima",
    "lat": -12.06,
    "lon": -77.0375
  },
  {
    "iso2": "KN",
    "nameEn": "Basseterre",
    "nameNb": "Basseterre",
    "lat": 17.298333,
    "lon": -62.734167
  },
  {
    "iso2": "LC",
    "nameEn": "Castries",
    "nameNb": "Castries",
    "lat": 14.010833,
    "lon": -60.989444
  },
  {
    "iso2": "VC",
    "nameEn": "Kingstown",
    "nameNb": "Kingstown",
    "lat": 13.15527,
    "lon": -61.22742
  },
  {
    "iso2": "SR",
    "nameEn": "Paramaribo",
    "nameNb": "Paramaribo",
    "lat": 5.866667,
    "lon": -55.166667
  },
  {
    "iso2": "TT",
    "nameEn": "Port of Spain",
    "nameNb": "Port of Spain",
    "lat": 10.666667,
    "lon": -61.516667
  },
  {
    "iso2": "US",
    "nameEn": "Washington",
    "nameNb": "Washington D.C.",
    "lat": 38.895,
    "lon": -77.036667
  },
  {
    "iso2": "UY",
    "nameEn": "Montevideo",
    "nameNb": "Montevideo",
    "lat": -34.905917,
    "lon": -56.191311
  },
  {
    "iso2": "VE",
    "nameEn": "Caracas",
    "nameNb": "Caracas",
    "lat": 10.506111,
    "lon": -66.914444
  },
  {
    "iso2": "AU",
    "nameEn": "Canberra",
    "nameNb": "Canberra",
    "lat": -35.293056,
    "lon": 149.126944
  },
  {
    "iso2": "FJ",
    "nameEn": "Suva",
    "nameNb": "Suva",
    "lat": -18.133333,
    "lon": 178.433333
  },
  {
    "iso2": "KI",
    "nameEn": "Tarawa",
    "nameNb": "South Tarawa",
    "lat": 1.333333,
    "lon": 172.966667
  },
  {
    "iso2": "MH",
    "nameEn": "Majuro",
    "nameNb": "Majuro",
    "lat": 7.0918,
    "lon": 171.3802
  },
  {
    "iso2": "FM",
    "nameEn": "Palikir",
    "nameNb": "Palikir",
    "lat": 6.917778,
    "lon": 158.185
  },
  {
    "iso2": "NR",
    "nameEn": "Yaren",
    "nameNb": "Yaren",
    "lat": -0.5477,
    "lon": 166.920867
  },
  {
    "iso2": "NZ",
    "nameEn": "Wellington",
    "nameNb": "Wellington",
    "lat": -41.288889,
    "lon": 174.777222
  },
  {
    "iso2": "PW",
    "nameEn": "Ngerulmud",
    "nameNb": "Ngerulmud",
    "lat": 7.500556,
    "lon": 134.624167
  },
  {
    "iso2": "PG",
    "nameEn": "Port Moresby",
    "nameNb": "Port Moresby",
    "lat": -9.478889,
    "lon": 147.149444
  },
  {
    "iso2": "WS",
    "nameEn": "Apia",
    "nameNb": "Apia",
    "lat": -13.833333,
    "lon": -171.833333
  },
  {
    "iso2": "SB",
    "nameEn": "Honiara",
    "nameNb": "Honiara",
    "lat": -9.433333,
    "lon": 159.95
  },
  {
    "iso2": "TO",
    "nameEn": "Nuku'alofa",
    "nameNb": "Nuku'alofa",
    "lat": -21.13434,
    "lon": -175.201808
  },
  {
    "iso2": "TV",
    "nameEn": "Funafuti",
    "nameNb": "Funafuti",
    "lat": -8.504778,
    "lon": 179.117361
  },
  {
    "iso2": "VU",
    "nameEn": "Port Vila",
    "nameNb": "Port Vila",
    "lat": -17.73333,
    "lon": 168.316667
  }
];

export function getCapitals(region?: AtlasRegion): AtlasCapital[] {
  if (!region) {
    return [...capitals];
  }

  return capitals.filter((capital) => regionByIso2.get(capital.iso2) === region);
}
