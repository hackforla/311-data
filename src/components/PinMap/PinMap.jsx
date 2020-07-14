/*
  TODO:
    - implement reset and drop-pin function
    - add popups
      - need drag handle for address filter
    - better to filter the requests layer or to change the data in the requests source?
    - reverse geocode on drag end -- see if we can get intersection based on lat/lng
*/

import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';
import geojsonExtent from '@mapbox/geojson-extent';
import * as turf from '@turf/turf';
import { getPinInfoRequest } from '@reducers/data';
import { updateMapPosition } from '@reducers/ui';
import { REQUEST_TYPES, COUNCILS, CITY_COUNCILS } from '@components/common/CONSTANTS';

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
const INITIAL_LOCATION = {
  name: 'location',
  value: 'All of Los Angeles',
  url: null,
  radius: null
};

///////////////////// MAP ///////////////////

class PinMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapReady: false,
      activeRequestsLayer: 'points',
      selectedTypes: Object.keys(REQUEST_TYPES),
      locationInfo: INITIAL_LOCATION,
      filterGeo: null,
      filteredRequestCounts: {}
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
        addPopup: this.addPopup,
      });

      this.addressLayer = AddressLayer({
        map: this.map,
        onDragEnd: ({ geo, center }) => this.setState({
          filterGeo: geo,
          locationInfo: {
            name: 'location',
            value: `${center.lat.toFixed(6)} N ${center.lng.toFixed(6)} E`,
            radius: null
          }
        })
      });

      this.ncLayer = BoundaryLayer({
        map: this.map,
        sourceId: 'nc',
        sourceData: ncBoundaries,
        idProperty: 'nc_id',
        onSelectRegion: geo => {
          this.setState({
            locationInfo: {
              name: 'Neighborhood Council',
              value: COUNCILS.find(c => c.id == geo.properties.nc_id)?.name,
              url: geo.properties.waddress || geo.properties.dwebsite
            }
          });
          this.map.once('idle', () => {
            this.setState({ filterGeo: geo });
          });
        }
      });

      this.ccLayer = BoundaryLayer({
        map: this.map,
        sourceId: 'cc',
        sourceData: ccBoundaries,
        idProperty: 'name',
        onSelectRegion: geo => {
          this.setState({
            locationInfo: {
              name: 'City Council',
              value: CITY_COUNCILS.find(c => c.id == geo.properties.name)?.name,
            }
          });
          this.map.once('idle', () => {
            this.setState({ filterGeo: geo });
          });
        }
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

    this.setFilteredRequestCounts();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.requests !== prevProps.requests)
      this.requestsLayer.setData(this.props.requests);

    if (
      this.state.filterGeo !== prevState.filterGeo ||
      this.state.selectedTypes !== prevState.selectedTypes
    )
      this.setFilteredRequestCounts();
  }

  addPopup = (lngLat, content) => {
    return new mapboxgl.Popup()
      .setLngLat(lngLat)
      .setHTML(content)
      .addTo(this.map);
  };

  reset = () => {
    this.zoomOut();
    this.setState({ locationInfo: INITIAL_LOCATION });
    this.map.once('idle', () => {
      this.ncLayer.deselectAll();
      this.ccLayer.deselectAll();
      this.setState({ filterGeo: null });
    });
  }

  onChangeSearchTab = tab => {
    this.reset();

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

    this.addressLayer.setCenter({
      lng: result.center[0],
      lat: result.center[1]
    }, geo => {
      this.setState({
        filterGeo: geo,
        locationInfo: {
          name: 'address',
          value: result.address
            ? `${result.address} ${result.text}`
            : result.text,
        }
      });
    });
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

  setFilteredRequestCounts = () => {
    const { filterGeo, selectedTypes } = this.state;
    const { requests } = this.props;

    let filteredRequests = requests;

    // filter by type selection if necessary
    if (selectedTypes.length < Object.keys(REQUEST_TYPES).length)
      filteredRequests = {
        ...filteredRequests,
        features: filteredRequests.features
          .filter(r => selectedTypes.includes(r.properties.type))
      };

    // filter by geo if necessary
    if (filterGeo)
      filteredRequests = turf.within(filteredRequests, filterGeo);

    // count up requests per type
    const counts = filteredRequests.features.reduce((p, c) => {
      const { type } = c.properties;
      p[type] = (p[type] || 0) + 1;
      return p;
    }, {});

    this.setState({ filteredRequestCounts: counts });
  }

  //// RENDER ////

  render() {
    return (
      <div className="map-container" ref={el => this.mapContainer = el}>
        { this.state.mapReady && (
          <>
            <MapOverview
              locationInfo={this.state.locationInfo}
              selectedRequests={this.state.filteredRequestCounts}
            />
            <MapSearch
              map={this.map}
              onGeocoderResult={this.onGeocoderResult}
              onChangeTab={this.onChangeSearchTab}
              onReset={this.reset}
            />
            <MapLayers
              selectedTypes={this.state.selectedTypes}
              onChangeSelectedTypes={this.setSelectedTypes}
              requestsLayer={this.state.activeRequestsLayer}
              onChangeRequestsLayer={this.setActiveRequestsLayer}
            />
            {/*<MapCharts
              requests={this.props.requests}
              filterGeo={this.state.filterGeo}
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
