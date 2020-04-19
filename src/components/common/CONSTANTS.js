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

export const DISTRICT_TYPES = [
  { id: 'nc', name: 'Neighborhood Council District' },
  { id: 'cc', name: 'City Council District' },
  // { id: 'bid', name: 'Business Improvement District' },
  // { id: 'sd', name: 'Supervisory District' },
];

export const COMPARISON_SETS = {
  set1: {
    color: '#DDEC9F',
    name: 'Set 1',
  },
  set2: {
    color: '#565656',
    name: 'Set 2',
  },
};

export const MENU_TABS = {
  MAP: 'Map',
  VISUALIZATIONS: 'Data Visualization',
};

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

export const COUNCILS = [
  {
    id: 6,
    name: 'Arleta NC',
    region: 'North Valley',
  },
  {
    id: 18,
    name: 'Encino NC',
    region: 'South Valley',
  },
  {
    id: 42,
    name: 'Arroyo Seco NC',
    region: 'East LA',
  },
  {
    id: 37,
    name: 'Atwater Village NC',
    region: 'East LA',
  },
  {
    id: 64,
    name: 'Bel Air-Beverly Crest NC',
    region: 'Central LA',
  },
  {
    id: 50,
    name: 'Boyle Heights NC',
    region: 'East LA',
  },
  {
    id: 65,
    name: 'Brentwood CC',
    region: 'West LA',
  },
  {
    id: 13,
    name: 'Canoga Park NC',
    region: 'North Valley',
  },
  {
    id: 110,
    name: 'Central Alameda NC',
    region: 'South LA',
  },
  {
    id: 32,
    name: 'Central Hollywood NC',
    region: 'Central LA',
  },
  {
    id: 95,
    name: 'Central San Pedro NC',
    region: 'Harbor',
  },
  {
    id: 99,
    name: 'Chatsworth NC',
    region: 'North Valley',
  },
  {
    id: 96,
    name: 'Coastal San Pedro NC',
    region: 'Harbor',
  },
  {
    id: 86,
    name: 'Community And Neighbors For Ninth District Unity (CANNDU)',
    region: 'South LA',
  },
  {
    id: 70,
    name: 'Del Rey NC',
    region: 'West LA',
  },
  {
    id: 52,
    name: 'Downtown Los Angeles',
    region: 'Central LA',
  },
  {
    id: 40,
    name: 'Eagle Rock NC',
    region: 'East LA',
  },
  {
    id: 34,
    name: 'East Hollywood NC',
    region: 'Central LA',
  },
  {
    id: 44,
    name: 'Echo Park NC',
    region: 'Central LA',
  },
  {
    id: 43,
    name: 'Elysian Valley Riverside NC',
    region: 'East LA',
  },
  {
    id: 81,
    name: 'Empowerment Congress Central Area NDC',
    region: 'South LA',
  },
  {
    id: 77,
    name: 'Empowerment Congress North Area NDC',
    region: 'South LA',
  },
  {
    id: 87,
    name: 'Empowerment Congress Southeast Area NDC',
    region: 'South LA',
  },
  {
    id: 84,
    name: 'Empowerment Congress Southwest Area NDC',
    region: 'South LA',
  },
  {
    id: 79,
    name: 'Empowerment Congress West Area NDC',
    region: 'South LA',
  },
  {
    id: 9,
    name: 'Foothill Trails District NC',
    region: 'North Valley',
  },
  {
    id: 39,
    name: 'Glassell Park NC',
    region: 'East LA',
  },
  {
    id: 4,
    name: 'Granada Hills North NC',
    region: 'North Valley',
  },
  {
    id: 118,
    name: 'Granada Hills South NC',
    region: 'North Valley',
  },
  {
    id: 102,
    name: 'Greater Cypress Park NC',
    region: 'East LA',
  },
  {
    id: 28,
    name: 'Greater Toluca Lake NC',
    region: 'South Valley',
  },
  {
    id: 21,
    name: 'Greater Valley Glen Council',
    region: 'South Valley',
  },
  {
    id: 119,
    name: 'Greater Wilshire NC',
    region: 'Central LA',
  },
  {
    id: 92,
    name: 'Harbor City NC',
    region: 'Harbor',
  },
  {
    id: 90,
    name: 'Harbor Gateway North NC',
    region: 'Harbor',
  },
  {
    id: 91,
    name: 'Harbor Gateway South NC',
    region: 'Harbor',
  },
  {
    id: 126,
    name: 'Hermon NC',
    region: 'East LA',
  },
  {
    id: 46,
    name: 'Historic Cultural NC',
    region: 'Central LA',
  },
  {
    id: 128,
    name: 'Historic Cultural North NC',
    region: 'Central LA',
  },
  {
    id: 122,
    name: 'Historic Filipinotown NC',
    region: 'East LA',
  },
  {
    id: 41,
    name: 'Historic Highland Park NC',
    region: 'East LA',
  },
  {
    id: 29,
    name: 'Hollywood Hills West NC',
    region: 'South Valley',
  },
  {
    id: 33,
    name: 'Hollywood Studio District NC',
    region: 'Central LA',
  },
  {
    id: 30,
    name: 'Hollywood United NC',
    region: 'Central LA',
  },
  {
    id: 48,
    name: 'LA-32 NC',
    region: 'East LA',
  },
  {
    id: 19,
    name: 'Lake Balboa NC',
    region: 'South Valley',
  },
  {
    id: 47,
    name: 'Lincoln Heights NC',
    region: 'East LA',
  },
  {
    id: 36,
    name: 'Los Feliz NC',
    region: 'Central LA',
  },
  {
    id: 54,
    name: 'Macarthur Park NC',
    region: 'Central LA',
  },
  {
    id: 67,
    name: 'Mar Vista CC',
    region: 'West LA',
  },
  {
    id: 73,
    name: 'Mid City NC',
    region: 'Central LA',
  },
  {
    id: 58,
    name: 'Mid City West CC',
    region: 'Central LA',
  },
  {
    id: 101,
    name: 'Mission Hills NC',
    region: 'North Valley',
  },
  {
    id: 25,
    name: 'NC Valley Village',
    region: 'South Valley',
  },
  {
    id: 71,
    name: 'NC Westchester/Playa',
    region: 'West LA',
  },
  {
    id: 24,
    name: 'Noho NC',
    region: 'South Valley',
  },
  {
    id: 22,
    name: 'Noho West NC',
    region: 'North Valley',
  },
  {
    id: 112,
    name: 'North Hills East',
    region: 'North Valley',
  },
  {
    id: 111,
    name: 'North Hills West NC',
    region: 'North Valley',
  },
  {
    id: 23,
    name: 'North Hollywood Northeast NC',
    region: 'North Valley',
  },
  {
    id: 120,
    name: 'Northridge East',
    region: 'North Valley',
  },
  {
    id: 124,
    name: 'Northridge South NC',
    region: 'North Valley',
  },
  {
    id: 113,
    name: 'Northridge West',
    region: 'North Valley',
  },
  {
    id: 94,
    name: 'Northwest San Pedro NC',
    region: 'Harbor',
  },
  {
    id: 127,
    name: 'North Westwood NC',
    region: 'West LA',
  },
  {
    id: 2,
    name: 'Old Northridge CC',
    region: 'North Valley',
  },
  {
    id: 104,
    name: 'Olympic Park NC',
    region: 'Central LA',
  },
  {
    id: 117,
    name: 'Pacific Palisades NC',
    region: 'West LA',
  },
  {
    id: 7,
    name: 'Pacoima NC',
    region: 'North Valley',
  },
  {
    id: 115,
    name: 'Palms NC',
    region: 'West LA',
  },
  {
    id: 100,
    name: 'Panorama City NC',
    region: 'North Valley',
  },
  {
    id: 80,
    name: 'Park Mesa Heights CC',
    region: 'South LA',
  },
  {
    id: 60,
    name: 'P.I.C.O. NC',
    region: 'Central LA',
  },
  {
    id: 76,
    name: 'Pico Union NC',
    region: 'Central LA',
  },
  {
    id: 114,
    name: 'Porter Ranch NC',
    region: 'North Valley',
  },
  {
    id: 53,
    name: 'Rampart Village NC',
    region: 'Central LA',
  },
  {
    id: 15,
    name: 'Reseda NC',
    region: 'South Valley',
  },
  {
    id: 26,
    name: 'Sherman Oaks NC',
    region: 'South Valley',
  },
  {
    id: 38,
    name: 'Silver Lake NC',
    region: 'Central LA',
  },
  {
    id: 78,
    name: 'South Central NC',
    region: 'South LA',
  },
  {
    id: 61,
    name: 'South Robertson NC',
    region: 'Central LA',
  },
  {
    id: 27,
    name: 'Studio City NC',
    region: 'South Valley',
  },
  {
    id: 10,
    name: 'Sunland-Tujunga NC',
    region: 'North Valley',
  },
  {
    id: 8,
    name: 'Sun Valley Area NC',
    region: 'North Valley',
  },
  {
    id: 5,
    name: 'Sylmar NC',
    region: 'North Valley',
  },
  {
    id: 17,
    name: 'Tarzana NC',
    region: 'South Valley',
  },
  {
    id: 123,
    name: 'United For Victory',
    region: 'South LA',
  },
  {
    id: 74,
    name: 'United Neighborhoods Of The Historic Arlington Heights, West Adams, And Jefferson Park Community',
    region: 'South LA',
  },
  {
    id: 20,
    name: 'Van Nuys NC',
    region: 'South Valley',
  },
  {
    id: 68,
    name: 'Venice NC',
    region: 'West LA',
  },
  {
    id: 109,
    name: 'Voices Of 90037',
    region: 'South LA',
  },
  {
    id: 88,
    name: 'Watts NC',
    region: 'South LA',
  },
  {
    id: 75,
    name: 'West Adams NC',
    region: 'South LA',
  },
  {
    id: 11,
    name: 'West Hills NC',
    region: 'North Valley',
  },
  {
    id: 97,
    name: 'Westlake North NC',
    region: 'Central LA',
  },
  {
    id: 121,
    name: 'Westlake South NC',
    region: 'Central LA',
  },
  {
    id: 66,
    name: 'West Los Angeles NC',
    region: 'West LA',
  },
  {
    id: 62,
    name: 'Westside NC',
    region: 'West LA',
  },
  {
    id: 63,
    name: 'Westwood NC',
    region: 'West LA',
  },
  {
    id: 93,
    name: 'Wilmington NC',
    region: 'Harbor',
  },
  {
    id: 55,
    name: 'Wilshire Center - Koreatown NC',
    region: 'Central LA',
  },
  {
    id: 14,
    name: 'Winnetka NC',
    region: 'South Valley',
  },
  {
    id: 16,
    name: 'Woodland Hills-Warner Center NC',
    region: 'South Valley',
  },
  {
    id: 125,
    name: 'Zapata King NC',
    region: 'South LA',
  },
];
