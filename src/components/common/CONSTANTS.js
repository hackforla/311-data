export default {};

export const REQUEST_TYPES = {
  'Dead Animal Removal': {
    displayName: 'Dead Animal',
    abbrev: 'DAN',
    color: '#4FEFEF',
  },
  'Homeless Encampment': {
    displayName: 'Homeless Encampment',
    abbrev: 'HLE',
    color: '#ECB800',
  },
  'Single Streetlight Issue': {
    displayName: 'Single Streetlight',
    abbrev: 'SSL',
    color: '#AD7B56',
  },
  'Multiple Streetlight Issue': {
    displayName: 'Multiple Streetlight',
    abbrev: 'MSL',
    color: '#F7ADAD',
  },
  Feedback: {
    displayName: 'Feedback',
    abbrev: 'FBK',
    color: '#FFE6B7',
  },
  'Bulky Items': {
    displayName: 'Bulky Items',
    abbrev: 'BLK',
    color: '#FF0000',
  },
  'Electronic Waste': {
    displayName: 'E-Waste',
    abbrev: 'EWT',
    color: '#DDEC9F',
  },
  'Metal/Household Appliances': {
    displayName: 'Metal/Household Appliances',
    abbrev: 'MHA',
    color: '#B8D0FF',
  },
  'Graffiti Removal': {
    displayName: 'Graffiti',
    abbrev: 'GFT',
    color: '#2368D0',
  },
  'Illegal Dumping Pickup': {
    displayName: 'Illegal Dumping',
    abbrev: 'ILD',
    color: '#6A8011',
  },
  Other: {
    displayName: 'Other',
    abbrev: 'OTH',
    color: '#6D7C93',
  },
};

export const REQUEST_SOURCES = [
  {
    type: 'Mobile App',
    abbrev: 'MA',
    color: '#1D66F2',
  },
  {
    type: 'Call',
    abbrev: 'Call',
    color: '#D8E5FF',
  },
  {
    type: 'Email',
    abbrev: 'Email',
    color: '#708ABD',
  },
  {
    type: 'Driver Self Report',
    abbrev: 'DSR',
    color: '#C4C6C9',
  },
  {
    type: 'Self Service',
    abbrev: 'SS',
    color: '#0C2A64',
  },
  {
    type: 'Other',
    abbrev: 'Other',
    color: '#6A98F1',
  },
];

export const COUNCILS = [
  {
    id: 6,
    name: 'ARLETA NC',
  },
  {
    id: 42,
    name: 'ARROYO SECO NC',
  },
  {
    id: 37,
    name: 'ATWATER VILLAGE NC',
  },
  {
    id: 64,
    name: 'BEL AIR-BEVERLY CREST NC',
  },
  {
    id: 50,
    name: 'BOYLE HEIGHTS NC',
  },
  {
    id: 65,
    name: 'BRENTWOOD CC',
  },
  {
    id: 13,
    name: 'CANOGA PARK NC',
  },
  {
    id: 110,
    name: 'CENTRAL ALAMEDA NC',
  },
  {
    id: 32,
    name: 'CENTRAL HOLLYWOOD NC',
  },
  {
    id: 95,
    name: 'CENTRAL SAN PEDRO NC',
  },
  {
    id: 99,
    name: 'CHATSWORTH NC',
  },
  {
    id: 96,
    name: 'COASTAL SAN PEDRO NC',
  },
  {
    id: 86,
    name: 'COMMUNITY AND NEIGHBORS FOR NINTH DISTRICT UNITY (CANNDU)',
  },
  {
    id: 70,
    name: 'DEL REY NC',
  },
  {
    id: 52,
    name: 'DOWNTOWN LOS ANGELES',
  },
  {
    id: 40,
    name: 'EAGLE ROCK NC',
  },
  {
    id: 34,
    name: 'EAST HOLLYWOOD NC',
  },
  {
    id: 44,
    name: 'ECHO PARK NC',
  },
  {
    id: 43,
    name: 'ELYSIAN VALLEY RIVERSIDE NC',
  },
  {
    id: 81,
    name: 'EMPOWERMENT CONGRESS CENTRAL AREA NDC',
  },
  {
    id: 77,
    name: 'EMPOWERMENT CONGRESS NORTH AREA NDC',
  },
  {
    id: 87,
    name: 'EMPOWERMENT CONGRESS SOUTHEAST AREA NDC',
  },
  {
    id: 84,
    name: 'EMPOWERMENT CONGRESS SOUTHWEST AREA NDC',
  },
  {
    id: 79,
    name: 'EMPOWERMENT CONGRESS WEST AREA NDC',
  },
  {
    id: 18,
    name: 'ENCINO NC',
  },
  {
    id: 9,
    name: 'FOOTHILL TRAILS DISTRICT NC',
  },
  {
    id: 39,
    name: 'GLASSELL PARK NC',
  },
  {
    id: 4,
    name: 'GRANADA HILLS NORTH NC',
  },
  {
    id: 118,
    name: 'GRANADA HILLS SOUTH NC',
  },
  {
    id: 102,
    name: 'GREATER CYPRESS PARK NC',
  },
  {
    id: 28,
    name: 'GREATER TOLUCA LAKE NC',
  },
  {
    id: 21,
    name: 'GREATER VALLEY GLEN COUNCIL',
  },
  {
    id: 119,
    name: 'GREATER WILSHIRE NC',
  },
  {
    id: 92,
    name: 'HARBOR CITY NC',
  },
  {
    id: 90,
    name: 'HARBOR GATEWAY NORTH NC',
  },
  {
    id: 91,
    name: 'HARBOR GATEWAY SOUTH NC',
  },
  {
    id: 126,
    name: 'HERMON NC',
  },
  {
    id: 46,
    name: 'HISTORIC CULTURAL NC',
  },
  {
    id: 128,
    name: 'HISTORIC CULTURAL NORTH NC',
  },
  {
    id: 122,
    name: 'HISTORIC FILIPINOTOWN NC',
  },
  {
    id: 41,
    name: 'HISTORIC HIGHLAND PARK NC',
  },
  {
    id: 29,
    name: 'HOLLYWOOD HILLS WEST NC',
  },
  {
    id: 33,
    name: 'HOLLYWOOD STUDIO DISTRICT NC',
  },
  {
    id: 30,
    name: 'HOLLYWOOD UNITED NC',
  },
  {
    id: 48,
    name: 'LA-32 NC',
  },
  {
    id: 19,
    name: 'LAKE BALBOA NC',
  },
  {
    id: 47,
    name: 'LINCOLN HEIGHTS NC',
  },
  {
    id: 36,
    name: 'LOS FELIZ NC',
  },
  {
    id: 54,
    name: 'MACARTHUR PARK NC',
  },
  {
    id: 67,
    name: 'MAR VISTA CC',
  },
  {
    id: 73,
    name: 'MID CITY NC',
  },
  {
    id: 58,
    name: 'MID CITY WEST CC',
  },
  {
    id: 101,
    name: 'MISSION HILLS NC',
  },
  {
    id: 25,
    name: 'NC VALLEY VILLAGE',
  },
  {
    id: 71,
    name: 'NC WESTCHESTER/PLAYA',
  },
  {
    id: 24,
    name: 'NOHO NC',
  },
  {
    id: 22,
    name: 'NOHO WEST NC',
  },
  {
    id: 112,
    name: 'NORTH HILLS EAST',
  },
  {
    id: 111,
    name: 'NORTH HILLS WEST NC',
  },
  {
    id: 23,
    name: 'NORTH HOLLYWOOD NORTHEAST NC',
  },
  {
    id: 120,
    name: 'NORTHRIDGE EAST',
  },
  {
    id: 124,
    name: 'NORTHRIDGE SOUTH NC',
  },
  {
    id: 113,
    name: 'NORTHRIDGE WEST',
  },
  {
    id: 94,
    name: 'NORTHWEST SAN PEDRO NC',
  },
  {
    id: 127,
    name: 'NORTH WESTWOOD NC',
  },
  {
    id: 2,
    name: 'OLD NORTHRIDGE CC',
  },
  {
    id: 104,
    name: 'OLYMPIC PARK NC',
  },
  {
    id: 117,
    name: 'PACIFIC PALISADES NC',
  },
  {
    id: 7,
    name: 'PACOIMA NC',
  },
  {
    id: 115,
    name: 'PALMS NC',
  },
  {
    id: 100,
    name: 'PANORAMA CITY NC',
  },
  {
    id: 80,
    name: 'PARK MESA HEIGHTS CC',
  },
  {
    id: 60,
    name: 'P.I.C.O. NC',
  },
  {
    id: 76,
    name: 'PICO UNION NC',
  },
  {
    id: 114,
    name: 'PORTER RANCH NC',
  },
  {
    id: 53,
    name: 'RAMPART VILLAGE NC',
  },
  {
    id: 15,
    name: 'RESEDA NC',
  },
  {
    id: 26,
    name: 'SHERMAN OAKS NC',
  },
  {
    id: 38,
    name: 'SILVER LAKE NC',
  },
  {
    id: 78,
    name: 'SOUTH CENTRAL NC',
  },
  {
    id: 61,
    name: 'SOUTH ROBERTSON NC',
  },
  {
    id: 27,
    name: 'STUDIO CITY NC',
  },
  {
    id: 10,
    name: 'SUNLAND-TUJUNGA NC',
  },
  {
    id: 8,
    name: 'SUN VALLEY AREA NC',
  },
  {
    id: 5,
    name: 'SYLMAR NC',
  },
  {
    id: 17,
    name: 'TARZANA NC',
  },
  {
    id: 123,
    name: 'UNITED FOR VICTORY',
  },
  {
    id: 74,
    name: 'UNITED NEIGHBORHOODS OF THE HISTORIC ARLINGTON HEIGHTS, WEST ADAMS, AND JEFFERSON PARK COMMUNITY',
  },
  {
    id: 20,
    name: 'VAN NUYS NC',
  },
  {
    id: 68,
    name: 'VENICE NC',
  },
  {
    id: 109,
    name: 'VOICES OF 90037',
  },
  {
    id: 88,
    name: 'WATTS NC',
  },
  {
    id: 75,
    name: 'WEST ADAMS NC',
  },
  {
    id: 11,
    name: 'WEST HILLS NC',
  },
  {
    id: 97,
    name: 'WESTLAKE NORTH NC',
  },
  {
    id: 121,
    name: 'WESTLAKE SOUTH NC',
  },
  {
    id: 66,
    name: 'WEST LOS ANGELES NC',
  },
  {
    id: 62,
    name: 'WESTSIDE NC',
  },
  {
    id: 63,
    name: 'WESTWOOD NC',
  },
  {
    id: 93,
    name: 'WILMINGTON NC',
  },
  {
    id: 55,
    name: 'WILSHIRE CENTER - KOREATOWN NC',
  },
  {
    id: 14,
    name: 'WINNETKA NC',
  },
  {
    id: 16,
    name: 'WOODLAND HILLS-WARNER CENTER NC',
  },
  {
    id: 125,
    name: 'ZAPATA KING NC',
  },
];

export const CITY_COUNCILS = [
  { id: 1, name: 'Council District 1' },
  { id: 2, name: 'Council District 2' },
  { id: 3, name: 'Council District 3' },
  { id: 4, name: 'Council District 4' },
  { id: 5, name: 'Council District 5' },
  { id: 6, name: 'Council District 6' },
  { id: 7, name: 'Council District 7' },
  { id: 8, name: 'Council District 8' },
  { id: 9, name: 'Council District 9' },
  { id: 10, name: 'Council District 10' },
  { id: 11, name: 'Council District 11' },
  { id: 12, name: 'Council District 12' },
  { id: 13, name: 'Council District 13' },
  { id: 14, name: 'Council District 14' },
  { id: 15, name: 'Council District 15' },
];

export const DISTRICT_TYPES = [
  { id: 'nc', name: 'Neighborhood Council District', color: '#DDEC9F' },
  { id: 'cc', name: 'City Council District', color: '#565656' },
  // { id: 'bid', name: 'Business Improvement District' },
  // { id: 'sd', name: 'Supervisory District' },
];

export const MENU_TABS = {
  MAP: 'Map',
  VISUALIZATIONS: 'Data Visualization',
};
