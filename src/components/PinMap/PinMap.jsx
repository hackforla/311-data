import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { mapAccessToken } from '../../config.js';

class PinMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: [34.0173157, -118.2497254],
      zoom: 10,
      mapUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    }
  }

  renderMap = () => {
    const { position, zoom, mapUrl } = this.state;

    return (
      <Map center={position} zoom={zoom}>
        <TileLayer
          url={mapUrl}
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        <Marker position={position}>
          <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
        </Marker>
      </Map>
    )
  }

  render() {
    return (
      <div>{this.renderMap()}</div>
    )
  }
}

export default PinMap;
