/*
  TODO:
    - deal with ids being strings in geojson and numbers in database/constants file
    - implement reset and drop-pin function
    - need drag handle for address filter
    - better to filter the requests layer or to change the data in the requests source?
    - reverse geocode on drag end -- see if we can get intersection based on lat/lng
    - create geoUtils.js containing:
      - empty geojson constant (for removing sources in BoundaryLayer and AddressLayer)
      - turf functions
    - precalculate NC and CC masks
    - precalculate request counts by type, nc, and cc
    - increase boundary of circle when hovering
    - allow user to rotate colors in style tab
*/

import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';
import { pointsWithinPolygon as withinGeo, bbox as boundingBox } from '@turf/turf';
import moment from 'moment';
import { getPinInfoRequest } from '@reducers/data';
import { updateMapPosition } from '@reducers/ui';
import { REQUEST_TYPES, COUNCILS, CITY_COUNCILS } from '@components/common/CONSTANTS';

import RequestsLayer from './RequestsLayer';
import BoundaryLayer from './BoundaryLayer';
import AddressLayer from './AddressLayer';

import MapOverview from './MapOverview';
import MapSearch from './MapSearch';
import MapLayers from './MapLayers';
import MapMeta from './MapMeta';

import ncBoundaries from '../../data/nc-boundary-2019.json';
import ccBoundaries from '../../data/la-city-council-districts-2012.json';
import openRequests from '../../data/open_requests.json';

/////////////////// CONSTANTS ///////////////

mapboxgl.accessToken = process.env.MAPBOX_TOKEN;

const INITIAL_BOUNDS = boundingBox(ncBoundaries);

const INITIAL_LOCATION = {
  name: 'location',
  value: 'All of Los Angeles',
  url: null,
  radius: null
};

const MAP_STYLES = {
  dark: 'mapbox://styles/mapbox/dark-v10',
  light: 'mapbox://styles/mapbox/light-v10',
  streets: 'mapbox://styles/mapbox/streets-v11',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
};

function ncName(ncId) {
  return COUNCILS.find(c => c.id == ncId)?.name;
}

function ccName(ccId) {
  return CITY_COUNCILS.find(c => c.id == ccId)?.name;
}

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
      filteredRequestCounts: {},
      hoveredRegionName: null,
      date: props.lastUpdated,
      colorScheme: 'prism',
    };

    this.map = null;
    this.requestsLayer = null;
    this.addressLayer = null;
    this.ncLayer = null;
    this.ccLayer = null;
    this.popup = null;
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: MAP_STYLES.dark,
      bounds: INITIAL_BOUNDS,
      fitBoundsOptions: { padding: 50 },
      pitchWithRotate: false,
      dragRotate: false,
      touchZoomRotate: false
    });

    this.map.on('load', () => {
      this.addLayers();

      this.map.on('moveend', e => {
        this.updatePosition(this.map);
      });

      this.map.once('idle', e => {
        this.updatePosition(this.map);
        this.setState({ mapReady: true });
      });

      this.map.addControl(new mapboxgl.FullscreenControl(), 'bottom-left');

      this.map.on('click', e => {
        const masks = [
          'nc-region-mask-fill',
          'cc-region-mask-fill',
          'shed-mask-fill'
        ];

        const hoverables = [
          'nc-fills',
          'cc-fills'
        ];

        const features = this.map.queryRenderedFeatures(e.point, {
          layers: [
            'request-circles',
            ...masks,
            ...hoverables
          ]
        });

        for (let i = 0; i < features.length; i++) {
          const feature = features[i];

          if (masks.includes(feature.layer.id))
            return null;

          if (hoverables.includes(feature.layer.id) && !feature.state.selected)
            return null;

          if (feature.layer.id === 'request-circles') {
            const { coordinates } = feature.geometry;
            const { id, type } = feature.properties;
            const content = (
              '<div>' +
                `<div>${id}</div>` +
                `<div>${REQUEST_TYPES[type].displayName}</div>` +
              '</div>'
            );
            this.addPopup(coordinates, content);
          }
        }
      });
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

  addLayers = () => {
    this.requestsLayer = RequestsLayer({
      map: this.map,
      sourceData: this.props.requests,
      addPopup: this.addPopup,
      colorScheme: this.state.colorScheme,
    });

    this.addressLayer = AddressLayer({
      map: this.map,
      onDragEnd: ({ geo, center }) => this.setState({
        filterGeo: geo,
        locationInfo: {
          name: 'location',
          value: `${center.lat.toFixed(6)} N ${center.lng.toFixed(6)} E`,
          radius: 1,
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
            value: ncName(geo.properties.nc_id),
            url: geo.properties.waddress || geo.properties.dwebsite
          }
        });
        this.map.once('idle', () => {
          this.setState({ filterGeo: geo });
        });
      },
      onHoverRegion: geo => {
        this.setState({
          hoveredRegionName: geo
            ? ncName(geo.properties.nc_id)
            : null
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
            value: ccName(geo.properties.name),
          }
        });
        this.map.once('idle', () => {
          this.setState({ filterGeo: geo });
        });
      },
      onHoverRegion: geo => {
        this.setState({
          hoveredRegionName: geo
            ? ccName(geo.properties.name)
            : null
        });
      }
    });
  }

  addPopup = (lngLat, content, opts={}) => {
    this.popup = new mapboxgl.Popup(opts)
      .setLngLat(lngLat)
      .setHTML(content)
      .addTo(this.map);
  };

  removePopup = () => {
    if (this.popup) {
      this.popup.remove();
      this.popup = null;
    }
  }

  reset = () => {
    this.zoomOut();
    this.addressLayer.removeMask();
    this.ncLayer.deselectAll();
    this.ccLayer.deselectAll();
    this.removePopup();
    this.setState({ locationInfo: INITIAL_LOCATION });
    this.map.once('idle', () => {
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

      case 'NC':
        this.ncLayer.show();
        this.ccLayer.hide();
        this.addressLayer.hide();
        break;

      case 'CC':
        this.ccLayer.show();
        this.ncLayer.hide();
        this.addressLayer.hide();
        break;
    }
  }

  onGeocoderResult = ({ result }) => {
    if (result.properties.type === 'NC')
      return this.ncLayer.selectRegion(result.id);

    if (result.properties.type === 'CC')
      return this.ccLayer.selectRegion(result.id);

    this.setState({
      locationInfo: {
        name: 'address',
        value: result.address
          ? `${result.address} ${result.text}`
          : result.text,
        radius: 1,
      }
    });

    this.addressLayer.setCenter({
      lng: result.center[0],
      lat: result.center[1]
    }, geo => {
      this.setState({ filterGeo: geo });
    });
  }

  updatePosition = map => {
    const { updatePosition } = this.props;
    const bounds = map.getBounds();
    updatePosition({
      zoom: map.getZoom(),
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

  setMapStyle = mapStyle => {
    console.log('setting style:', mapStyle);

    // NOT WORKING YET
    // need to deal with removing sources when changing styles
    // this.map.setStyle(MAP_STYLES[mapStyle]);
    // this.addLayers();
  }

  setColorScheme = scheme => {
    this.setState({ colorScheme: scheme });
    this.requestsLayer.setColorScheme(scheme);
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
      filteredRequests = withinGeo(filteredRequests, filterGeo);

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
              date={this.state.date}
              locationInfo={this.state.locationInfo}
              selectedRequests={this.state.filteredRequestCounts}
              colorScheme={this.state.colorScheme}
            />
            <MapSearch
              map={this.map}
              onGeocoderResult={this.onGeocoderResult}
              onChangeTab={this.onChangeSearchTab}
              onReset={this.reset}
              canReset={!!this.state.filterGeo}
            />
            <MapLayers
              selectedTypes={this.state.selectedTypes}
              onChangeSelectedTypes={this.setSelectedTypes}
              requestsLayer={this.state.activeRequestsLayer}
              onChangeRequestsLayer={this.setActiveRequestsLayer}
              mapStyles={Object.keys(MAP_STYLES)}
              onChangeMapStyle={this.setMapStyle}
              colorScheme={this.state.colorScheme}
              onChangeColorScheme={this.setColorScheme}
            />
            <MapMeta position={this.props.position} />
            { this.state.hoveredRegionName && (
              <div className="hovered-region">
                { this.state.hoveredRegionName }
              </div>
            )}
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
  position: state.ui.map,
  //lastUpdated: state.metadata.lastPulled,
  lastUpdated: Date.now(),
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
