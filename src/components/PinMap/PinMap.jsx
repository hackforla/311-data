/*
  TODO:
    - deal with ids being strings in geojson and numbers in database/constants file
    - implement reset and drop-pin function
    - need drag handle for address filter
    - better to filter the requests layer or to change the data in the requests source?
    - reverse geocode on drag end -- see if we can get intersection based on lat/lng
    - precalculate NC and CC masks
    - precalculate request counts by type, nc, and cc DONE
      - also precalculate total for all of los angeles
    - increase boundary of circle when hovering
    - allow user to rotate colors in style tab

    state.geoFilter = {
      type: [geoFilterType],
      geo: geojson,
      info: {
        location: [address, district name],
        radius: [null or number],
        nc: {
          name: [string],
          url: [url],
        }
      }
    }
*/

import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';

import { updateMapPosition } from '@reducers/ui';
import { REQUEST_TYPES, COUNCILS, CITY_COUNCILS } from '@components/common/CONSTANTS';
import { GEO_FILTER_TYPES, MAP_STYLES } from './constants';
import { boundingBox, pointsWithinGeo, isPointWithinGeo } from './utils';

import RequestsLayer from './layers/RequestsLayer';
import BoundaryLayer from './layers/BoundaryLayer';
import AddressLayer from './layers/AddressLayer';

import MapOverview from './controls/MapOverview';
import MapSearch from './controls/MapSearch';
import MapLayers from './controls/MapLayers';
import MapRegion from './controls/MapRegion';
import MapMeta from './controls/MapMeta';

import RequestDetail from './RequestDetail';

import ncBoundaries from '../../data/nc-boundary-2019.json';
import ccBoundaries from '../../data/la-city-council-districts-2012.json';
import openRequests from '../../data/open_requests.json';

import ncCounts from '../../data/ncCounts.json';
import ccCounts from '../../data/ccCounts.json';

/////////////////// CONSTANTS ///////////////

mapboxgl.accessToken = process.env.MAPBOX_TOKEN;

const INITIAL_BOUNDS = boundingBox(ncBoundaries);

const INITIAL_LOCATIONS = [
  { location: 'All of Los Angeles', }, 
  { location: 'All of Los Angeles', }
];

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
      locationInfo: INITIAL_LOCATIONS,
      geoFilterType: GEO_FILTER_TYPES.nc,
      filterGeos: [],
      filteredRequestCounts: [],
      hoveredRegionName: null,
      date: props.lastUpdated,
      colorScheme: 'prism',
      mapStyle: 'dark',
      canReset: true,
      selectedRequestId: null,
    };

    this.map = null;
    this.requestsLayer = null;
    this.addressLayer = null;
    this.ncLayer = null;
    this.ccLayer = null;
    this.requestDetail = null;
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
      this.initLayers(true);

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
    if (
      this.state.filterGeos !== prevState.filterGeos ||
      this.state.selectedTypes !== prevState.selectedTypes
    )
      this.setFilteredRequestCounts();
  }

  addGeo(geo) {
    this.setState((state) => {
      return { filterGeos: [...state.filterGeos, geo] }
    });
  }

  addNCLocationInfo(geo) {
    this.setState((state) => {
      return {
        locationInfo: [...state.locationInfo, {
          nc: {
            name: ncNameFromId(geo.properties.nc_id),
            url: geo.properties.waddress || geo.properties.dwebsite,
          },
        }],
      }
    });
  }

  addCCLocationInfo(geo) {
    this.setState((state) => {
      return {
        locationInfo: [...state.locationInfo, {
          cc: ccNameFromId(geo.properties.name),
        }],
      }
    });
  }

  initLayers = addListeners => {
    this.requestsLayer.init({
      map: this.map,
    });

    this.addressLayer.init({
      map: this.map,
      addListeners,
      onSelectRegion: (geo) => this.addGeo(geo),
    });

    this.ncLayer.init({
      map: this.map,
      addListeners,
      sourceId: 'nc',
      sourceData: ncBoundaries,
      idProperty: 'nc_id',
      onSelectRegion: geo => {
        this.addNCLocationInfo(geo);
        this.map.once('click', () => {
          this.addGeo(geo);
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

    this.ccLayer.init({
      map: this.map,
      addListeners,
      sourceId: 'cc',
      sourceData: ccBoundaries,
      idProperty: 'name',
      onSelectRegion: geo => {
        this.addCCLocationInfo(geo);
        this.map.once('click', () => {
          this.addGeo(geo);
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

  addPopup = (coordinates, requestId) => {
    this.setState({ selectedRequestId: requestId });
    this.popup = new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setDOMContent(this.requestDetail)
      .addTo(this.map);
  }

  removePopup = () => {
    if (this.popup) {
      this.popup.remove();
      this.popup = null;
      this.setState({ selectedRequestId: null });
    }
  };

  reset = () => {
    this.zoomOut();
    this.addressLayer.setCenter(null);
    this.ncLayer.clearSelectedRegion();
    this.ccLayer.clearSelectedRegion();
    this.removePopup();

    this.setState({
      locationInfo: INITIAL_LOCATIONS,
      canReset: false,
    });

    this.map.once('zoomend', () => {
      this.setState({
        filterGeos: [],
        canReset: true,
      });
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
        const { id } = feature.properties;
        return this.addPopup(coordinates, id);
      }
    }
  };

  onChangeSearchTab = tab => {
    this.setState({ geoFilterType: tab });
    this.reset();
  }

  onGeocoderResult = ({ result }) => {
    if (result.properties.type === GEO_FILTER_TYPES.nc)
      return this.ncLayer.selectRegion(result.id);

    if (result.properties.type === GEO_FILTER_TYPES.cc)
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

    this.addressLayer.zoomTo(lngLat);
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
    this.setState({ selectedTypes });
  }

  setActiveRequestsLayer = layerName => {
    this.setState({ activeRequestsLayer: layerName });
  }

  setMapStyle = mapStyle => {
    this.setState({ mapStyle });
    this.map.setStyle(MAP_STYLES[mapStyle]);
    this.map.once('styledata', () => this.initLayers(false));
  }

  setColorScheme = scheme => {
    this.setState({ colorScheme: scheme });
  }

  getBoundaryCounts = (geoFilterType, filterGeo, selectedTypes) => {
    const { counts, regionId } = (() => {
      switch(geoFilterType) {
        case GEO_FILTER_TYPES.nc: return {
          counts: ncCounts,
          regionId: filterGeo.properties.nc_id,
        };
        case GEO_FILTER_TYPES.cc: return {
          counts: ccCounts,
          regionId: filterGeo.properties.name,
        };
        default: return {};
      }
    })();

    return Object.keys(counts[regionId]).reduce((filteredCounts, rType) => {
      if (selectedTypes.includes(rType))
        filteredCounts[rType] = counts[regionId][rType];
      return filteredCounts;
    }, {});
  };

  addFilteredRequestCounts(data) {
    this.setState((state) => {
      return { filteredRequestCounts: [...state.filteredRequestCounts, data] }
    })
  }

  setFilteredRequestCounts = () => {
    const { requests } = this.props;
    const { filterGeos, selectedTypes, geoFilterType } = this.state;

    // use pre-calculated values for nc and cc filters
    if (
      filterGeos[filterGeos.length - 1] &&
      [GEO_FILTER_TYPES.nc, GEO_FILTER_TYPES.cc].includes(geoFilterType)
    )
      return this.addFilteredRequestCounts(
        this.getBoundaryCounts(
          geoFilterType,
          filterGeos[filterGeos.length - 1],
          selectedTypes,
        )
      );

    // otherwise, count up the filtered requests
    let filteredRequests = requests;

    // filter by type selection if necessary
    if (selectedTypes.length < Object.keys(REQUEST_TYPES).length)
      filteredRequests = {
        ...filteredRequests,
        features: filteredRequests.features
          .filter(r => selectedTypes.includes(r.properties.type))
      };

    // filter by geo if necessary
    if (filterGeos[filterGeos.length - 1])
      filteredRequests = pointsWithinGeo(filteredRequests, filterGeos[filterGeos.length - 1]);

    // count up requests per type
    const counts = filteredRequests.features.reduce((p, c) => {
      const { type } = c.properties;
      p[type] = (p[type] || 0) + 1;
      return p;
    }, {});

    this.addFilteredRequestCounts(counts);
    this.addFilteredRequestCounts(counts);
  }

  //// RENDER ////

  render() {
    const {
      requests,
      position,
      pinsInfo,
      getPinInfo,
    } = this.props;

    const {
      geoFilterType,
      date,
      locationInfo,
      filteredRequestCounts,
      colorScheme,
      filterGeos,
      selectedTypes,
      activeRequestsLayer,
      mapStyle,
      hoveredRegionName,
      canReset,
      selectedRequestId,
    } = this.state;

    return (
      <div className="map-container" ref={el => this.mapContainer = el}>
        <RequestsLayer
          ref={el => this.requestsLayer = el}
          requests={requests}
          activeLayer={activeRequestsLayer}
          selectedTypes={selectedTypes}
          colorScheme={colorScheme}
        />
        <AddressLayer
          ref={el => this.addressLayer = el}
          visible={geoFilterType === GEO_FILTER_TYPES.address}
          boundaryStyle={mapStyle === 'dark' ? 'light' : 'dark'}
        />
        <BoundaryLayer
          ref={el => this.ncLayer = el}
          visible={geoFilterType === GEO_FILTER_TYPES.nc}
          boundaryStyle={mapStyle === 'dark' ? 'light' : 'dark'}
        />
        <BoundaryLayer
          ref={el => this.ccLayer = el}
          visible={geoFilterType === GEO_FILTER_TYPES.cc}
          boundaryStyle={mapStyle === 'dark' ? 'light' : 'dark'}
        />
        <div ref={el => this.requestDetail = el}>
          <RequestDetail srnumber={selectedRequestId} />
        </div>
        { this.state.mapReady && (
          <>
            <MapOverview
              date={date}
              locationInfo={locationInfo[locationInfo.length - 1]}
              selectedRequests={filteredRequestCounts[filteredRequestCounts.length - 1]}
              colorScheme={colorScheme}
            />
            <MapOverview
              date={date}
              locationInfo={locationInfo[locationInfo.length - 2]}
              selectedRequests={filteredRequestCounts[filteredRequestCounts.length - 2]}
              colorScheme={colorScheme}
            />
            <MapSearch
              map={this.map}
              geoFilterType={geoFilterType}
              onGeocoderResult={this.onGeocoderResult}
              onChangeTab={this.onChangeSearchTab}
              onReset={this.reset}
              canReset={!filterGeos.length === 0 && canReset}
            />
            <MapLayers
              selectedTypes={selectedTypes}
              onChangeSelectedTypes={this.setSelectedTypes}
              requestsLayer={activeRequestsLayer}
              onChangeRequestsLayer={this.setActiveRequestsLayer}
              mapStyle={mapStyle}
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

const mapStateToProps = state => ({
  // pinClusters: convertRequests(state.data.pinClusters),
  requests: REQUESTS,
  heatmap: state.data.heatmap,
  position: state.ui.map,
  //lastUpdated: state.metadata.lastPulled,
  lastUpdated: Date.now(),
});

const mapDispatchToProps = dispatch => ({
  updatePosition: position => dispatch(updateMapPosition(position)),
  exportMap: () => dispatch(trackMapExport()),
});

PinMap.propTypes = {
  pinClusters: PropTypes.arrayOf(PropTypes.shape({})),
  heatmap: PropTypes.arrayOf(PropTypes.array),
  updatePosition: PropTypes.func.isRequired,
  exportMap: PropTypes.func.isRequired,
};

PinMap.defaultProps = {
  pinClusters: [],
  heatmap: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(PinMap);
