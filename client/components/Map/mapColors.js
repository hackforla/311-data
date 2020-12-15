/* eslint-disable */

import { REQUEST_TYPES } from '@components/common/CONSTANTS';

// carto schemes from: https://carto.com/carto-colors/

const COLOR_SCHEMES = {
  original: Object.keys(REQUEST_TYPES).map(type => REQUEST_TYPES[type].color),

  // carto prism
  prism: [
    '#5F4690',
    '#1D6996',
    '#38A6A5',
    '#0F8554',
    '#73AF48',
    '#EDAD08',
    '#E17C05',
    '#CC503E',
    '#94346E',
    '#6F4070',
    '#994E95',
    // '#666666'
  ],

  // carto vivid
  vivid: [
    '#E58606',
    '#5D69B1',
    '#52BCA3',
    '#99C945',
    '#CC61B0',
    '#24796C',
    '#DAA51B',
    '#2F8AC4',
    '#764E9F',
    '#ED645A',
    '#CC3A8E',
    '#A5AA99'
  ],

  // carto bold
  bold: [
    '#7F3C8D',
    '#11A579',
    '#3969AC',
    '#F2B701',
    '#E73F74',
    '#80BA5A',
    '#E68310',
    '#008695',
    '#CF1C90',
    '#f97b72',
    '#4b4b8f',
    '#A5AA99'
  ],

  // carto pastel
  pastel: [
    '#66C5CC',
    '#F6CF71',
    '#F89C74',
    '#DCB0F2',
    '#87C55F',
    '#9EB9F3',
    '#FE88B1',
    '#C9DB74',
    '#8BE0A4',
    '#B497E7',
    '#D3B484',
    '#B3B3B3'
  ],

  club: Array.from({ length: 11 }).map((_, index) => {
    const hue = 170 + Math.round(190 * index / 11);
    return `hsl(${hue}, 100%, 50%)`;
  }),

  mono: [
    '#FFFFFF'
  ],
}

export const COLOR_SCHEME_NAMES = Object.keys(COLOR_SCHEMES);

export function getColors(scheme) {
  const offset = scheme === 'prism' ? 2 : 0;
  const colors = COLOR_SCHEMES[scheme];
  return Object.keys(REQUEST_TYPES).reduce((out, type, idx) => {
    out[type] = colors[(idx + offset) % colors.length];
    return out;
  }, {});
}
