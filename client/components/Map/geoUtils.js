/* eslint-disable */

import {
  circle,
  mask,
  bbox,
  pointsWithinPolygon,
  booleanPointInPolygon,
} from '@turf/turf';

export function emptyGeo() {
  return {
    type: "FeatureCollection",
    features: [],
  }
}

// removes holes in a MultiPolygon
export function removeGeoHoles(feature) {
  if (feature.geometry.type === 'MultiPolygon')
    return {
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates: feature.geometry.coordinates.map(poly => [poly[0]])
      }
    };
  else
    return feature;
}

export function makeGeoCircle(center, radius=1, opts={ units: 'miles' }) {
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
