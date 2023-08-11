/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import homeSVG from '@assets/home-15.svg';
import {
  emptyGeo,
  makeGeoCircle,
  makeGeoMask,
  boundingBox,
} from '../geoUtils';

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
    this.geojson = {
      "type": "FeatureCollection",
      "features": [],
    };
    this.addImages();
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

  addImages = () => {
    let img = new Image(30, 30);
    img.onload = () => this.map.addImage('home-icon', img);
    img.src = homeSVG;
  }

  addSources = () => {
    this.map.addSource('point', {
      "type": "geojson",
      "data": this.geojson
    });
  };

  addLayers = () => {
    this.map.addLayer({
      id: 'point',
      type: 'symbol',
      source: 'point',
      layout: {
        'icon-image': 'home-icon',
      },
    })
  };

  addListeners = () => {
    // const onMove = e => {
    //   this.setCenter({
    //     lng: e.lngLat.lng - this.offset.lng,
    //     lat: e.lngLat.lat - this.offset.lat
    //   });
    //   this.canvas.style.cursor = 'grabbing';
    // };

    // const onUp = e => {
    //   this.onSelectRegion({
    //     geo: this.circle,
    //     center: this.center
    //   });
    //   this.map.off('mousemove', onMove);
    //   this.map.off('touchmove', onMove);
    //   this.canvas.style.cursor = '';
    // }

    // this.map.on('mousedown', 'shed-fill', e => {
    //   e.preventDefault();
    //   this.offset = {
    //     lng: e.lngLat.lng - this.center.lng,
    //     lat: e.lngLat.lat - this.center.lat,
    //   };
    //   this.map.on('mousemove', onMove);
    //   this.map.once('mouseup', onUp);
    //   this.canvas.style.cursor = 'grab';
    // });

    // this.map.on('touchstart', 'shed-fill', e => {
    //   if (e.points.length !== 1) return;
    //   e.preventDefault();
    //   this.map.on('touchmove', onMove);
    //   this.map.once('touchend', onUp);
    // });

    // this.map.on('mouseenter', 'shed-fill', e => {
    //   this.canvas.style.cursor = 'move';
    // });

    // this.map.on('mouseleave', 'shed-fill', e => {
    //   this.canvas.style.cursor = '';
    // });
  }

  // setVisibility = visible => {
  //   const value = visible ? 'visible' : 'none';
  //   [
  //     'shed-border',
  //     'shed-fill',
  //     'shed-mask-fill',
  //   ].forEach(layerId => {
  //     this.map.setLayoutProperty(layerId, 'visibility', value);
  //   });
  // };

  // setCenter = lngLat => {
  //   if (lngLat) {
  //     this.center = lngLat;
  //     this.circle = makeGeoCircle(this.center);
  //     this.map.getSource('shed').setData(this.circle);
  //     this.map.getSource('shed-mask').setData(makeGeoMask(this.circle));
  //   } else {
  //     this.center = null;
  //     this.circle = null;
  //     this.map.getSource('shed').setData(emptyGeo());
  //     this.map.getSource('shed-mask').setData(emptyGeo());
  //   }
  // };

  // zoomTo = lngLat => {
  //   this.setCenter(lngLat);
  //   this.map.fitBounds(boundingBox(this.circle), { padding: FIT_BOUNDS_PADDING });
  //   this.map.once('zoomend', () => this.onSelectRegion({ geo: this.circle }));
  // };

  addMarker = lngLat => {
    this.geojson.features[0] = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: lngLat,
      }
    }
    this.map.getSource('point').setData(this.geojson)
  }

  clearMarker = () => {
    this.geojson.features = [];
    this.map.getSource('point').setData(this.geojson);
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
