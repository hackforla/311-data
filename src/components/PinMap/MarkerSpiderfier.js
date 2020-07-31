import React from 'react';
import { withLeaflet, MapLayer } from 'react-leaflet';
import { layerGroup, Marker } from 'leaflet';
import 'overlapping-marker-spiderfier-leaflet/dist/oms';

class MarkerSpiderfier extends MapLayer {
  createLeafletElement({ leaflet }) {
    const { map } = leaflet;
    this.spiderfier = this.createOverlappingMarkerSpiderfier(map);
    const el = layerGroup();
    this.contextValue = { ...leaflet, layerContainer: el };
    return el;
  }

  componentDidMount() {
    super.componentDidMount();
    this.leafletElement.eachLayer(layer => {
      if (layer instanceof Marker) {
        this.spiderfier.addMarker(layer);
      }
    });
  }

  componentDidUpdate() {
    this.leafletElement.eachLayer(layer => {
      if (layer instanceof Marker) {
        this.spiderfier.addMarker(layer);
      }
    });
  }

  createOverlappingMarkerSpiderfier(map) {
    const spiderfier = new window.OverlappingMarkerSpiderfier(map);
    spiderfier.addListener('spiderfy', markers => {
      markers.forEach(m => m.closePopup());
      if (this.props.onSpiderfy) {
        this.props.onSpiderfy(markers);
      }
    });
    spiderfier.addListener('unspiderfy', markers => {
      if (this.props.onUnspiderfy) {
        this.props.onUnspiderfy(markers);
      }
    });
    spiderfier.addListener('click', marker => {
      if (this.props.onClick) {
        this.props.onClick(marker);
      }
    });
    return spiderfier;
  }
}

export default withLeaflet(MarkerSpiderfier);
