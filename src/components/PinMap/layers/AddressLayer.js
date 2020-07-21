import React from 'react';
import PropTypes from 'prop-types';
import {
  emptyGeo,
  makeGeoCircle,
  makeGeoMask,
  boundingBox
} from '../utils';

const FIT_BOUNDS_PADDING = {
  top: 65,
  bottom: 65,
  left: 300,
  right: 300
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
      13, 0.2
    ] : [
      'interpolate',
      ['linear'],
      ['zoom'],
      10, 0,
      13, 0.5
    ];
}

class AddressLayer extends React.Component {
  init = ({ map, addListeners, onSelectRegion }) => {
    this.map = map;
    this.onSelectRegion = onSelectRegion;
    this.canvas = map.getCanvasContainer();

    this.addSources();
    this.addLayers();

    if (addListeners) {
      this.addListeners();
      this.center = null;
      this.offset = null;
      this.circle = null;
    }
  }

  componentDidUpdate(prev) {
    const { visible } = this.props;
    if (visible !== prev.visible)
      this.setVisibility(visible);
  }

  addSources = () => {
    this.map.addSource('shed', {
      type: 'geojson',
      data: this.circle || emptyGeo(),
    });

    this.map.addSource('shed-mask', {
      type: 'geojson',
      data: this.circle ? makeGeoMask(this.circle) : emptyGeo(),
    });
  };

  addLayers = () => {
    const { visible, boundaryStyle } = this.props;

    this.map.addLayer({
      id: 'shed-border',
      type: 'line',
      source: 'shed',
      layout: {
        visibility: visible ? 'visible' : 'none',
      },
      paint: {
        'line-width': 1.0,
        'line-color': getBoundaryColor(boundaryStyle),
      }
    });

    this.map.addLayer({
      id: 'shed-fill',
      type: 'fill',
      source: 'shed',
      layout: {
        visibility: visible ? 'visible' : 'none',
      },
      paint: {
        'fill-color': 'transparent',
      }
    });

    this.map.addLayer({
      id: 'shed-mask-fill',
      type: 'fill',
      source: 'shed-mask',
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
    const onMove = e => {
      this.setCenter({
        lng: e.lngLat.lng - this.offset.lng,
        lat: e.lngLat.lat - this.offset.lat
      });
      this.canvas.style.cursor = 'grabbing';
    };

    const onUp = e => {
      this.onSelectRegion({
        geo: this.circle,
        center: this.center
      });
      this.map.off('mousemove', onMove);
      this.map.off('touchmove', onMove);
      this.canvas.style.cursor = '';
    }

    this.map.on('mousedown', 'shed-fill', e => {
      e.preventDefault();
      this.offset = {
        lng: e.lngLat.lng - this.center.lng,
        lat: e.lngLat.lat - this.center.lat,
      };
      this.map.on('mousemove', onMove);
      this.map.once('mouseup', onUp);
      this.canvas.style.cursor = 'grab';
    });

    this.map.on('touchstart', 'shed-fill', e => {
      if (e.points.length !== 1) return;
      e.preventDefault();
      this.map.on('touchmove', onMove);
      this.map.once('touchend', onUp);
    });

    this.map.on('mouseenter', 'shed-fill', e => {
      this.canvas.style.cursor = 'move';
    });

    this.map.on('mouseleave', 'shed-fill', e => {
      this.canvas.style.cursor = '';
    });
  }

  setVisibility = visible => {
    const value = visible ? 'visible' : 'none';
    [
      'shed-border',
      'shed-fill',
      'shed-mask-fill',
    ].forEach(layerId => {
      this.map.setLayoutProperty(layerId, 'visibility', value);
    });
  };

  setCenter = lngLat => {
    if (lngLat) {
      this.center = lngLat;
      this.circle = makeGeoCircle(this.center);
      this.map.getSource('shed').setData(this.circle);
      this.map.getSource('shed-mask').setData(makeGeoMask(this.circle));
    } else {
      this.center = null;
      this.circle = null;
      this.map.getSource('shed').setData(emptyGeo());
      this.map.getSource('shed-mask').setData(emptyGeo());
    }
  };

  zoomTo = lngLat => {
    this.setCenter(lngLat);
    this.map.fitBounds(boundingBox(this.circle), { padding: FIT_BOUNDS_PADDING });
    this.map.once('zoomend', () => this.onSelectRegion({ geo: this.circle }));
  };

  setRadius = miles => {
    console.log('to be implemented');
  }

  render() {
    return null;
  }
}

export default AddressLayer;

AddressLayer.propTypes = {
  visible: PropTypes.bool,
};

AddressLayer.defaultProps = {
  visible: false,
};
