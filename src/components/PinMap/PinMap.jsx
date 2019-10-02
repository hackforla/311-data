import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { mapToken } from '../../config.js';

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
      mapUrl: `https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=${mapToken}`,
    }
  }

  onDropdownChange = () => {

  }

  renderMap = () => {
    const { position, zoom, mapUrl } = this.state;

    return (
      <div className="pinmap-container">
        <div className="map-container">
          <Map
            center={position}
            zoom={zoom}
            style={{ height: '70vh' }}>
            <TileLayer
              url={mapUrl}
              attribution="Hack4LA"
            />
            <Marker position={position}>
              <Popup>
                A pretty CSS3 popup.
                <br />
                Easily customizable.
              </Popup>
            </Marker>
          </Map>
        </div>
        <div className="dropdown-container">
          Year
          &nbsp;
          <select className="year-dropdown">
            {years.map(year => (<option key={year} value={year}>{year}</option>))}
          </select>
          <br/>
          Service Request
          &nbsp;
          <select className="request-dropdown">
            {serviceRequests.map(service => (<option key={service} value={service}>{service}</option>))}
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
