import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { mapToken } from '../../config.js';
import { getDataResources } from '../../Util/DataService.js';
import axios from 'axios';

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

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

class PinMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      year: '2017',
      request: 'Bulky Items',
      position: [34.0173157, -118.2497254],
      zoom: 10,
      mapUrl: `https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=${mapToken}`,
      dataUrl: 'https://data.lacity.org/resource/h65r-yf5i.json?$select=location,zipcode,address,requesttype,status,ncname,streetname,housenumber&$where=date_extract_m(CreatedDate)+between+2+and+3'
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  onDropdownChange = e => {
    this.setState({
      [e.target.id]: e.target.value,
    })

    this.fetchData();
  }

  buildDataUrl = () => {
    const { year, request } = this.state;
    const dataResources = getDataResources();
    return `https://data.lacity.org/resource/${dataResources[year]}.json?$select=location,zipcode,address,requesttype,status,ncname,streetname,housenumber&$where=date_extract_m(CreatedDate)+between+2+and+3+and+requesttype='${request}'`
  }

  fetchData = () => {
    const dataUrl = this.buildDataUrl();

    axios.get(dataUrl)
      .then(res => {
        this.setState({ data: res.data })
      })
      .catch(error => {
        console.error(error);
      });
  }

  renderMarkers = () => {
    const { data } = this.state;

    return data.map((d, idx) => {
      const { location } = d;
      let position = [0, 0];

      if (location) {
        position = [location.latitude, location.longitude];
      }

      return (
        <Marker key={idx} position={position}>
          <Popup>
            Type:
            {d.requesttype}
            <br />
            Address:
            {d.address}
          </Popup>
        </Marker>
      )
    })
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
            {this.renderMarkers()}
          </Map>
        </div>
        <div className="dropdown-container">
          Year
          &nbsp;
          <select id="year" className="dropdown" onChange={this.onDropdownChange}>
            {years.map(year => (<option key={year} value={year}>{year}</option>))}
          </select>
          <br/>
          Service Request
          &nbsp;
          <select id="request" className="dropdown" onChange={this.onDropdownChange}>
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
