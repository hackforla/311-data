/*
  TODO:
    - implement reset function
    - put requests layer in separate file
    - put requests underneath large geo text
    - add popups
    - better to filter the requests layer or to change the data in the requests source?
*/

import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';
import geojsonExtent from '@mapbox/geojson-extent';
import * as turf from '@turf/turf';
import { getPinInfoRequest } from '@reducers/data';
import { updateMapPosition } from '@reducers/ui';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';

import RequestsLayer from './RequestsLayer';
import BoundaryLayer from './BoundaryLayer';
import AddressLayer from './AddressLayer';

import MapOverview from './MapOverview';
import MapSearch from './MapSearch';
import MapLayers from './MapLayers';
// import MapCharts from './MapCharts';
import MapMeta from './MapMeta';

import ncBoundaries from '../../data/nc-boundary-2019.json';
import ccBoundaries from '../../data/la-city-council-districts-2012.json';
import openRequests from '../../data/open_requests.json';

/////////////////// CONSTANTS ///////////////

mapboxgl.accessToken = process.env.MAPBOX_TOKEN;
const INITIAL_BOUNDS = geojsonExtent(ncBoundaries);

///////////////////// MAP ///////////////////

class PinMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapReady: false,
      activeRequestsLayer: 'points',
      selectedTypes: Object.keys(REQUEST_TYPES),
      selectedRegionName: 'All of Los Angeles'
    };

    this.map = null;
    this.requestsLayer = null;
    this.addressLayer = null;
    this.ncLayer = null;
    this.ccLayer = null;
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v10',
      bounds: INITIAL_BOUNDS,
      fitBoundsOptions: { padding: 50 },
      pitchWithRotate: false,
      dragRotate: false,
      touchZoomRotate: false
    });

    this.map.on('load', () => {
      this.requestsLayer = RequestsLayer({
        map: this.map,
        sourceData: this.props.requests,
      });

      this.addressLayer = AddressLayer({
        map: this.map,
        onSelectRegion: geo => this.setState({ filterPolygon: geo })
      });

      this.ncLayer = BoundaryLayer({
        map: this.map,
        sourceId: 'nc',
        sourceData: ncBoundaries,
        idProperty: 'nc_id',
        onSelectRegion: geo => this.setState({ filterPolygon: geo })
      });

      this.ccLayer = BoundaryLayer({
        map: this.map,
        sourceId: 'cc',
        sourceData: ccBoundaries,
        idProperty: 'name',
        onSelectRegion: geo => this.setState({ filterPolygon: geo })
      });

      this.map.on('moveend', e => {
        this.updatePosition(this.map);
      });

      this.map.once('idle', e => {
        this.updatePosition(this.map);
        this.setState({ mapReady: true });
      });

      this.map.addControl(new mapboxgl.FullscreenControl(), 'bottom-left');
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.requests !== prevProps.requests)
      this.requestsLayer.setData(this.props.requests);
  }

  onGeocoderResult = ({ result }) => {
    if (result.properties.type === 'nc') {
      this.setState({ selectedRegionName: result.place_name });
      return this.ncLayer.zoomToRegion(result.id);
    }

    if (result.properties.type === 'cc') {
      this.setState({ selectedRegionName: result.place_name });
      return this.ccLayer.zoomToRegion(result.id);
    }

    this.setState({ selectedRegionName: `${result.address} ${result.text}` });
    this.addressLayer.setCenter({
      lng: result.center[0],
      lat: result.center[1]
    });
  }

  onChangeSearchTab = tab => {
    switch(tab) {
      case 'address':
        this.addressLayer.show();
        this.ncLayer.hide();
        this.ccLayer.hide();
        break;

      case 'nc':
        this.ncLayer.show();
        this.ccLayer.hide();
        this.addressLayer.hide();
        break;

      case 'cc':
        this.ccLayer.show();
        this.ncLayer.hide();
        this.addressLayer.hide();
        break;
    }

    this.zoomOut();
  }

  updatePosition = map => {
    const { updatePosition } = this.props;
    const bounds = map.getBounds();
    const zoom = map.getZoom();
    updatePosition({
      zoom,
      bounds: {
        _northEast: bounds.getNorthEast(),
        _southWest: bounds.getSouthWest(),
      },
    });
  }

  zoomOut = () => {
    this.map.fitBounds(INITIAL_BOUNDS, { padding: 50, linear: true });
  }

  export = () => {
    console.log(map.getCanvas().toDataURL());
  }

  setSelectedTypes = selectedTypes => {
    this.requestsLayer.setTypesFilter(selectedTypes);
    this.setState({ selectedTypes });
  }

  setActiveRequestsLayer = layerName => {
    this.requestsLayer.setActiveLayer(layerName);
    this.setState({ activeRequestsLayer: layerName });
  }

  selectedRequests = () => {
    const { filterPolygon, selectedTypes } = this.state;
    const { requests } = this.props;

    let filteredRequests = filterPolygon
      ? turf.within(requests, filterPolygon)
      : requests;

    const out = {};

    selectedTypes.forEach(t => out[t] = 0);

    filteredRequests.features.forEach(r => {
      const { type } = r.properties;
      if (typeof out[type] !== 'undefined')
        out[type] += 1;
    });

    return out;
  }

  //// RENDER ////

  render() {
    return (
      <div className="map-container" ref={el => this.mapContainer = el}>
        { this.state.mapReady && (
          <>
            <MapOverview
              regionName={this.state.selectedRegionName}
              selectedRequests={this.selectedRequests()}
            />
            <MapSearch
              map={this.map}
              onGeocoderResult={this.onGeocoderResult}
              onChangeTab={this.onChangeSearchTab}
            />
            <MapLayers
              selectedTypes={this.state.selectedTypes}
              onChangeSelectedTypes={this.setSelectedTypes}
              requestsLayer={this.state.activeRequestsLayer}
              onChangeRequestsLayer={this.setActiveRequestsLayer}
            />
            {/*<MapCharts
              requests={this.state.requests}
              filterPolygon={this.state.filterPolygon}
              selectedTypes={this.state.selectedTypes}
            />*/}
            <MapMeta position={this.props.position} />
          </>
        )}
      </div>
    );
  }
}

function convertRequests(requests) {
  return {
    type: 'FeatureCollection',
    features: requests.map(request => ({
      type: 'Feature',
      properties: {
        id: request.srnumber,
        type: request.requesttype,
        point_count: request.count
      },
      geometry: {
        type: 'Point',
        coordinates: [
          request.longitude,
          request.latitude
        ]
      }
    }))
  };
}

const REQUESTS = convertRequests(openRequests);

const mapDispatchToProps = dispatch => ({
  getPinInfo: srnumber => dispatch(getPinInfoRequest(srnumber)),
  updatePosition: position => dispatch(updateMapPosition(position)),
  exportMap: () => dispatch(trackMapExport()),
});

const mapStateToProps = state => ({
  pinsInfo: state.data.pinsInfo,
  // pinClusters: convertRequests(state.data.pinClusters),
  requests: REQUESTS,
  heatmap: state.data.heatmap,
  position: state.ui.map
});

PinMap.propTypes = {
  pinsInfo: PropTypes.shape({}),
  pinClusters: PropTypes.arrayOf(PropTypes.shape({})),
  heatmap: PropTypes.arrayOf(PropTypes.array),
  getPinInfo: PropTypes.func.isRequired,
  updatePosition: PropTypes.func.isRequired,
  exportMap: PropTypes.func.isRequired,
};

PinMap.defaultProps = {
  pinsInfo: {},
  pinClusters: [],
  heatmap: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(PinMap);
