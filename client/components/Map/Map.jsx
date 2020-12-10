import React from 'react';
import PropTypes from 'proptypes';
import mapboxgl from 'mapbox-gl';

import { REQUEST_TYPES } from '@components/common/CONSTANTS';

import {
  INITIAL_BOUNDS,
  INITIAL_LOCATION,
  GEO_FILTER_TYPES,
  MAP_STYLES
} from './constants';

import {
  ncBoundaries,
  ccBoundaries,
  ncNameFromId,
  ccNameFromId,
  ncInfoFromLngLat,
  ccNameFromLngLat,
} from './districts';

import { pointsWithinGeo } from './geoUtils';

import RequestsLayer from './layers/RequestsLayer';
import BoundaryLayer from './layers/BoundaryLayer';
import AddressLayer from './layers/AddressLayer';

// import MapOverview from './controls/MapOverview';
import MapSearch from './controls/MapSearch';
import MapLayers from './controls/MapLayers';
import MapRegion from './controls/MapRegion';
import MapMeta from './controls/MapMeta';

import RequestDetail from './RequestDetail';

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mapReady: false,
      activeRequestsLayer: 'points',
      selectedTypes: props.selectedTypes,
      locationInfo: INITIAL_LOCATION,
      geoFilterType: GEO_FILTER_TYPES.address,
      filterGeo: null,
      filteredRequestCounts: {},
      hoveredRegionName: null,
      colorScheme: 'prism',
      mapStyle: 'dark',
      canReset: true,
      selectedRequestId: null,
      requests: props.requests,
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
    mapboxgl.accessToken = process.env.MAPBOX_TOKEN;

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

      this.map.on('moveend', this.updatePosition);

      this.map.once('idle', e => {
        this.updatePosition();
        this.setState({ mapReady: true });
      });

      this.map.addControl(new mapboxgl.FullscreenControl(), 'bottom-left');
    });

    this.setFilteredRequestCounts();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.requests != prevProps.requests) {
      if (this.state.mapReady) {
        this.setState({ requests: this.props.requests });
        this.map.once('idle', this.setFilteredRequestCounts);
      } else {
        this.map.once('idle', () => {
          this.setState({ requests: this.props.requests });
          this.map.once('idle', this.setFilteredRequestCounts);
        });
      }
    }

    if (
      this.state.filterGeo !== prevState.filterGeo ||
      this.state.selectedTypes !== prevState.selectedTypes
    )
      this.map.once('idle', this.setFilteredRequestCounts);
  }

  initLayers = addListeners => {
    this.requestsLayer.init({
      map: this.map,
    });

    this.addressLayer.init({
      map: this.map,
      addListeners,
      onSelectRegion: ({ geo, center }) => this.setState({
        filterGeo: geo,
        ...(
          center
          ? {
            locationInfo: {
              location: `${center.lat.toFixed(6)} N ${center.lng.toFixed(6)} E`,
              radius: 1,
              nc: ncInfoFromLngLat(center),
            }
          }
          : {}
        )
      }),
    });

    this.ncLayer.init({
      map: this.map,
      addListeners,
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
          },
        });
        this.map.once('zoomend', () => {
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

    this.ccLayer.init({
      map: this.map,
      addListeners,
      sourceId: 'cc',
      sourceData: ccBoundaries,
      idProperty: 'name',
      onSelectRegion: geo => {
        this.setState({
          locationInfo: {
            cc: ccNameFromId(geo.properties.name),
          }
        });
        this.map.once('zoomend', () => {
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
      locationInfo: INITIAL_LOCATION,
      canReset: false,
    });

    this.map.once('zoomend', () => {
      this.setState({
        filterGeo: null,
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
  };

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
  };

  updatePosition = () => {
    // NOTE: currently there's no need to inform redux about map position
    // const { updatePosition } = this.props;
    // const bounds = this.map.getBounds();
    // updatePosition({
    //   zoom: this.map.getZoom(),
    //   bounds: {
    //     _northEast: bounds.getNorthEast(),
    //     _southWest: bounds.getSouthWest(),
    //   },
    // });
  };

  zoomOut = () => {
    this.map.fitBounds(INITIAL_BOUNDS, { padding: 50, linear: true });
  };

  export = () => {
    console.log(this.map.getCanvas().toDataURL());
  };

  setSelectedTypes = selectedTypes => {
    this.setState({ selectedTypes });
  };

  setActiveRequestsLayer = layerName => {
    this.setState({ activeRequestsLayer: layerName });
  };

  setMapStyle = mapStyle => {
    this.setState({ mapStyle });
    this.map.setStyle(MAP_STYLES[mapStyle]);
    this.map.once('styledata', () => this.initLayers(false));
  };

  setColorScheme = scheme => {
    this.setState({ colorScheme: scheme });
  };

  getDistrictCounts = (geoFilterType, filterGeo, selectedTypes) => {
    const { ncCounts, ccCounts } = this.props;
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

  setFilteredRequestCounts = () => {
    const { requests, filterGeo, geoFilterType, selectedTypes } = this.state;
    const { ncCounts, ccCounts } = this.props;

    // use pre-calculated values for nc and cc filters if available
    if (
      filterGeo && (
        geoFilterType === GEO_FILTER_TYPES.nc && ncCounts ||
        geoFilterType === GEO_FILTER_TYPES.cc && ccCounts
      )
    )
      return this.setState({
        filteredRequestCounts: this.getDistrictCounts(
          geoFilterType,
          filterGeo,
          selectedTypes,
        )
      });

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
    if (filterGeo)
      filteredRequests = pointsWithinGeo(filteredRequests, filterGeo);

    // count up requests per type
    const counts = filteredRequests.features.reduce((p, c) => {
      const { type } = c.properties;
      p[type] = (p[type] || 0) + 1;
      return p;
    }, {});

    this.setState({ filteredRequestCounts: counts });
  };

  //// RENDER ////

  render() {
    const {
      pinsInfo,
      getPinInfo,
      lastUpdated,
    } = this.props;

    const {
      requests,
      geoFilterType,
      locationInfo,
      filteredRequestCounts,
      colorScheme,
      filterGeo,
      activeRequestsLayer,
      mapStyle,
      hoveredRegionName,
      canReset,
      selectedRequestId,
      selectedTypes,
    } = this.state;

    return (
      <div className="mapbox-container" ref={el => this.mapContainer = el}>
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
            {/* <MapOverview
              date={lastUpdated}
              locationInfo={locationInfo}
              selectedRequests={filteredRequestCounts}
              colorScheme={colorScheme}
            /> */}
            <MapSearch
              map={this.map}
              geoFilterType={geoFilterType}
              onGeocoderResult={this.onGeocoderResult}
              onChangeTab={this.onChangeSearchTab}
              onReset={this.reset}
              canReset={!!filterGeo && canReset}
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
            <MapMeta map={this.map} />
          </>
        )}
      </div>
    );
  }
}

Map.propTypes = {};

Map.defaultProps = {};

export default Map;
