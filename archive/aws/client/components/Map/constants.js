/* eslint-disable */

import { boundingBox } from './geoUtils';
import { ncBoundaries } from './districts';

export const INITIAL_BOUNDS = boundingBox(ncBoundaries);

export const INITIAL_LOCATION = {
  location: 'All of Los Angeles',
};

export const GEO_FILTER_TYPES = {
  address: 'Address',
  nc: 'District',
};

export const MAP_STYLES = {
  dark: 'mapbox://styles/mapbox/dark-v10',
  light: 'mapbox://styles/mapbox/light-v10',
  streets: 'mapbox://styles/mapbox/streets-v11',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v11',
};
