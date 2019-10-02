import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { mapAccessToken } from '../../config.js';

const serviceRequests = [
  'Bulky Items',
  'Dead Animal Removal',
  'Electronic Waste',
  'Graffiti Removal',
  'Homeless Encampment',
  'Illegal Dumping Pickup',
  'Metal/Household Appliances',
  'Single Streetlight Issue',
  'Multiple Streetlight Issue',
  'Report Water Waste',
  'Other',
];

const years = [
  '2015',
  '2016',
  '2017',
  '2018',
  '2019',
];

class PinMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      position: [34.0173157, -118.2497254],
      zoom: 10,
      mapUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    }
  }

  onDropdownChange = () => {

  }

  renderMap = () => {
    const { position, zoom, mapUrl } = this.state;

    return (
      <div className="pinmap-container">
        <div className="map-container">
          <Map center={position} zoom={zoom}>
            <TileLayer
              url={mapUrl}
              attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            <Marker position={position}>
              <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
            </Marker>
          </Map>
        </div>
        <div className="dropdown-container">
          Year
          &nbsp;
          <select class="year-dropdown">
            {years.map(year => (<option value={year}>{year}</option>))}
          </select>
          <br/>
          Service Request
          &nbsp;
          <select class="request-dropdown">
            {serviceRequests.map(service => (<option value={service}>{service}</option>))}
          </select>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>{this.renderMap()}</div>
    )
  }
}

export default PinMap;
