/* eslint-disable */

import {
  circle,
  mask,
  bbox,
  point,
  polygon,
  pointsWithinPolygon,
  booleanPointInPolygon,
  multiPolygon,
} from '@turf/turf';

import ncGeojson from '@data/ncGeojson';

import { isEmpty } from '@utils';

export function emptyGeo() {
  return {
    type: 'FeatureCollection',
    features: [],
  };
}

// removes holes in a MultiPolygon
export function removeGeoHoles(feature) {
  if (feature.geometry.type === 'MultiPolygon')
    return {
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates: feature.geometry.coordinates.map((poly) => [poly[0]]),
      },
    };
  else return feature;
}

export function makeGeoCircle(center, radius = 1, opts = { units: 'miles' }) {
  return circle([center.lng, center.lat], radius, opts);
}

export function makeGeoMask(poly) {
  return mask(poly);
}

export function boundingBox(geo) {
  return bbox(geo);
}

export function pointsWithinGeo(points, geo) {
  return pointsWithinPolygon(points, geo);
}

export function isPointWithinGeo(point, geo) {
  return booleanPointInPolygon(point, geo);
}

export function getNcByLngLatv2({
  longitude = undefined,
  latitude = undefined,
}) {
  try {
    if (isEmpty(longitude) || isEmpty(latitude)) {
      throw new Error(
        `longitude: ${longitude} and latitude: ${latitude} must be defined`
      );
    }
    console.log({ longitude, latitude });
    const features = ncGeojson.features;
    console.log({ features });

    let foundNcGeoObj;

    for (const feature of features) {
      let featurePolygon;
      if (feature.geometry.type == 'MultiPolygon')
        featurePolygon = multiPolygon(feature.geometry.coordinates);
      else {
        featurePolygon = polygon(feature.geometry.coordinates);
      }

      if (booleanPointInPolygon(point([longitude, latitude]), featurePolygon)) {
        foundNcGeoObj = feature
      }
    }
    console.log({ foundNcGeoObj });

    return foundNcGeoObj?.properties?.NC_ID;
  } catch (e) {
    console.error('In getNcByLngLatv2: Error occured: ', e);
  }
}
