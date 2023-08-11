export default {};

// 'primary' or 'alt' to change request type colors
const COLOR_SELECTION = 'alt';

export const REQUEST_TYPES = {
  'Dead Animal Removal': {
    displayName: 'Dead Animal',
    abbrev: 'DAN',
    get color() {
      return this.colors[COLOR_SELECTION];
    },
    colors: {
      primary: '#4FEFEF',
      alt: '#768393',
    },
  },
  'Homeless Encampment': {
    displayName: 'Homeless Encampment',
    abbrev: 'HLE',
    get color() {
      return this.colors[COLOR_SELECTION];
    },
    colors: {
      primary: '#ECB800',
      alt: '#C16B1A',
    },
  },
  'Single Streetlight Issue': {
    displayName: 'Single Streetlight',
    abbrev: 'SSL',
    get color() {
      return this.colors[COLOR_SELECTION];
    },
    colors: {
      primary: '#AD7B56',
      alt: '#2B87C5',
    },
  },
  'Multiple Streetlight Issue': {
    displayName: 'Multiple Streetlight',
    abbrev: 'MSL',
    get color() {
      return this.colors[COLOR_SELECTION];
    },
    colors: {
      primary: '#F7ADAD',
      alt: '#1B9365',
    },
  },
  Feedback: {
    displayName: 'Feedback',
    abbrev: 'FBK',
    get color() {
      return this.colors[COLOR_SELECTION];
    },
    colors: {
      primary: '#FFE6B7',
      alt: '#0E251D',
    },
  },
  'Bulky Items': {
    displayName: 'Bulky Items',
    abbrev: 'BLK',
    get color() {
      return this.colors[COLOR_SELECTION];
    },
    colors: {
      primary: '#FF0000',
      alt: '#C056C8',
    },
  },
  'Electronic Waste': {
    displayName: 'E-Waste',
    abbrev: 'EWT',
    get color() {
      return this.colors[COLOR_SELECTION];
    },
    colors: {
      primary: '#DDEC9F',
      alt: '#EA435C',
    },
  },
  'Metal/Household Appliances': {
    displayName: 'Metal/Household Appliances',
    abbrev: 'MHA',
    get color() {
      return this.colors[COLOR_SELECTION];
    },
    colors: {
      primary: '#B8D0FF',
      alt: '#4F7CEE',
    },
  },
  'Graffiti Removal': {
    displayName: 'Graffiti',
    abbrev: 'GFT',
    get color() {
      return this.colors[COLOR_SELECTION];
    },
    colors: {
      primary: '#2368D0',
      alt: '#4F5564',
    },
  },
  'Illegal Dumping Pickup': {
    displayName: 'Illegal Dumping',
    abbrev: 'ILD',
    get color() {
      return this.colors[COLOR_SELECTION];
    },
    colors: {
      primary: '#6A8011',
      alt: '#8F70D7',
    },
  },
  Other: {
    displayName: 'Other',
    abbrev: 'OTH',
    get color() {
      return this.colors[COLOR_SELECTION];
    },
    colors: {
      primary: '#6D7C93',
      alt: '#842D8B',
    },
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

export const ACCESSIBILITY_INSTRUCTIONS = [
  {
    instruction: 'Move backward from link to link or to controls: ',
    shortcut: 'Shift + Tab',
  },
  {
    instruction: 'Select buttons: ',
    shortcut: 'Spacebar',
  },
  {
    instruction: 'Navigate and select Radio Buttons: ',
    shortcut: 'Arrow',
  },
  {
    instruction: 'Select/deselect boxes: ',
    shortcut: 'Spacebar',
  },
  {
    instruction: 'Move from box to box: ',
    shortcut: 'Tab',
  },
  {
    instruction: 'Open a List Box: ',
    shortcut: 'ALT + Down arrow',
  },
  {
    instruction: 'Read the prior screen: ',
    shortcut: 'CTRL + Page Up',
  },
  {
    instruction: 'Read the next screen: ',
    shortcut: 'CTRL + Page Down',
  },
  {
    instruction: 'Go to the top of the page: ',
    shortcut: 'CTRL + Home',
  },
  {
    instruction: 'Go to the bottom of the page: ',
    shortcut: 'CTRL + End',
  },
  {
    instruction: 'Close the current window (in Internet Explorer): ',
    shortcut: 'CTRL + W',
  },
  {
    instruction: 'Refresh the screen: ',
    shortcut: 'F5',
  },
  {
    instruction: 'Go back a page: ',
    shortcut: 'ALT + Left Arrow',
  },
  {
    instruction: 'Go forward a page: ',
    shortcut: 'ALT + Right Arrow',
  },
  {
    instruction: 'Navigate to and select the text in the address combo box: ',
    shortcut: 'ALT + D',
  },
];

/*
  NC regions and names are from here:
    https://empowerla.org/councils-by-service-region/

  Note that Central Avenue Historic is listed there (Region 9 - South LA 2),
  but it isn't anywhere in the DB, so we don't know the id number. It also
  isn't in the nc-boundary json. It's in this list with an id of -1, which
  won't return any results but also won't hurt anything.

  Also note the 4 councils that are commented at the end of the list.
    Historic Filipinotown NC -- #122
    Old Northridge CC -- -- #2
    Brentwood CC -- -- #65
    Pacific Palisades CC --  -- #117
  These are NOT listed on empowerla's website, and they aren't in the
  nc-boundary json. But there are requests associated with them in the DB.
*/

export const COUNCILS = [
  {
    id: 6,
    name: 'Arleta',
    region: 'North East Valley',
  },
  {
    id: 9,
    name: 'Foothill Trails District',
    region: 'North East Valley',
  },
  {
    id: 101,
    name: 'Mission Hills',
    region: 'North East Valley',
  },
  {
    id: 112,
    name: 'North Hills East',
    region: 'North East Valley',
  },
  {
    id: 7,
    name: 'Pacoima',
    region: 'North East Valley',
  },
  {
    id: 100,
    name: 'Panorama City',
    region: 'North East Valley',
  },
  {
    id: 8,
    name: 'Sun Valley',
    region: 'North East Valley',
  },
  {
    id: 10,
    name: 'Sunland-Tujunga',
    region: 'North East Valley',
  },
  {
    id: 5,
    name: 'Sylmar',
    region: 'North East Valley',
  },
  {
    id: 99,
    name: 'Chatsworth',
    region: 'North West Valley',
  },
  {
    id: 4,
    name: 'Granada Hills North',
    region: 'North West Valley',
  },
  {
    id: 118,
    name: 'Granada Hills South',
    region: 'North West Valley',
  },
  {
    id: 111,
    name: 'North Hills West',
    region: 'North West Valley',
  },
  {
    id: 120,
    name: 'Northridge East',
    region: 'North West Valley',
  },
  {
    id: 124,
    name: 'Northridge South',
    region: 'North West Valley',
  },
  {
    id: 113,
    name: 'Northridge West',
    region: 'North West Valley',
  },
  {
    id: 114,
    name: 'Porter Ranch',
    region: 'North West Valley',
  },
  {
    id: 13,
    name: 'Canoga Park',
    region: 'South West Valley',
  },
  {
    id: 18,
    name: 'Encino',
    region: 'South West Valley',
  },
  {
    id: 19,
    name: 'Lake Balboa',
    region: 'South West Valley',
  },
  {
    id: 15,
    name: 'Reseda',
    region: 'South West Valley',
  },
  {
    id: 17,
    name: 'Tarzana',
    region: 'South West Valley',
  },
  {
    id: 11,
    name: 'West Hills',
    region: 'South West Valley',
  },
  {
    id: 14,
    name: 'Winnetka',
    region: 'South West Valley',
  },
  {
    id: 16,
    name: 'Woodland Hills-Warner Center',
    region: 'South West Valley',
  },
  {
    id: 28,
    name: 'Greater Toluca Lake',
    region: 'South East Valley',
  },
  {
    id: 21,
    name: 'Greater Valley Glen',
    region: 'South East Valley',
  },
  {
    id: 24,
    name: 'NoHo',
    region: 'South East Valley',
  },
  {
    id: 23,
    name: 'North Hollywood Northeast',
    region: 'South East Valley',
  },
  {
    id: 22,
    name: 'North Hollywood West',
    region: 'South East Valley',
  },
  {
    id: 26,
    name: 'Sherman Oaks',
    region: 'South East Valley',
  },
  {
    id: 27,
    name: 'Studio City',
    region: 'South East Valley',
  },
  {
    id: 25,
    name: 'Valley Village',
    region: 'South East Valley',
  },
  {
    id: 20,
    name: 'Van Nuys',
    region: 'South East Valley',
  },
  {
    id: 32,
    name: 'Central Hollywood',
    region: 'Central 1',
  },
  {
    id: 34,
    name: 'East Hollywood',
    region: 'Central 1',
  },
  {
    id: 119,
    name: 'Greater Wilshire',
    region: 'Central 1',
  },
  {
    id: 29,
    name: 'Hollywood Hills West',
    region: 'Central 1',
  },
  {
    id: 33,
    name: 'Hollywood Studio District',
    region: 'Central 1',
  },
  {
    id: 30,
    name: 'Hollywood United',
    region: 'Central 1',
  },
  {
    id: 58,
    name: 'Mid City West',
    region: 'Central 1',
  },
  {
    id: 60,
    name: 'PICO',
    region: 'Central 1',
  },
  {
    id: 52,
    name: 'Downtown Los Angeles',
    region: 'Central 2',
  },
  {
    id: 46,
    name: 'Historic Cultural',
    region: 'Central 2',
  },
  {
    id: 128,
    name: 'Historic Cultural North',
    region: 'Central 2',
  },
  {
    id: 54,
    name: 'MacArthur Park',
    region: 'Central 2',
  },
  {
    id: 104,
    name: 'Olympic Park',
    region: 'Central 2',
  },
  {
    id: 76,
    name: 'Pico Union',
    region: 'Central 2',
  },
  {
    id: 97,
    name: 'Westlake North',
    region: 'Central 2',
  },
  {
    id: 121,
    name: 'Westlake South',
    region: 'Central 2',
  },
  {
    id: 55,
    name: 'Wilshire Center - Koreatown',
    region: 'Central 2',
  },
  {
    id: 37,
    name: 'Atwater Village',
    region: 'East',
  },
  {
    id: 44,
    name: 'Echo Park',
    region: 'East',
  },
  {
    id: 43,
    name: 'Elysian Valley Riverside',
    region: 'East',
  },
  {
    id: 36,
    name: 'Los Feliz',
    region: 'East',
  },
  {
    id: 53,
    name: 'Rampart Village',
    region: 'East',
  },
  {
    id: 38,
    name: 'Silver Lake',
    region: 'East',
  },
  {
    id: 42,
    name: 'Arroyo Seco',
    region: 'North East LA',
  },
  {
    id: 50,
    name: 'Boyle Heights',
    region: 'North East LA',
  },
  {
    id: 40,
    name: 'Eagle Rock',
    region: 'North East LA',
  },
  {
    id: 39,
    name: 'Glassell Park',
    region: 'North East LA',
  },
  {
    id: 102,
    name: 'Greater Cypress Park',
    region: 'North East LA',
  },
  {
    id: 126,
    name: 'Hermon',
    region: 'North East LA',
  },
  {
    id: 41,
    name: 'Historic Highland Park',
    region: 'North East LA',
  },
  {
    id: 48,
    name: 'LA-32',
    region: 'North East LA',
  },
  {
    id: 47,
    name: 'Lincoln Heights',
    region: 'North East LA',
  },
  {
    id: 86,
    name: 'CANNDU',
    region: 'South LA 2',
  },
  {
    id: 110,
    name: 'Central Alameda',
    region: 'South LA 2',
  },
  {
    id: -1, // REPLACE THIS WHEN WE KNOW THE ID
    name: 'Central Avenue Historic',
    region: 'South LA 2',
  },
  {
    id: 87,
    name: 'EC Southeast',
    region: 'South LA 2',
  },
  {
    id: 84,
    name: 'EC Southwest',
    region: 'South LA 2',
  },
  {
    id: 78,
    name: 'South Central',
    region: 'South LA 2',
  },
  {
    id: 123,
    name: 'United For Victory',
    region: 'South LA 2',
  },
  {
    id: 109,
    name: 'Voices Of 90037',
    region: 'South LA 2',
  },
  {
    id: 88,
    name: 'Watts',
    region: 'South LA 2',
  },
  {
    id: 125,
    name: 'Zapata King',
    region: 'South LA 2',
  },
  {
    id: 81,
    name: 'EC Central',
    region: 'South LA 1',
  },
  {
    id: 77,
    name: 'EC North',
    region: 'South LA 1',
  },
  {
    id: 79,
    name: 'EC West',
    region: 'South LA 1',
  },
  {
    id: 73,
    name: 'Mid City',
    region: 'South LA 1',
  },
  {
    id: 80,
    name: 'Park Mesa Heights',
    region: 'South LA 1',
  },
  {
    id: 74,
    name: 'United Neighborhoods',
    region: 'South LA 1',
  },
  {
    id: 75,
    name: 'West Adams',
    region: 'South LA 1',
  },
  {
    id: 64,
    name: 'Bel Air-Beverly Crest',
    region: 'West LA',
  },
  {
    id: 70,
    name: 'Del Rey',
    region: 'West LA',
  },
  {
    id: 67,
    name: 'Mar Vista',
    region: 'West LA',
  },
  {
    id: 127,
    name: 'North Westwood',
    region: 'West LA',
  },
  {
    id: 115,
    name: 'Palms',
    region: 'West LA',
  },
  {
    id: 61,
    name: 'South Robertson',
    region: 'West LA',
  },
  {
    id: 68,
    name: 'Venice',
    region: 'West LA',
  },
  {
    id: 71,
    name: 'Westchester/Playa',
    region: 'West LA',
  },
  {
    id: 66,
    name: 'West Los Angeles',
    region: 'West LA',
  },
  {
    id: 62,
    name: 'Westside',
    region: 'West LA',
  },
  {
    id: 63,
    name: 'Westwood',
    region: 'West LA',
  },
  {
    id: 95,
    name: 'Central San Pedro',
    region: 'Harbor',
  },
  {
    id: 96,
    name: 'Coastal San Pedro',
    region: 'Harbor',
  },
  {
    id: 92,
    name: 'Harbor City',
    region: 'Harbor',
  },
  {
    id: 90,
    name: 'Harbor Gateway North',
    region: 'Harbor',
  },
  {
    id: 91,
    name: 'Harbor Gateway South',
    region: 'Harbor',
  },
  {
    id: 94,
    name: 'Northwest San Pedro',
    region: 'Harbor',
  },
  {
    id: 93,
    name: 'Wilmington',
    region: 'Harbor',
  },
  // these aren't listed on empowerla's website, but they do show up in the DB
  // {
  //   id: 65,
  //   name: 'Brentwood CC',
  //   region: 'Unknown',
  // },
  // {
  //   id: 122,
  //   name: 'Historic Filipinotown NC',
  //   region: 'Unknown',
  // },
  // {
  //   id: 2,
  //   name: 'Old Northridge CC',
  //   region: 'Unknown',
  // },
  // {
  //   id: 117,
  //   name: 'Pacific Palisades NC',
  //   region: 'Unknown',
  // },
];
