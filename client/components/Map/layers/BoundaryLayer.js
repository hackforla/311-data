/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import {
  emptyGeo,
  removeGeoHoles,
  makeGeoMask,
  boundingBox,
} from '../geoUtils';

const BOUNDARY_WIDTH = 2;

// adjust this to avoid overlapping the controls when zooming to a region
const FIT_BOUNDS_PADDING = {
  top: 65,
  bottom: 65,
  left: 350,
  right: 350
};

function getBoundaryColor(boundaryStyle) {
  return boundaryStyle === 'light'
    ? '#FFFFFF'
    : '#27272b';
}

function getMaskFillOpacity(boundaryStyle) {
  return boundaryStyle === 'light'
    ? [
      'interpolate',
      ['linear'],
      ['zoom'],
      10, 0,
      13, 0.3
    ] : [
      'interpolate',
      ['linear'],
      ['zoom'],
      10, 0,
      13, 0.6
    ];
}

class BoundaryLayer extends React.Component {
  init = ({
    map,
    sourceId,
    sourceData,
    idProperty,
    onSelectRegion,
    onHoverRegion,
    addListeners,
  }) => {
    this.map = map;
    this.sourceId = sourceId;
    this.sourceData = sourceData;
    this.idProperty = idProperty;
    this.onSelectRegion = onSelectRegion;
    this.onHoverRegion = onHoverRegion;

    this.hoveredRegionId = null;
    this.selectedRegionId = null;

    this.addSources();
    this.addLayers();
    if (addListeners)
      this.addListeners();
  };

  componentDidUpdate(prev) {
    const { visible } = this.props;
    if (visible !== prev.visible)
      this.setVisibility(visible);
  }

  addSources = () => {
    this.map.addSource(this.sourceId, {
      type: 'geojson',
      data: this.sourceData,
      promoteId: this.idProperty
    });

    this.map.addSource(`${this.sourceId}-region-mask`, {
      type: 'geojson',
      data: null,
    });
  };

  addLayers = () => {
    const { visible, boundaryStyle } = this.props;

    this.map.addLayer({
      id: `${this.sourceId}-borders`,
      source: this.sourceId,
      type: 'line',
      layout: {
        visibility: visible ? 'visible' : 'none',
      },
      paint: {
        'line-color': getBoundaryColor(boundaryStyle),
        'line-width': BOUNDARY_WIDTH,
      }
    });

    this.map.addLayer({
      id: `${this.sourceId}-fills`,
      source: this.sourceId,
      type: 'fill',
      layout: {
        visibility: visible ? 'visible' : 'none',
      },
      paint: {
        'fill-color': getBoundaryColor(boundaryStyle),
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

    this.map.addLayer({
      id: `${this.sourceId}-region-mask-fill`,
      source: `${this.sourceId}-region-mask`,
      type: 'fill',
      layout: {
        visibility: visible ? 'visible' : 'none',
      },
      paint: {
        'fill-color': getBoundaryColor(boundaryStyle),
        'fill-opacity': getMaskFillOpacity(boundaryStyle),
      }
    });
  };

  addListeners = () => {
    this.map.on('mousemove', `${this.sourceId}-fills`, e => {
      const region = e.features[0];
      if (!region || region.id === this.hoveredRegionId)
        return;

      this.setHoveredRegion(region);
      this.onHoverRegion(region);

      this.map.getCanvas().style.cursor = 'pointer';
    });

    this.map.on('mouseleave', `${this.sourceId}-fills`, () => {
      this.clearHoveredRegion();
      this.onHoverRegion(null);
    });
  };

  setHoveredRegion = region => {
    if (this.hoveredRegionId) {
      this.map.setFeatureState(
        { source: this.sourceId, id: this.hoveredRegionId },
        { hover: false }
      );
    }

    this.hoveredRegionId = region.id;

    this.map.setFeatureState(
      { source: this.sourceId, id: this.hoveredRegionId },
      { hover: true }
    );
  };

  clearHoveredRegion = () => {
    if (this.hoveredRegionId) {
      this.map.setFeatureState(
        { source: this.sourceId, id: this.hoveredRegionId },
        { hover: false }
      );
      this.hoveredRegionId = null;
    }
  }

  selectRegion = regionId => {
    if (!regionId || regionId === this.selectedRegionId)
      return;

    if (this.selectedRegionId)
      this.map.setFeatureState(
        { source: this.sourceId, id: this.selectedRegionId },
        { selected: false }
      );

    this.selectedRegionId = regionId;

    this.map.setFeatureState(
      { source: this.sourceId, id: this.selectedRegionId },
      { selected: true }
    );

    this.map.setPaintProperty(`${this.sourceId}-borders`, 'line-width', [
      'case',
      ['boolean', ['feature-state', 'selected'], false],
      BOUNDARY_WIDTH,
      0
    ]);

    // get the region geo
    // notice double-equals because id is a number when it comes from CONSTANTS,
    // but a string in the geojson
    let geo = this.sourceData.features.find(el => (
      el.properties[this.idProperty] == this.selectedRegionId
    ));

    geo = removeGeoHoles(geo);

    // zoom to the region
    this.map.fitBounds(boundingBox(geo), { padding: FIT_BOUNDS_PADDING });

    // mask everything else
    this.map
      .getSource(`${this.sourceId}-region-mask`)
      .setData(makeGeoMask(geo));

    // inform main
    this.onSelectRegion(geo);
  }

  clearSelectedRegion = () => {
    if (!this.selectedRegionId)
      return;

    this.map.setFeatureState(
      { source: this.sourceId, id: this.selectedRegionId },
      { selected: false }
    );

    setTimeout(() => {
      this.map.setPaintProperty(
        `${this.sourceId}-borders`,
        'line-width',
        BOUNDARY_WIDTH,
      );
    });

    this.map.getSource(`${this.sourceId}-region-mask`).setData(emptyGeo());

    this.selectedRegionId = null;
  }

  setVisibility = visible => {
    const value = visible ? 'visible' : 'none';
    [
      `${this.sourceId}-borders`,
      `${this.sourceId}-fills`,
      `${this.sourceId}-region-mask-fill`,
    ].forEach(layerId => {
      this.map.setLayoutProperty(layerId, 'visibility', value);
    });
  };

  render() {
    return null;
  }
}

export default BoundaryLayer;

BoundaryLayer.propTypes = {
  visible: PropTypes.bool,
  boundaryStyle: PropTypes.oneOf(['light', 'dark']),
};

BoundaryLayer.defaultProps = {
  visible: false,
  boundaryStyle: 'light',
};
