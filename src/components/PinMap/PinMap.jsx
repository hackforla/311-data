import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Map,
  Marker,
  Popup,
  TileLayer,
  Rectangle,
  Tooltip,
} from 'react-leaflet';
import Choropleth from 'react-leaflet-choropleth';
import PropTypes from 'proptypes';

// import neighborhoodOverlay from '../../data/la-county-neighborhoods-v6.json';
// import municipalOverlay from '../../data/la-county-municipal-regions-current.json';
// import councilDistrictsOverlay from '../../data/la-city-council-districts-2012.json';
import ncOverlay from '../../data/nc-boundary-2019.json';

class PinMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      position: [34.0094213, -118.6008506],
      zoom: 10,
      mapUrl: `https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`,
      geoJSON: ncOverlay,
      bounds: null,
    };
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
    const { data, showMarkers } = this.props;

    if (showMarkers && data) {
      return data.map((d) => {
        if (d.latitude && d.longitude) {
          const position = [d.latitude, d.longitude];

          return (
            <Marker key={d.srnumber} position={position}>
              <Popup>
                Type:
                {d.requesttype}
                <br />
                Address:
                {d.address}
              </Popup>
            </Marker>
          );
        }

        return null;
      });
    }

    const tooltipPosition = [[34.0173157, -118.2497254], [34.1, -118.1497254]];

    return (
      <Rectangle bounds={tooltipPosition} color="black">
        <Tooltip
          permanent
          direction="top"
          offset={[0, 20]}
          opacity={1}
        >
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
      <div className="map-container">
        <Map
          center={position}
          zoom={zoom}
          bounds={bounds}
          style={{ height: '88.4vh' }}
        >
          <TileLayer
            url={mapUrl}
            attribution="MapBox"
          />
          {this.renderOverlay()}
          {this.renderMarkers()}
        </Map>
      </div>
    );
  }

  render() {
    return (
      this.renderMap()
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.data.data,
});

PinMap.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})),
  showMarkers: PropTypes.bool,
};

PinMap.defaultProps = {
  data: undefined,
  showMarkers: true,
};

export default connect(mapStateToProps, null)(PinMap);
