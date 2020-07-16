import { mask as turfMask, bbox as boundingBox } from '@turf/turf';

// adjust this to avoid overlapping the controls when zooming to a region
const FIT_BOUNDS_PADDING = {
  top: 65,
  bottom: 65,
  left: 350,
  right: 350
};

function removeHoles(feature) {
  return {
    ...feature,
    geometry: {
      ...feature.geometry,
      coordinates: feature.geometry.coordinates.map(poly => [poly[0]])
    }
  };
}

export default function BoundaryLayer({
  map,
  sourceId,
  sourceData,
  idProperty,
  onSelectRegion,
  onHoverRegion,
}) {

  let hoveredRegionId = null;
  let selectedRegionId = null;

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
      'fill-color': '#FFFFFF',
      'fill-opacity': [
        'case',
        ['all',
          ['boolean', ['feature-state', 'hover'], false],
          ['!', ['boolean', ['feature-state', 'selected'], false]]
        ],
        0.5,
        0
      ]
    }
  });

  map.addSource(`${sourceId}-region-mask`, {
    type: 'geojson',
    data: null,
  });

  map.addLayer({
    id: `${sourceId}-region-mask-fill`,
    source: `${sourceId}-region-mask`,
    type: 'fill',
    layout: {
      visibility: 'visible'
    },
    paint: {
      'fill-color': '#FFFFFF',
      'fill-opacity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        10, 0,
        13, 0.3
      ],
    }
  });

  map.on('mousemove', `${sourceId}-fills`, e => {
    if (map.loaded()) {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [`${sourceId}-fills`]
      });

      if (features.length) {
        const { id } = features[0];
        if (id === hoveredRegionId)
          return;

        onHoverRegion(features[0]);

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

        map.getCanvas().style.cursor = features.length ? 'pointer' : '';
      }
    }
  });

  map.on('mouseleave', `${sourceId}-fills`, () => {
    onHoverRegion(null);

    if (hoveredRegionId) {
      map.setFeatureState(
        { source: sourceId, id: hoveredRegionId },
        { hover: false }
      );
      hoveredRegionId = null;
    }
  });

  map.on('click', `${sourceId}-fills`, e => {
    const region = map.queryRenderedFeatures(e.point, {
      layers: [`${sourceId}-fills`]
    })[0];

    // timeout because when you click on a point and the region isn't
    // yet selected, we don't want the point-click, which runs after
    // this handler, to think that the region is already selected
    setTimeout(() => {
      selectRegion(region.id);
    }, 0);
  });

  const selectRegion = regionId => {
    if (regionId === selectedRegionId)
      return;

    if (selectedRegionId)
      map.setFeatureState(
        { source: sourceId, id: selectedRegionId },
        { selected: false }
      );

    selectedRegionId = regionId;

    map.setFeatureState(
      { source: sourceId, id: selectedRegionId },
      { selected: true }
    );

    map.setPaintProperty(`${sourceId}-borders`, 'line-width', [
      'case',
      ['boolean', ['feature-state', 'selected'], false],
      2,
      0
    ]);

    // get the region geo
    // notice double-equals because id is a number when it comes from CONSTANTS,
    // but a string in the geojson
    let geo = sourceData.features.find(el => el.properties[idProperty] == selectedRegionId);

    geo = removeHoles(geo);

    // zoom to the region
    map.fitBounds(boundingBox(geo), { padding: FIT_BOUNDS_PADDING });

    // mask everything else
    map.getSource(`${sourceId}-region-mask`).setData(turfMask(geo));

    // inform main
    onSelectRegion(geo);
  }

  return {
    show: () => {
      map.setLayoutProperty(`${sourceId}-borders`, 'visibility', 'visible');
      map.setLayoutProperty(`${sourceId}-fills`, 'visibility', 'visible');
      map.setLayoutProperty(`${sourceId}-region-mask-fill`, 'visibility', 'visible');
    },

    hide: () => {
      map.setLayoutProperty(`${sourceId}-borders`, 'visibility', 'none');
      map.setLayoutProperty(`${sourceId}-fills`, 'visibility', 'none');
      map.setLayoutProperty(`${sourceId}-region-mask-fill`, 'visibility', 'none');
    },

    selectRegion: regionId => selectRegion(regionId),

    deselectAll: () => {
      if (selectedRegionId) {
        map.setFeatureState(
          { source: sourceId, id: selectedRegionId },
          { selected: false }
        );

        setTimeout(() => {
          map.setPaintProperty(`${sourceId}-borders`, 'line-width', 2);
        });

        map.getSource(`${sourceId}-region-mask`).setData({
          type: "FeatureCollection",
          features: []
        });

        selectedRegionId = null;
      }
    }
  }
}
