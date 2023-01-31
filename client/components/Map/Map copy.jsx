/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import mapboxgl from 'mapbox-gl';
import FilterMenu from '@components/main/Desktop/FilterMenu';
import LocationDetail from './LocationDetail';

import { REQUEST_TYPES } from '@components/common/CONSTANTS';
import { getNcByLngLat, setSelectedNcId } from '@reducers/data';
import { updateNcId } from '@reducers/filters';

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

// An array of all hoverable feature ids used in Map
const hoverables = [
  'nc-fills',
  'cc-fills'
];

const featureLayers = [
    'request-circles',
    ...hoverables
];

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
  }

  componentDidMount() {
    // console.log(`componentDidMount - start`)
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
      console.log(`map.on('load') called. inside callback`)
      if (this.isSubscribed) {
        console.log(`this.isSubscribed is true`)
        console.log(`calling this.initLayers(true)`)
        this.initLayers(true);

        map.on('click', this.onClick);
        map.on('mouseenter', 'request-circles', this.onMouseEnter);

        map.once('idle', e => {
          this.setState({ mapReady: true });
        });
      }
    });
    this.map = map;

    window.map = this.map //expose map to console

    console.log(`componentDidMount - end`)
  }

  componentWillUnmount() {
    this.isSubscribed = false;
    this.map.remove();
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log(`componentDidUpdate - start`)

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
      console.log(`initializing ncLayer`)
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
    console.log(`reset() was called`)

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

    this.map.once('idle', () => {
      console.log(`idle detected, calling updateNcId in reset()`)
      //reset councilId in redux/reducers/filter.jsx back to initial value of 'null'
      updateNcId(null); 
    })

    this.map.once('zoomend', () => {
      console.log(`zoomend detected, updating state in reset()`)
      this.setState({
        filterGeo: null,
        canReset: true,
      });
    });
  };

  // Returns an array of mapbox features at the specified point.
  getAllFeaturesAtPoint = (point) => {
    return this.map.queryRenderedFeatures(point, {
      layers: featureLayers
    });
  }

  // Returns true if a district has been selected on the map.
  hasDistrictSelected = () => !!this.state.selectedNc === true


  // Event Handlers
  onMouseEnter = e => {
    console.log('A mouseenter event occurred on a visible portion of the request-circle layer.');

    //get a list of all the map features
    const features = this.getAllFeaturesAtPoint(e.point)

    console.log(`features.length: ${features.length}`)
    
    if(features.length === 0){
      return
    }

    //has a district already been selected? if so, proceed
    if(this.hasDistrictSelected()){
      console.log(`this.hasDistrictSelected()`)
      
      for (let i = 0; i < features.length; i++) {
        // Display pop-ups only for the current district
        if (features[i].properties.council_id && this.props.selectedNcId !== features[i].properties.council_id){
          return
        }

        if (features[i].layer.id === 'request-circles') {
          console.group(`inside request-circles`)
          const { coordinates } = features[i].geometry;
          const { requestId, typeId } = features[i].properties;
          this.addPopup(coordinates, requestId);
          console.groupEnd(`inside request-circles`)
          return
        }
      }
    }    
  }

  onClick = e => {
    e.preventDefault()

    const { councils, updateNcId, getNc } = this.props;

    console.log(`in onClick(), this.state.canReset: ${this.state.canReset}`)
    console.log(`in onClick(), this.state.selectedNc: ${JSON.stringify(this.state.selectedNc)}`)
    console.log(`in onClick(), this.props.ncId: ${JSON.stringify(this.props.ncId)}`)

    // console.table(this.state.selectedNc)

    //get a list of all the map features
    const features = this.getAllFeaturesAtPoint(e.point)

    console.log(`features.length: ${features.length}`)

    //has a district already been selected? if so, proceed
    if(this.hasDistrictSelected()){
      console.log(`this.hasDistrictSelected()`)

      if(features.length === 0){
        //zoom out and reset
        console.log(`features.length === 0, therefore resetting and returning`)  
        this.reset()
        return
      }

      //show popup when zoomed into district
        for (let i = 0; i < features.length; i++) {
          feature = features[i];

          console.log(`this.props.ncId: ${this.props.ncId}`)
          console.log(`this.props.selectedNcId: ${this.props.selectedNcId}`)
          console.log(`feature.properties.council_id: ${feature.properties.council_id}`)

          if (feature.properties.council_id && this.props.selectedNcId !== feature.properties.council_id){
            //reset since pop-up is for another district
            console.log('reseting since feature.properties.council_id && this.props.selectedNcId !== feature.properties.council_id')
            this.reset()
            return
          }

          //check if coordinates clicked are for current district
          const { type, coordinates } = feature.geometry;
          if( type === "Point"){
            console.group(`${type}  detected`)
            const nc = getNc({longitude: coordinates[0], latitude: coordinates[1]})  //should update selectedNcId
            console.log(`nc: ${JSON.stringify(nc)}`)
            console.log(`feature.id: ${feature.id}`)
            console.log(`nc.council_id: ${nc.council_id}`)
            console.log(`this.state.selectedNc?.councilId: ${this.state.selectedNc?.councilId}`)

            console.groupEnd(`${type}  detected`)
            console.groupEnd(`this.hasDistrictSelected()`)
          }

          // if (feature.layer.id === 'request-circles') {
          //   console.group(`inside request-circles`)
          //   // const { coordinates } = feature.geometry;
          //   const { requestId, typeId } = feature.properties;
          //   this.addPopup(coordinates, requestId);
          //   console.groupEnd(`inside request-circles`)
          //   console.groupEnd(`this.hasDistrictSelected()`)
          //   return
          // }
      }    
      
      

    }


    if(!features.length){
      return
    }

    let feature = null;

    //loop through all the features
    for (let i = 0; i < features.length; i++) {
      feature = features[i];

      console.log(`feature.properties.council_id: ${feature.properties.council_id}`)
      console.log(`this.props.selectedNcId: ${this.props.selectedNcId}`)
      console.log(`feature.id: ${feature.id}`)
      if (feature.id ) {
        const nc = councils.find(({ councilId }) => councilId === feature.id);
        console.log(`calling this.setState({ selectedNc: ${JSON.stringify(nc)}})`)
        updateNcId(feature.id)
        this.setState({ selectedNc: nc})
      }

      console.log(`feature[${i}]: ${JSON.stringify(feature)}`)
      if (feature.layer.id === 'request-circles') {
        console.group(`inside request-circles`)
        const { coordinates } = feature.geometry;
        const { requestId, typeId } = feature.properties;
        this.addPopup(coordinates, requestId);
        console.groupEnd(`inside request-circles`)
        break
      }
      

      if (hoverables.includes(feature.layer.id) && !feature?.state.selected) {
        switch (feature.layer.id) {
          case 'nc-fills':
            console.group('inside nc-fills')
            this.setState({ address: null });         
            // console.log(`feature.properties.council_id: ${feature.properties.council_id}`)
            // console.log(`calling updateNcId(feature.properties.council_id);`)
            // updateNcId(feature.properties.council_id);
            // console.log(`feature.id: ${feature.id}`)
            // console.log(`calling this.ncLayer.selectRegion(feature.id);`)
            console.log(`calling this.ncLayer.selectRegion(${feature.id});`)
            this.ncLayer.selectRegion(feature.id);
            console.groupEnd('inside nc-fills')
            break          
          case 'cc-fills':
            console.group('inside cc-fills')
            console.log(`calling this.ccLayer.selectRegion(${feature.id});`)
            this.ccLayer.selectRegion(feature.id);
            console.groupEnd('inside cc-fills')
            break
          default:
            // return null;
        }
      }
    }
  }

  onChangeSearchTab = tab => {
    this.setState({ geoFilterType: tab });
    this.reset();
  };

  onGeocoderResult = ({ result }) => {
    const { getNc, updateNcId } = this.props;
    if (result.properties.type === GEO_FILTER_TYPES.nc) {
      this.setState({ address: null });
      updateNcId(result.id);
    } else {
      const address = result.place_name
        .split(',')
        .slice(0, -2)
        .join(', ');

      getNc({ longitude: result.center[0], latitude: result.center[1] });

      this.setState({
        address: address,
      });
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
              <FilterMenu resetMap={this.reset} />
              {
                (selectedNc || address) && <LocationDetail address={address} nc={selectedNc} />
              }

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
  getNc: PropTypes.func.isRequired,
  updateNcId: PropTypes.func.isRequired,
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
  getNc: coords => dispatch(getNcByLngLat(coords)),
  updateNcId: id => dispatch(updateNcId(id)), //sets councilId to payload(id) in redux/reducers/filters
});

// We need to specify forwardRef to allow refs on connected components.
// See https://github.com/reduxjs/react-redux/issues/1291#issuecomment-494185126
// for more info.
export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(withStyles(styles)(Map));
