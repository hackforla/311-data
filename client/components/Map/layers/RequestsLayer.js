/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// put layer underneath this layer (from original mapbox tiles)
// so you don't cover up important labels
const BEFORE_ID = 'poi-label';

function circleColors(requestTypes) {
  const colors = [];
  requestTypes.forEach(type => colors.push(type.typeId, type.color))
  return [
    'match',
    ['get', 'typeId'],
    ...colors,
    '#FFFFFF',
  ];
}

function typeFilter(selectedTypes) {
  // selectedTypes maps ints (in string form) to booleans, indicating whether the type is selected.
  // Get an array of int typeIds corresponding value in selectedTypes is true.
  var trueTypes = Object.keys(selectedTypes).map((type) => parseInt(type)).filter((type) => selectedTypes[type]);
  return [
    'in',
    ['get', 'typeId'],
    ['literal', trueTypes]
  ];
}

class RequestsLayer extends React.Component {
  constructor(props) {
    super(props);
    this.ready = false;
  }

  init = ({ map }) => {
    this.map = map;
    this.addSources();
    this.addLayers();
    this.ready = true;
  }

  componentDidUpdate(prev) {
    const {
      activeLayer,
      selectedTypes,
      requests,
      colorScheme,
    } = this.props;

    if (activeLayer !== prev.activeLayer)
      this.setActiveLayer(activeLayer);

    if (selectedTypes !== prev.selectedTypes) {
      this.setSelectedTypes(selectedTypes);
    }
    if (requests !== prev.requests && this.ready)
      this.setRequests(requests);

    if (colorScheme !== prev.colorScheme)
      this.setColorScheme(colorScheme);
  }

  addSources = () => {
    const { requests } = this.props;
    this.map.addSource('requests', {
      type: 'geojson',
      data: requests,
    });
  };

  addLayers = () => {
    const {
      activeLayer,
      selectedTypes,
      colorScheme,
      requestTypes,
    } = this.props;

    this.map.addLayer({
      id: 'request-circles',
      type: 'circle',
      source: 'requests',
      layout: {
        visibility: activeLayer === 'points' ? 'visible' : 'none',
      },
      paint: {
        'circle-radius': {
          'base': 1.75,
          'stops': [
            [10, 2],
            [15, 10]
          ],
        },
        'circle-color': circleColors(requestTypes),
        'circle-opacity': 0.8,
      },
      filter: typeFilter(selectedTypes),
    }, BEFORE_ID);

    // this.map.addLayer({
    //   id: 'request-heatmap',
    //   type: 'heatmap',
    //   source: 'requests',
    //   layout: {
    //     visibility: activeLayer === 'heatmap' ? 'visible' : 'none',
    //   },
    //   paint: {
    //     'heatmap-radius': 5,
    //   },
    //   filter: typeFilter(selectedTypes),
    // }, BEFORE_ID);
  };

  setActiveLayer = activeLayer => {
    switch (activeLayer) {
      case 'points':
        this.map.setLayoutProperty('request-circles', 'visibility', 'visible');
        // this.map.setLayoutProperty('request-heatmap', 'visibility', 'none');
        break;

      case 'heatmap':
        this.map.setLayoutProperty('request-circles', 'visibility', 'none');
        // this.map.setLayoutProperty('request-heatmap', 'visibility', 'visible');
        break;

      default:
        break;
    }
  };

  setSelectedTypes = selectedTypes => {
    this.map.setFilter('request-circles', typeFilter(selectedTypes));
    // Currently, we do not support heatmap. If we did, we'd want to update
    // its filter here as well.
  };

  setRequests = requests => {
    this.map.getSource('requests').setData(requests);
  };

  setColorScheme = colorScheme => {
    this.map.setPaintProperty(
      'request-circles',
      'circle-color',
      circleColors(colorScheme),
    );
  };

  render() {
    return null;
  }
}

RequestsLayer.propTypes = {
  activeLayer: PropTypes.oneOf(['points', 'heatmap']),
  selectedTypes: PropTypes.shape({}),
  requests: PropTypes.shape({}),
  colorScheme: PropTypes.string,
};

RequestsLayer.defaultProps = {
  activeLayer: 'points',
  selectedTypes: {},
  requests: {},
  colorScheme: '',
};

const mapStateToProps = state => ({
  selectedTypes: state.filters.requestTypes
});

// We need to specify forwardRef to allow refs on connected components.
// See https://github.com/reduxjs/react-redux/issues/1291#issuecomment-494185126
// for more info.
export default connect(mapStateToProps, null, null, { forwardRef: true })(RequestsLayer);
