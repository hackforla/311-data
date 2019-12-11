import React, { Component } from 'react';
import axios from 'axios';
import {
  Map, Marker, Popup, TileLayer, Rectangle, Tooltip,
} from 'react-leaflet';
import Choropleth from 'react-leaflet-choropleth';

import constants from '../common/CONSTANTS';
import { getDataResources } from '../../Util/DataService';

// import neighborhoodOverlay from '../../data/la-county-neighborhoods-v6.json';
// import municipalOverlay from '../../data/la-county-municipal-regions-current.json';
// import councilDistrictsOverlay from '../../data/la-city-council-districts-2012.json';
import ncOverlay from '../../data/nc-boundary-2019.json';


class PinMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      year: '2015',
      startMonth: '1',
      endMonth: '12',
      request: constants.REQUESTS[0],
      position: [34.0173157, -118.2497254],
      zoom: 10,
      mapUrl: `https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`,
      // dataUrl: 'https://data.lacity.org/resource/h65r-yf5i.json?$select=location,zipcode,address,requesttype,status,ncname,streetname,housenumber&$where=date_extract_m(CreatedDate)+between+2+and+3',
      geoJSON: ncOverlay,
      showMarkers: false,
      bounds: null,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  onDatePickerChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    }, () => {
      this.fetchData();
    });
  }

  toggleShowMarkers = () => {
    const { showMarkers } = this.state;
    this.setState({ showMarkers: !showMarkers });
  }

  highlightRegion = (e) => {
    const layer = e.target;

    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7,
    });

    layer.bringToFront();
  }

  resetRegionHighlight = (e) => {
    const layer = e.target;

    layer.setStyle({
      fillColor: '#bcbddc',
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
    });
  }

  zoomToRegion = (e) => {
    const bounds = e.target.getBounds();
    this.setState({ bounds });
  }

  onEachFeature = (feature, layer) => {
    // Popup text when clicking on a region
    const popupText = `
      <div class="overlay_feature_popup">
        ${feature.properties.name}
        <br />
        ${feature.properties.service_re}
      </div>
    `;
    layer.bindPopup(popupText);

    // Sets mouseover/out/click event handlers for each region
    layer.on({
      mouseover: this.highlightRegion,
      mouseout: this.resetRegionHighlight,
      click: this.zoomToRegion,
    });
  }

  buildDataUrl = () => {
    const {
      startMonth, endMonth, year, request,
    } = this.state;
    const dataResources = getDataResources();
    return `https://data.lacity.org/resource/${dataResources[year]}.json?$select=location,zipcode,address,requesttype,status,ncname,streetname,housenumber&$where=date_extract_m(CreatedDate)+between+${startMonth}+and+${endMonth}+and+requesttype='${request}'`;
  }

  fetchData = () => {
    const dataUrl = this.buildDataUrl();

    axios.get(dataUrl)
      .then(({ data }) => {
        this.setState({ data });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  renderOverlay = () => {
    const { geoJSON } = this.state;

    if (geoJSON) {
      return (
        <Choropleth
          data={geoJSON}
          style={{
            fillColor: '#bcbddc',
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7,
          }}
          onEachFeature={this.onEachFeature}
          ref={(el) => {
            if (el) {
              this.choropleth = el.leafletElement;
              return this.choropleth;
            }

            return null;
          }}
        />
      );
    }

    return 'Loading';
  }

  renderMarkers = () => {
    const { data, showMarkers } = this.state;

    if (showMarkers && data && data.length > 0) {
      return data.map((d) => {
        const { location } = d;
        let position = [0, 0];

        if (location) {
          position = [location.latitude, location.longitude];
        }

        return (
          <Marker key={d.location.toString()} position={position}>
            <Popup>
              Type:
              {d.requesttype}
              <br />
              Address:
              {d.address}
            </Popup>
          </Marker>
        );
      });
    }

    const tooltipPosition = [[34.0173157, -118.2497254], [34.1, -118.1497254]];

    return (
      <Rectangle bounds={tooltipPosition} color="black">
        <Tooltip direction="top" offset={[0, 20]} opacity={1} permanent>
          No Data To Display
        </Tooltip>
      </Rectangle>
    );
  }

  renderMap = () => {
    const {
      position,
      zoom,
      mapUrl,
      bounds,
    } = this.state;

    return (
      <>
        <div className="map-container">
          <Map
            center={position}
            zoom={zoom}
            bounds={bounds}
            style={{ height: '60vh' }}
          >
            <TileLayer
              url={mapUrl}
              attribution="MapBox"
            />
            {this.renderOverlay()}
            {this.renderMarkers()}
          </Map>
        </div>

      </>
    );
  }

  render() {
    return (
      <div className="column">
        <div className="pinmap">
          {this.renderMap()}
        </div>
      </div>
    );
  }
}

export default PinMap;
