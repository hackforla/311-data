import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Map,
  Marker,
  Popup,
  TileLayer,
  Rectangle,
  Tooltip,
  LayersControl,
  ZoomControl,
} from 'react-leaflet';
import Choropleth from 'react-leaflet-choropleth';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import HeatmapLayer from 'react-leaflet-heatmap-layer';
import PropTypes from 'proptypes';
import COLORS from '@styles/COLORS';
import MapExportButton from '@components/export/MapExportButton';

// import neighborhoodOverlay from '../../data/la-county-neighborhoods-v6.json';
// import municipalOverlay from '../../data/la-county-municipal-regions-current.json';
// import councilDistrictsOverlay from '../../data/la-city-council-districts-2012.json';
import ncOverlay from '../../data/nc-boundary-2019.json';

const { BaseLayer, Overlay } = LayersControl;
const boundaryDefaultColor = COLORS.BRAND.MAIN;
const boundaryHighlightColor = COLORS.BRAND.CTA1;

class PinMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: [34.0094213, -118.6008506],
      zoom: 10,
      mapUrl: `https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`,
      satelliteUrl: `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`,
      geoJSON: ncOverlay,
      bounds: null,
    };
    this.mapRef = React.createRef();
  }

  highlightRegion = e => {
    const layer = e.target;

    layer.setStyle({
      weight: 5,
      color: boundaryHighlightColor,
    });

    layer.bringToFront();
  }

  resetRegionHighlight = e => {
    const layer = e.target;

    layer.setStyle({
      weight: 2,
      opacity: 1,
      color: boundaryDefaultColor,
    });
  }

  zoomToRegion = e => {
    const bounds = e.target.getBounds();
    this.setState({ bounds });
  }

  onEachRegionFeature = (feature, layer) => {
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

  renderMarkers = () => {
    const { data, showMarkers } = this.props;

    if (showMarkers && data) {
      return data.map(d => {
        if (d.latitude && d.longitude) {
          const position = [d.latitude, d.longitude];

          return (
            <Marker key={d.srnumber} position={position}>
              {/* Fetching request details on marker click will be implemented in another PR */}
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
      satelliteUrl,
      bounds,
      geoJSON,
    } = this.state;

    const { data } = this.props;

    return (
      <div className="map-container">
        <Map
          ref={this.mapRef}
          center={position}
          zoom={zoom}
          maxZoom={18}
          bounds={bounds}
          style={{ height: '88.4vh' }}
          zoomControl={false}
          preferCanvas // gets you the council boundaries when exporting
        >
          <ZoomControl position="topright" />
          <LayersControl
            position="bottomright"
            collapsed={false}
          >
            <BaseLayer checked name="Streets">
              <TileLayer
                url={mapUrl}
                attribution="MapBox"
              />
            </BaseLayer>
            <BaseLayer name="Satellite">
              <TileLayer
                url={satelliteUrl}
                attribution="MapBox"
              />
            </BaseLayer>
            {
              geoJSON
              && (
                <Overlay checked name="Neighborhood Council Boundaries">
                  <Choropleth
                    data={geoJSON}
                    style={{
                      fillColor: 'white',
                      weight: 2,
                      opacity: 1,
                      color: boundaryDefaultColor,
                      dashArray: '3',
                    }}
                    onEachFeature={this.onEachRegionFeature}
                    ref={el => {
                      if (el) {
                        this.choropleth = el.leafletElement;
                        return this.choropleth;
                      }
                      return null;
                    }}
                  />
                </Overlay>
              )
            }
            <Overlay checked name="Markers">
              <MarkerClusterGroup
                showCoverageOnHover
                zoomToBoundsOnClick
                removeOutsideVisibleBounds
                maxClusterRadius={65}
              >
                {this.renderMarkers()}
              </MarkerClusterGroup>
            </Overlay>
            <Overlay name="Heatmap">
              {/* intensityExtractor is required and requires a callback as the value.
                * The heatmap is working with an empty callback but we'll probably
                * improve functionality post-MVP by generating a heatmap list
                * on the backend. */}
              <HeatmapLayer
                max={1}
                points={data}
                radius={20}
                blur={25}
                longitudeExtractor={m => m.longitude}
                latitudeExtractor={m => m.latitude}
                intensityExtractor={() => 1}
              />
            </Overlay>
          </LayersControl>
        </Map>
        <MapExportButton
          map={() => this.mapRef.current.contextValue.map}
          style={{
            position: 'absolute',
            top: 18,
            right: 50,
            zIndex: 1000,
          }}
        />
      </div>
    );
  }

  render() {
    return (
      this.renderMap()
    );
  }
}

const mapStateToProps = state => ({
  data: state.data.pins,
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
