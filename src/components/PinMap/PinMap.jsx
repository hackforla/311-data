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
import moment from 'moment';

import { getPinInfoRequest } from '@reducers/data';
import { updateMapPosition } from '@reducers/ui';
import { REQUEST_TYPES, COUNCILS, CITY_COUNCILS } from '@components/common/CONSTANTS';
import { boundingBox, pointsWithinGeo, isPointWithinGeo } from './utils';

import RequestsLayer from './RequestsLayer';
import BoundaryLayer from './BoundaryLayer';
import AddressLayer from './AddressLayer';

import MapOverview from './controls/MapOverview';
import MapSearch from './controls/MapSearch';
import MapLayers from './controls/MapLayers';
import MapRegion from './controls/MapRegion';
import MapMeta from './controls/MapMeta';

import ncBoundaries from '../../data/nc-boundary-2019.json';
import ccBoundaries from '../../data/la-city-council-districts-2012.json';
import openRequests from '../../data/open_requests.json';

/////////////////// CONSTANTS ///////////////

mapboxgl.accessToken = process.env.MAPBOX_TOKEN;

const INITIAL_BOUNDS = boundingBox(ncBoundaries);

const INITIAL_LOCATION = {
  location: 'All of Los Angeles',
};

const MAP_STYLES = {
  dark: 'mapbox://styles/mapbox/dark-v10',
  light: 'mapbox://styles/mapbox/light-v10',
  streets: 'mapbox://styles/mapbox/streets-v11',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v11',
};

function ncNameFromId(ncId) {
  return COUNCILS.find(c => c.id == ncId)?.name;
}

function ccNameFromId(ccId) {
  return CITY_COUNCILS.find(c => c.id == ccId)?.name;
}

function ncInfoFromLngLat({ lng, lat }) {
  for (let i = 0; i < ncBoundaries.features.length; i++) {
    const feature = ncBoundaries.features[i];
    if (isPointWithinGeo([lng, lat], feature))
      return {
        name: ncNameFromId(feature.properties.nc_id),
        url: feature.properties.waddress || feature.properties.dwebsite,
      };
  }
  return null;
}

function ccNameFromLngLat({ lng, lat }) {
  for (let i = 0; i < ccBoundaries.features.length; i++)
    if (isPointWithinGeo([lng, lat], ccBoundaries.features[i]))
      return ccNameFromId(ccBoundaries.features[i].properties.name);
  return null;
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
      mapStyle: 'dark',
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
      style: MAP_STYLES[this.state.mapStyle],
      bounds: INITIAL_BOUNDS,
      fitBoundsOptions: { padding: 50 },
      pitchWithRotate: false,
      dragRotate: false,
      touchZoomRotate: false
    });

    this.map.on('load', () => {
      this.addLayers();

      this.map.on('click', this.onClick);

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
          location: `${center.lat.toFixed(6)} N ${center.lng.toFixed(6)} E`,
          radius: 1,
          nc: ncInfoFromLngLat(center),
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
            nc: {
              name: ncNameFromId(geo.properties.nc_id),
              url: geo.properties.waddress || geo.properties.dwebsite,
            },
          }
        });
        this.map.once('idle', () => {
          this.setState({ filterGeo: geo });
        });
      },
      onHoverRegion: geo => {
        this.setState({
          hoveredRegionName: geo
            ? ncNameFromId(geo.properties.nc_id)
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
            cc: ccNameFromId(geo.properties.name),
          }
        });
        this.map.once('idle', () => {
          this.setState({ filterGeo: geo });
        });
      },
      onHoverRegion: geo => {
        this.setState({
          hoveredRegionName: geo
            ? ccNameFromId(geo.properties.name)
            : null
        });
      }
    });
  };

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
  };

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
  };

  onClick = e => {
    const masks = [
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

      if (hoverables.includes(feature.layer.id) && !feature.state.selected) {
        switch(feature.layer.id) {
          case 'nc-fills':
            return this.ncLayer.selectRegion(feature.id);
          case 'cc-fills':
            return this.ccLayer.selectRegion(feature.id);
          default:
            return null;
        }
      }

      if (feature.layer.id === 'request-circles') {
        const { coordinates } = feature.geometry;
        const { id, type } = feature.properties;
        const content = (
          '<div>' +
            `<div>${id}</div>` +
            `<div>${REQUEST_TYPES[type].displayName}</div>` +
          '</div>'
        );
        return this.addPopup(coordinates, content);
      }
    }
  };

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

    const lngLat = {
      lng: result.center[0],
      lat: result.center[1],
    };

    this.setState({
      locationInfo: {
        location: result.address
          ? `${result.address} ${result.text}`
          : result.text,
        radius: 1,
        nc: ncInfoFromLngLat(lngLat),
      }
    });

    this.addressLayer.setCenter(lngLat, geo => {
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
    this.setState({ mapStyle });
    this.map.setStyle(MAP_STYLES[mapStyle]);
    this.map.once('styledata', this.addLayers);
  }

  setColorScheme = scheme => {
    this.setState({ colorScheme: scheme });
    this.requestsLayer.setColorScheme(scheme);
  }

  setFilteredRequestCounts = () => {
    const { requests } = this.props;
    const { filterGeo, selectedTypes } = this.state;

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
      filteredRequests = pointsWithinGeo(filteredRequests, filterGeo);

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
    const { position } = this.props;

    const {
      date,
      locationInfo,
      filteredRequestCounts,
      colorScheme,
      filterGeo,
      selectedTypes,
      activeRequestsLayer,
      mapStyle,
      hoveredRegionName,
    } = this.state;

    return (
      <div className="map-container" ref={el => this.mapContainer = el}>
        { this.state.mapReady && (
          <>
            <MapOverview
              date={date}
              locationInfo={locationInfo}
              selectedRequests={filteredRequestCounts}
              colorScheme={colorScheme}
            />
            <MapSearch
              map={this.map}
              onGeocoderResult={this.onGeocoderResult}
              onChangeTab={this.onChangeSearchTab}
              onReset={this.reset}
              canReset={!!filterGeo}
            />
            <MapLayers
              selectedTypes={selectedTypes}
              onChangeSelectedTypes={this.setSelectedTypes}
              requestsLayer={activeRequestsLayer}
              onChangeRequestsLayer={this.setActiveRequestsLayer}
              mapStyle={mapStyle}
              mapStyles={Object.keys(MAP_STYLES)}
              onChangeMapStyle={this.setMapStyle}
              colorScheme={colorScheme}
              onChangeColorScheme={this.setColorScheme}
            />
            <MapRegion regionName={hoveredRegionName} />
            <MapMeta position={position} />
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
