import {
  emptyGeo,
  removeGeoHoles,
  makeGeoMask,
  boundingBox
} from './utils';

// adjust this to avoid overlapping the controls when zooming to a region
const FIT_BOUNDS_PADDING = {
  top: 65,
  bottom: 65,
  left: 350,
  right: 350
};

export default function BoundaryLayer({
  map,
  sourceId,
  sourceData,
  idProperty,
  onSelectRegion,
  onHoverRegion,
}) {

  //// GLOBALS ////

  let hoveredRegionId = null;
  let selectedRegionId = null;

  //// HELPERS ////

  const setHoveredRegion = region => {
    if (hoveredRegionId) {
      map.setFeatureState(
        { source: sourceId, id: hoveredRegionId },
        { hover: false }
      );
    }

    hoveredRegionId = region.id;

    map.setFeatureState(
      { source: sourceId, id: hoveredRegionId },
      { hover: true }
    );
  };

  const clearHoveredRegion = () => {
    if (hoveredRegionId) {
      map.setFeatureState(
        { source: sourceId, id: hoveredRegionId },
        { hover: false }
      );
      hoveredRegionId = null;
    }
  }

  const selectRegion = regionId => {
    if (!regionId || regionId === selectedRegionId)
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

    geo = removeGeoHoles(geo);

    // zoom to the region
    map.fitBounds(boundingBox(geo), { padding: FIT_BOUNDS_PADDING });

    // mask everything else
    map.getSource(`${sourceId}-region-mask`).setData(makeGeoMask(geo));

    // inform main
    onSelectRegion(geo);
  }

  //// SOURCES ////

  map.addSource(sourceId, {
    type: 'geojson',
    data: sourceData,
    promoteId: idProperty
  });

  map.addSource(`${sourceId}-region-mask`, {
    type: 'geojson',
    data: null,
  });

  //// LAYERS ////

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

  //// LISTENERS ////

  map.on('mousemove', `${sourceId}-fills`, e => {
    const region = e.features[0];
    if (!region || region.id === hoveredRegionId)
      return;

    setHoveredRegion(region);
    onHoverRegion(region);

    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', `${sourceId}-fills`, () => {
    clearHoveredRegion();
    onHoverRegion(null);
  });

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

        map.getSource(`${sourceId}-region-mask`).setData(emptyGeo());

        selectedRegionId = null;
      }
    }
  }
}
