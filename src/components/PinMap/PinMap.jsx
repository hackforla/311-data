import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = process.env.MAPBOX_TOKEN;
import { connect } from 'react-redux';
import PropTypes from 'proptypes';
import { getPinInfoRequest } from '@reducers/data';
import { updateMapPosition } from '@reducers/ui';
import ncOverlay from '../../data/nc-boundary-2019.json';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';
import geojsonExtent from '@mapbox/geojson-extent';

/////////////////// CONSTANTS ///////////////

const REQUEST_COLORS = Object.keys(REQUEST_TYPES).reduce((p, c) => {
  return [...p, c, REQUEST_TYPES[c].color]
}, []);

///////////////////// MAP ///////////////////

class PinMap extends Component {

  activeTypes = props => {
    const active = [];
    props.requestTypes.forEach((t, idx) => {
      if (t.active)
        active.push(idx);
    });
    return active;
  }

  typeFilter = props => {
    return ['in', ['number', ['get', 'type']], ['literal', this.activeTypes(props)]];
  }

  startDateFilter = props => {
    return [">=", ['number', ['get', 'date']], props.startDate];
  }

  endDateFilter = props => {
    return ["<=", ['number', ['get', 'date']], props.endDate];
  }

  filters = props => [
    'all',
    this.typeFilter(props),
    this.startDateFilter(props),
    this.endDateFilter(props)
  ]

  getRequests = () => ({
    "type": "FeatureCollection",
    "features": this.props.pinClusters.map(cluster => ({
      "type": "Feature",
      "properties": {
        id: cluster.srnumber,
        type: cluster.requesttype,
        point_count: cluster.count
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          cluster.longitude,
          cluster.latitude
        ]
      }
    }))
  });

  updatePosition = map => {
    const { updatePosition } = this.props;
    const bounds = map.getBounds();
    const zoom = map.getZoom();
    console.log('ZOOM:', zoom);
    updatePosition({
      zoom,
      bounds: {
        _northEast: bounds.getNorthEast(),
        _southWest: bounds.getSouthWest(),
      },
    });
  }

  //// CREATE ELEMENTS ////

  createMap() {
    return new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-118.6008506, 34.0094213],
      zoom: 9,
      pitchWithRotate: false,
      dragRotate: false,
      touchZoomRotate: false
    });
  }
  //// GLOBALS ////

  map;            // the map
  hoveredNCId = null;

  //// MAP INITIALIZATION ////

  onMapLoad = map => {

    map.addSource('requests', {
      type: 'geojson',
      data: this.getRequests()
    });

    map.addSource('nc', {
      type: 'geojson',
      data: ncOverlay,
      promoteId: 'nc_id'
    });

    map.addLayer({
      id: 'nc-borders',
      source: 'nc',
      type: 'line',
      paint: {
        'line-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          '#FF0000',
          '#000'
        ]
      }
    });

    map.addLayer({
      id: 'nc-fills',
      source: 'nc',
      type: 'fill',
      layout: {},
      paint: {
        'fill-color': '#627BC1',
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.8,
          0.2
        ]
      }
    });

    map.on('moveend', event => {
      this.updatePosition(map);
      //console.log(map.getCanvas().toDataURL());
    });

    map.on('mousemove', event => {
      if (map.loaded()) {
        const features = map.queryRenderedFeatures(event.point, {
          layers: ['nc-fills']
        });

        map.getCanvas().style.cursor = features.length ? 'pointer' : '';

        if (features.length) {
          const { nc_id } = features[0].properties;
          if (nc_id === this.hoveredNCId)
            return;

          // const sourceFeatures = map.querySourceFeatures('requests', {
          //   filter: [
          //     ...this.filters(this.props),
          //     ['==', ['number', ['get', 'nc']], Number(nc_id)]
          //   ],
          //   // sourceLayer: 'requests-5K-8hyxj9',
          //   // sourceLayer: 'requests-500K-7qk8nw'
          // })
          // const counts = this.props.requestTypes.map((el, idx) => 0);
          // sourceFeatures.forEach(feat => counts[feat.properties.type] += 1)
          // console.log(counts)

          if (this.hoveredNCId) {
            map.setFeatureState(
              { source: 'nc', id: this.hoveredNCId },
              { hover: false }
            );
          }
          this.hoveredNCId = features[0].id;
          map.setFeatureState(
            { source: 'nc', id: this.hoveredNCId },
            { hover: true }
          );
        }
      }
    });

    map.on('mouseleave', 'nc-fills', () => {
      if (this.hoveredNCId) {
        map.setFeatureState(
          { source: 'nc', id: this.hoveredNCId },
          { hover: false }
        );
      }
      this.hoveredNCId = null;
    });

    map.addLayer({
      id: 'requests',
      type: 'circle',
      source: 'requests',
      paint: {
        'circle-radius': {
          'base': 1.75,
          'stops': [
            [12, 2],
            [22, 180]
          ],
        },
        'circle-color': [
          'match',
          ['get', 'type'],
          ...REQUEST_COLORS,
          '#000000'
        ],
        'circle-opacity': 0.8
      },
      // filter: this.filters(this.props)
    });

    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'requests',
      filter: ['>', ['get', 'point_count'], 1],
      paint: {
        // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 30px circles when point count is between 100 and 750
        //   * Pink, 40px circles when point count is greater than or equal to 750
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#51bbd6', 100,
          '#f1f075', 750,
          '#f28cb1'
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          10, 100,
          20, 750,
          30
        ]
      }
    });

    map.on('click', 'nc-fills', function(e) {
      const nc_id = map.queryRenderedFeatures(e.point, {
        layers: ['nc-fills']
      })[0].properties.nc_id;
      const nc = ncOverlay.features.find(el => el.properties.nc_id === nc_id);
      map.fitBounds(geojsonExtent(nc), { padding: 50 });
    });

    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'requests',
      filter: ['>', ['get', 'point_count'], 1],
      layout: {
        'text-field': '{point_count}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
      }
    });
  }

  //// LIFECYCLE ////

  componentDidMount() {
    // create elements
    this.map = this.createMap();

    // enable touch zoom (but not rotation)
    this.map.touchZoomRotate.enable();
    this.map.touchZoomRotate.disableRotation();

    // map events
    this.map.on('load', () => this.onMapLoad(this.map));

    this.updatePosition(this.map);
  }

  componentDidUpdate() {
    this.map.getSource('requests').setData(this.getRequests());
    // this.map.setFilter('requests', this.filters(this.props));
    // let p = this.props, np = nextProps;
    //
    // // if (p.requestTypes !== np.requestTypes)
    // //   this.map.setFilter('requests', ['in', ['number', ['get', 'type']], ['literal', this.activeTypes(np)]])
    //
    // if (p.startDate !== np.startDate || p.endDate !== np.endDate)
    //   this.map.setFilter('requests', [
    //     'all',
    //     // [">=", ['get', 'date'], np.startDate],
    //     // ["<=", ['get', 'date'], np.endDate]
    //     [">=", ['number', ['get', 'date']], np.startDate],
    //     ["<=", ['number', ['get', 'date']], np.endDate]
    //   ])
  }

  //// RENDER ////

  render() {
    return (
      <div className="map-container" ref={el => this.mapContainer = el} />
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getPinInfo: srnumber => dispatch(getPinInfoRequest(srnumber)),
  updatePosition: position => dispatch(updateMapPosition(position)),
  exportMap: () => dispatch(trackMapExport()),
});

const mapStateToProps = state => ({
  pinsInfo: state.data.pinsInfo,
  pinClusters: state.data.pinClusters,
  heatmap: state.data.heatmap,
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
