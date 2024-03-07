/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import mapboxgl from 'mapbox-gl';
import FilterMenu from '@components/main/Desktop/FilterMenu';
// import LocationDetail from './LocationDetail';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';
import { getNcByLngLat } from '@reducers/data';
import {
  updateNcId,
  updateSelectedCouncils,
  updateUnselectedCouncils,
} from '@reducers/filters';
import { closeBoundaries } from '@reducers/ui';
import {
  INITIAL_BOUNDS,
  INITIAL_LOCATION,
  GEO_FILTER_TYPES,
  MAP_STYLES
} from './constants';

import {
  ccBoundaries,
  ncNameFromId,
  ccNameFromId,
  ncInfoFromLngLat,
  // ccNameFromLngLat,
} from './districts';

import { pointsWithinGeo } from './geoUtils';

import RequestsLayer from './layers/RequestsLayer';
import BoundaryLayer from './layers/BoundaryLayer';
import AddressLayer from './layers/AddressLayer';

// import MapOverview from './controls/MapOverview';

import MapSearch from './controls/MapSearch';
// import MapLayers from './controls/MapLayers';
// import MapRegion from './controls/MapRegion';
// import MapMeta from './controls/MapMeta';

import RequestDetail from './RequestDetail';

import { debounce } from '@utils';

import settings from '@settings'

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    margin: '0 auto',
    '& canvas.mapboxgl-canvas:focus': {
      outline: 'none',
    },
    // TODO: controls placement
    '& .mapboxgl-control-container': {
      display: 'none',
    },
    '& .mapboxgl-popup-content': {
      width: 'auto',
      backgroundColor: theme.palette.primary.main,
      borderRadius: 5,
      padding: 10,
    },
    '& .mapboxgl-popup-close-button': {
      fontSize: 24,
      color: 'white',
      padding: 0,
      marginTop: 5,
      marginRight: 5,
    },
    '& .mapboxgl-popup': {
      '&-anchor-bottom .mapboxgl-popup-tip': {
        borderTopColor: theme.palette.primary.main,
      },
      '&-anchor-top .mapboxgl-popup-tip': {
        borderBottomColor: theme.palette.primary.main,
      },
      '&-anchor-left .mapboxgl-popup-tip': {
        borderRightColor: theme.palette.primary.main,
      },
      '&-anchor-right .mapboxgl-popup-tip': {
        borderLeftColor: theme.palette.primary.main,
      },
    },
  },
  menuWrapper: {
    position: 'absolute',
    left: '20px',
    top: '20px',
  },
})

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mapReady: false,
      activeRequestsLayer: 'points',
      selectedTypes: props.selectedTypes,
      locationInfo: INITIAL_LOCATION,
      address: null,
      geoFilterType: GEO_FILTER_TYPES.address,
      filterGeo: null,
      filteredRequestCounts: {},
      hoveredRegionName: null,
      colorScheme: 'prism',
      mapStyle: 'streets',
      canReset: true,
      selectedRequestId: null,
      selectedNc: null,
      requests: props.requests,
    };

    this.map = null;
    this.requestsLayer = null;
    this.addressLayer = null;
    this.ncLayer = null;
    this.ccLayer = null;
    this.requestDetail = null;
    this.popup = null;
    this.isSubscribed = null;
    this.initialState = props.initialState
    this.hasSetInitialNCView = false

  }

  componentDidMount() {
    this.isSubscribed = true;
    mapboxgl.accessToken = process.env.MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: MAP_STYLES[this.state.mapStyle],
      bounds: INITIAL_BOUNDS,
      fitBoundsOptions: { padding: 50 },
      pitchWithRotate: false,
      dragRotate: false,
      touchZoomRotate: false
    });

    map.on('load', () => {
      if (this.isSubscribed) {
        this.initLayers(true);

        map.on('click', this.debouncedOnClick);

        map.once('idle', e => {
          this.setState({ mapReady: true });
        });
      }
    });
    this.map = map;

  }

  componentWillUnmount() {
    this.isSubscribed = false;
    this.map.remove();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.requests != prevProps.requests) {
      if (this.state.mapReady) {
        this.setState({ requests: this.props.requests });
        // this.map.once('idle', this.setFilteredRequestCounts);
      } else {
        this.map.once('idle', () => {
          this.setState({ requests: this.props.requests });
          // this.map.once('idle', this.setFilteredRequestCounts);
        });
      }
    }

    // if (this.props.requestTypes != prevProps.requestTypes) {
    //   this.requestsLayer.init({
    //     map: this.map,
    //   });
    // }

    if (
      this.state.filterGeo !== prevState.filterGeo ||
      this.state.selectedTypes !== prevState.selectedTypes
    ) this.map.once('idle', this.setFilteredRequestCounts);

    if (this.props.ncBoundaries != prevProps.ncBoundaries) {
      this.ncLayer.init({
        map: this.map,
        addListeners: true,
        sourceId: 'nc',
        sourceData: this.props.ncBoundaries,
        idProperty: 'council_id',
        onSelectRegion: geo => {
          this.setState({
            locationInfo: {
              nc: {
                name: geo.properties.council_name,
                // url removed from /geojson payload
                // need to map from /councils response
                // url: geo.properties.waddress || geo.properties.dwebsite,
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
    }

    if (this.props.selectedNcId !== prevProps.selectedNcId) {
      const { councils, selectedNcId } = this.props;
      const nc = councils.find(({ councilId }) => councilId === selectedNcId);
      this.setState({ selectedNc: nc });
      return this.ncLayer.selectRegion(selectedNcId);
    }

    if (this.props.ncId !== prevProps.ncId) {
      const { councils, ncId } = this.props;
      const nc = councils.find(({ councilId }) => councilId === ncId);
      this.setState({ selectedNc: nc });
      return this.ncLayer.selectRegion(ncId);
    }


    const { 
      dispatchUpdateNcId,
      dispatchUpdateSelectedCouncils,
      dispatchUpdateUnselectedCouncils, 
      councils, 
      ncBoundaries } = this.props;

    if(this.initialState.councilId && councils?.length > 0 && !(this.hasSetInitialNCView) && ncBoundaries){
      try{
        const selectedCouncilId = Number(this.initialState.councilId);
        const newSelectedCouncil = councils.find(({ councilId }) => councilId === selectedCouncilId);
        if (!newSelectedCouncil){
          throw new Error('Council Does not exist from search query')
        }
        const newSelected = [newSelectedCouncil];
        dispatchUpdateSelectedCouncils(newSelected);
        dispatchUpdateUnselectedCouncils(councils);
        dispatchUpdateNcId(selectedCouncilId);
        this.hasSetInitialNCView = true
      } catch (err) {
        console.log("could not set ncid")
        this.hasSetInitialNCView = false
      }
    }
  }

  initLayers = addListeners => {
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

    this.requestsLayer.init({
      map: this.map,
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
    const { dispatchUpdateNcId } = this.props

    this.zoomOut();
    this.addressLayer.clearMarker();
    this.ncLayer.clearSelectedRegion();
    this.ccLayer.clearSelectedRegion();
    this.removePopup();

    this.setState({
      locationInfo: INITIAL_LOCATION,
      address: null,
      canReset: false,
      selectedNc: null,
    });

    // Set councilId in reducers/filters back to null
    dispatchUpdateNcId(null)
       
    this.map.once('zoomend', () => {
      this.setState({
        filterGeo: null,
        canReset: true,
      });      
    });
  };

  resetBoundaries = () => {
    const { 
      dispatchUpdateNcId, 
      dispatchUpdateSelectedCouncils,
      dispatchUpdateUnselectedCouncils,
      councils } = this.props;

    // Reset the selected NcId back to null.
    dispatchUpdateNcId(null);

    // Reset councilSelector.
    dispatchUpdateSelectedCouncils([])
    dispatchUpdateUnselectedCouncils(councils)
  }

  addressSearchIsEmpty = () => {
    const addressSearchInput = document.querySelector('#geocoder input')
    return !Boolean(addressSearchInput?.value?.trim())
  }

  resetAddressSearch = () => {
    if(!this.addressSearchIsEmpty()){
      // Dispatch custom event to MapSearch to trigger geocoder.clear() to clear Address Search input
      const geocoderElement = document.getElementById('geocoder')
      const resetEvent = new Event(settings.map.eventName.reset)
      geocoderElement.dispatchEvent(resetEvent)
    }
  }

  onClick = e => {

    const hoverables = [
      'nc-fills',
      'cc-fills'
    ];

    const features = this.map.queryRenderedFeatures(e.point, {
      layers: [
        'request-circles',
        ...hoverables
      ]
    });

    const { 
      dispatchUpdateNcId, 
      dispatchUpdateSelectedCouncils,
      dispatchUpdateUnselectedCouncils,
      dispatchCloseBoundaries,
      councils } = this.props;

    for (let i = 0; i < features.length; i++) {
      const feature = features[i];

      if (
        (this.props.selectedNcId !== null)
        && (feature.properties.council_id && this.props.selectedNcId !== feature.properties.council_id)
      ){
        // Since click is for another district
        
        // Reset boundaries selection
        this.resetBoundaries()

        // Collapse boundaries section
        dispatchCloseBoundaries()

        // Reset Address Search input field
        this.resetAddressSearch()

        // Reset Map.
        this.reset()

        return
      }

      if (hoverables.includes(feature.layer.id) && !feature.state.selected) {
        switch (feature.layer.id) {
          case 'nc-fills':
            this.setState({ address: null });
            this.resetAddressSearch();  // Clear address search input
            dispatchCloseBoundaries();  // Collapse boundaries section
            const selectedCouncilId = Number(feature.properties.council_id)
            const newSelectedCouncil = councils.find(({ councilId }) => councilId === selectedCouncilId);
            const newSelected = [newSelectedCouncil];
            dispatchUpdateSelectedCouncils(newSelected);
            dispatchUpdateUnselectedCouncils(councils);
            dispatchUpdateNcId(selectedCouncilId);
            return this.ncLayer.selectRegion(feature.id);
          case 'cc-fills':
            return this.ccLayer.selectRegion(feature.id);
          default:
            return null;
        }
      }

      if (feature.layer.id === 'request-circles') {
        const { coordinates } = feature.geometry;
        const { requestId, typeId } = feature.properties;
        return this.addPopup(coordinates, requestId);
      }
    }
  };

  debouncedOnClick = debounce(this.onClick)

  onChangeSearchTab = tab => {
    this.setState({ geoFilterType: tab });
    this.reset();
  };
  
  // Address Search event handler
  // An Address Search will triger the onGeocoderResult event
  onGeocoderResult = ({ result }) => {
    const { 
      dispatchGetNcByLngLat, 
      dispatchUpdateNcId,
      dispatchCloseBoundaries
    } = this.props;

    // Reset boundaries input
    this.resetBoundaries()
    
    // Collapse boundaries section
    dispatchCloseBoundaries()

    // Reset map & zoom out
    this.reset()

    if (result.properties.type === GEO_FILTER_TYPES.nc) {
      this.setState({ address: null });
      dispatchUpdateNcId(result.id);
    } 
    else {  // When result.properties.type does not equal "District"
      const address = result.place_name
        .split(',')
        .slice(0, -2)
        .join(', ');

      // what does dispatchGetNcByLngLat() do?
      //
      // dispatchGetNcByLngLat calls a sagas in redux/sagas/data.js:
      //  yield takeLatest(types.GET_NC_BY_LNG_LAT, getNcByLngLat);
      //  which will:
      //    call(fetchNcByLngLat, action.payload);
      //  on success: getNcByLngLatSuccess(data) to set value for state.selectedNcId
      //  on error: getNcByLngLatFailure(e) to set value for state.error object
      //
      //  fetchNcByLngLat above makes an API call to:
      //   `${BASE_URL}/geojson/geocode?latitude=${latitude}&longitude=${longitude}`
      //
      //  and returns the data
      dispatchGetNcByLngLat({ longitude: result.center[0], latitude: result.center[1] });

      this.setState({
        address: address,
      });

      // Add that cute House Icon on the map
      return this.addressLayer.addMarker([result.center[0], result.center[1]]);
    }
  };

  zoomOut = () => {
    this.map.fitBounds(INITIAL_BOUNDS, { padding: 50, linear: true });
  };

  export = () => {
    console.log(this.map.getCanvas().toDataURL());
  };

  // setSelectedTypes = selectedTypes => {
  //   this.setState({ selectedTypes });
  // };

  // setActiveRequestsLayer = layerName => {
  //   this.setState({ activeRequestsLayer: layerName });
  // };

  // setMapStyle = mapStyle => {
  //   this.setState({ mapStyle });
  //   this.map.setStyle(MAP_STYLES[mapStyle]);
  //   this.map.once('styledata', () => this.initLayers(false));
  // };

  // setColorScheme = scheme => {
  //   this.setState({ colorScheme: scheme });
  // };

  getDistrictCounts = (geoFilterType, filterGeo, selectedTypes) => {
    const { ncCounts, ccCounts } = this.props;
    const { counts, regionId } = (() => {
      switch (geoFilterType) {
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
      requestTypes,
      selectedNcId,
      councils,
    } = this.props;

    const {
      geoFilterType,
      locationInfo,
      // filteredRequestCounts,
      colorScheme,
      filterGeo,
      activeRequestsLayer,
      mapStyle,
      // hoveredRegionName,
      canReset,
      selectedRequestId,
      selectedNc,
      selectedTypes,
      address,
    } = this.state;

    const { classes } = this.props;

    return (
      <div className={classes.root} ref={el => this.mapContainer = el} >
        <RequestsLayer
          ref={el => this.requestsLayer = el}
          activeLayer={activeRequestsLayer}
          selectedTypes={selectedTypes}
          colorScheme={colorScheme}
          requestTypes={requestTypes}
        />
        <AddressLayer
          ref={el => this.addressLayer = el}
          // visible={geoFilterType === GEO_FILTER_TYPES.address}
          visible
          boundaryStyle={mapStyle === 'dark' ? 'light' : 'dark'}
        />
        <BoundaryLayer
          ref={el => this.ncLayer = el}
          // visible={geoFilterType === GEO_FILTER_TYPES.nc}
          visible
          boundaryStyle={mapStyle === 'dark' ? 'light' : 'dark'}
        />
        <BoundaryLayer
          ref={el => this.ccLayer = el}
          visible={geoFilterType === GEO_FILTER_TYPES.cc}
          boundaryStyle={mapStyle === 'dark' ? 'light' : 'dark'}
        />
        <div ref={el => this.requestDetail = el}>
          <RequestDetail requestId={selectedRequestId} />
        </div>
        {this.state.mapReady && requestTypes && (
          <>
            {/* <MapOverview
              date={lastUpdated}
              locationInfo={locationInfo}
              selectedRequests={filteredRequestCounts}
              colorScheme={colorScheme}
            /> */}
            <div className={classes.menuWrapper}>
              <MapSearch
                map={this.map}
                geoFilterType={geoFilterType}
                councils={councils}
                onGeocoderResult={this.onGeocoderResult}
                onChangeTab={this.onChangeSearchTab}
                onReset={this.reset}
                canReset={!!filterGeo && canReset}
              />
              <FilterMenu 
                resetMap={this.reset} 
                resetAddressSearch={this.resetAddressSearch}
              />
              {/* {
                (selectedNc || address) && <LocationDetail address={address} nc={selectedNc} />
              } */}

            </div>
            {/* <MapLayers
              selectedTypes={selectedTypes}
              onChangeSelectedTypes={this.setSelectedTypes}
              requestsLayer={activeRequestsLayer}
              onChangeRequestsLayer={this.setActiveRequestsLayer}
              mapStyle={mapStyle}
              onChangeMapStyle={this.setMapStyle}
              colorScheme={colorScheme}
              onChangeColorScheme={this.setColorScheme}
            /> */}
            {/* <MapRegion regionName={hoveredRegionName} />
            <MapMeta map={this.map} /> */}
          </>
        )}
      </div>
    );
  }
}

Map.propTypes = {
  requests: PropTypes.shape({}),
  position: PropTypes.shape({}),
  selectedTypes: PropTypes.shape({}),
  dispatchGetNcByLngLat: PropTypes.func.isRequired,
  dispatchUpdateNcId: PropTypes.func.isRequired,
};

Map.defaultProps = {};

const mapStateToProps = state => ({
  ncBoundaries: state.metadata.ncGeojson,
  requestTypes: state.metadata.requestTypes,
  councils: state.metadata.councils,
  selectedNcId: state.filters.councilId,
  ncId: state.data.selectedNcId,
});

const mapDispatchToProps = dispatch => ({
  dispatchGetNcByLngLat: coords => dispatch(getNcByLngLat(coords)),
  dispatchUpdateNcId: id => dispatch(updateNcId(id)),
  dispatchUpdateSelectedCouncils: councils => dispatch(updateSelectedCouncils(councils)),
  dispatchUpdateUnselectedCouncils: councils => dispatch(updateUnselectedCouncils(councils)),
  dispatchCloseBoundaries: () => dispatch(closeBoundaries()),
});

// We need to specify forwardRef to allow refs on connected components.
// See https://github.com/reduxjs/react-redux/issues/1291#issuecomment-494185126
// for more info.
export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(withStyles(styles)(Map));
