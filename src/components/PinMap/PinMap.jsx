import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = process.env.MAPBOX_TOKEN;
import { connect } from 'react-redux';
import PropTypes from 'proptypes';
import { getPinInfoRequest } from '@reducers/data';
import { updateMapPosition } from '@reducers/ui';
import ncBoundaries from '../../data/nc-boundary-2019.json';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';
import geojsonExtent from '@mapbox/geojson-extent';

/////////////////// CONSTANTS ///////////////

const REQUEST_COLORS = Object.keys(REQUEST_TYPES).reduce((p, c) => {
  return [...p, c, REQUEST_TYPES[c].color]
}, []);

const ZOOM_OUT_EXTENT = geojsonExtent(ncBoundaries);

///////////////////// MAP ///////////////////

class PinMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hoveredNCId: null,
      selectedNCId: null
    };

    this.map = null;
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v10',
      pitchWithRotate: false,
      dragRotate: false,
      touchZoomRotate: false
    });

    this.zoomOut(false);

    this.map.touchZoomRotate.enable();
    this.map.touchZoomRotate.disableRotation();

    this.map.on('load', () => this.onMapLoad(this.map));

    this.updatePosition(this.map);
  }

  componentDidUpdate() {
    let source = this.map.getSource('requests');
    if (source)
      source.setData(this.getRequests());
  }

  onMapLoad = map => {
    map.addSource('requests', {
      type: 'geojson',
      data: this.getRequests()
    });

    map.addSource('nc', {
      type: 'geojson',
      data: ncBoundaries,
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
    });

    map.on('mousemove', event => {
      if (map.loaded()) {
        const features = map.queryRenderedFeatures(event.point, {
          layers: ['nc-fills']
        });

        map.getCanvas().style.cursor = features.length ? 'pointer' : '';

        if (features.length) {
          const { id } = features[0];
          if (id === this.state.hoveredNCId)
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

          if (this.state.hoveredNCId) {
            map.setFeatureState(
              { source: 'nc', id: this.state.hoveredNCId },
              { hover: false }
            );
          }
          map.setFeatureState(
            { source: 'nc', id },
            { hover: true }
          );

          this.setState({ hoveredNCId: id });
        }
      }
    });

    map.on('mouseleave', 'nc-fills', () => {
      const { hoveredNCId } = this.state;
      if (hoveredNCId) {
        map.setFeatureState(
          { source: 'nc', id: hoveredNCId },
          { hover: false }
        );
        this.setState({ hoveredNCId: null })
      }
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

    map.on('click', 'nc-fills', e => {
      const nc_id = map.queryRenderedFeatures(e.point, {
        layers: ['nc-fills']
      })[0].properties.nc_id;

      if (nc_id === this.state.selectedNCId) {
        this.zoomOut();
        this.setState({ selectedNCId: null });
      } else {
        const ncGeo = ncBoundaries.features.find(el => el.properties.nc_id === nc_id);
        map.fitBounds(geojsonExtent(ncGeo), { padding: 50 });
        this.setState({ selectedNCId: nc_id });
      }
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

  zoomOut = (animate=true) => {
    this.map.fitBounds(ZOOM_OUT_EXTENT, { padding: 50, linear: true, animate });
  }

  export = () => {
    console.log(map.getCanvas().toDataURL());
  }

  //// LIFECYCLE ////



  hoveredNCName = () => {
    const { hoveredNCId } = this.state;

    if (!hoveredNCId)
      return null;

    const nc = ncBoundaries.features.find(el => el.properties.nc_id === hoveredNCId);

    return nc.properties.name;
  }

  //// RENDER ////

  render() {
    const ncName = this.hoveredNCName();
    return (
      <div className="map-container">
        <div style={{
          position: 'absolute',
          zIndex: 1,
          top: 10,
          right: 10,
          padding: 5,
          border: '1px white solid',
          backgroundColor: 'black',
          color: 'white'
        }}>
          { this.props.position.zoom && this.props.position.zoom.toFixed(4) }
        </div>
        <div style={{
          display: ncName ? 'block' : 'none',
          position: 'absolute',
          zIndex: 1,
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: 5,
          border: '1px white solid',
          backgroundColor: 'black',
          color: 'white'
        }}>
          { ncName }
        </div>
        <div style={{ width: '100%', height: '100%'}} ref={el => this.mapContainer = el} />
      </div>
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
