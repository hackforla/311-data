/* eslint-disable */

import { COUNCILS, CITY_COUNCILS } from '@components/common/CONSTANTS';
import ncGeoJson from '../../v1/data/nc-boundary-2019-modified.json';
import ccGeoJson from '../../v1/data/la-city-council-districts-2012.json';
import { isPointWithinGeo } from './geoUtils';

export const ncBoundaries = ncGeoJson;
export const ccBoundaries = ccGeoJson;

export function ncNameFromId(ncId) {
  return COUNCILS.find(c => c.id == ncId)?.name;
}

export function ccNameFromId(ccId) {
  return CITY_COUNCILS.find(c => c.id == ccId)?.name;
}

export function ncInfoFromLngLat({ lng, lat }) {
  for (let i = 0; i < ncBoundaries.features.length; i++) {
    const feature = ncBoundaries.features[i];
    if (isPointWithinGeo([lng, lat], feature))
      return {
        name: ncNameFromId(feature.properties.nc_id),
        url: feature.properties.waddress || feature.properties.dwebsite,
      };
  }
  return null;
}

export function ccNameFromLngLat({ lng, lat }) {
  for (let i = 0; i < ccBoundaries.features.length; i++)
    if (isPointWithinGeo([lng, lat], ccBoundaries.features[i]))
      return ccNameFromId(ccBoundaries.features[i].properties.name);
  return null;
}
