
import geojsonExtent from '@mapbox/geojson-extent';

export default function BoundaryLayer({ map, sourceId, sourceData, idProperty, onSelectRegion }) {
  let hoveredRegionId = null;

  map.addSource(sourceId, {
    type: 'geojson',
    data: sourceData,
    promoteId: idProperty
  });

  map.addLayer({
    id: `${sourceId}-borders`,
    source: sourceId,
    type: 'line',
    layout: {
      visibility: 'none'
    },
    paint: {
      'line-color': '#FFFFFF',
      'line-width': 2.0
    }
  });

  map.addLayer({
    id: `${sourceId}-fills`,
    source: sourceId,
    type: 'fill',
    layout: {
      visibility: 'none'
    },
    paint: {
      'fill-color': '#627BC1',
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.5,
        0
      ]
    }
  });

  map.on('mousemove', `${sourceId}-fills`, e => {
    if (map.loaded()) {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [`${sourceId}-fills`]
      });

      map.getCanvas().style.cursor = features.length ? 'pointer' : '';

      if (features.length) {
        const { id } = features[0];
        if (id === hoveredRegionId)
          return;

        if (hoveredRegionId) {
          map.setFeatureState(
            { source: sourceId, id: hoveredRegionId },
            { hover: false }
          );
        }
        map.setFeatureState(
          { source: sourceId, id },
          { hover: true }
        );

        hoveredRegionId = id;
      }
    }
  });

  map.on('mouseleave', `${sourceId}-fills`, () => {
    if (hoveredRegionId) {
      map.setFeatureState(
        { source: sourceId, id: hoveredRegionId },
        { hover: false }
      );
      hoveredRegionId = null;
    }
  });

  map.on('click', `${sourceId}-fills`, e => {
    const { id } = map.queryRenderedFeatures(e.point, {
      layers: [`${sourceId}-fills`]
    })[0];

    zoomToRegion(id);
  });

  const zoomToRegion = regionId => {
    // notice double-equals because id is a number when it comes from CONSTANTS,
    // but a string in the geojson
    const geo = sourceData.features.find(el => el.properties[idProperty] == regionId);

    map.fitBounds(geojsonExtent(geo), { padding: 50 });
    map.once('zoomend', e => onSelectRegion(geo));
  }

  return {
    show: () => {
      map.setLayoutProperty(`${sourceId}-borders`, 'visibility', 'visible');
      map.setLayoutProperty(`${sourceId}-fills`, 'visibility', 'visible');
    },
    hide: () => {
      map.setLayoutProperty(`${sourceId}-borders`, 'visibility', 'none');
      map.setLayoutProperty(`${sourceId}-fills`, 'visibility', 'none');
    },
    zoomToRegion: regionId => zoomToRegion(regionId)
  }
}
