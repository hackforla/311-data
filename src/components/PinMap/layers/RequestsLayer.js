import React from 'react';
import PropTypes from 'prop-types';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';
import { getColors } from '../mapColors';

// put layer underneath this layer (from original mapbox tiles)
// so you don't cover up important labels
const BEFORE_ID = 'poi-label';

function circleColors(colorScheme) {
  const colors = getColors(colorScheme);

  const colorsArray = Object.keys(REQUEST_TYPES).reduce((p, c) => {
    return [...p, c, colors[c]];
  }, []);

  return [
    'match',
    ['get', 'type'],
    ...colorsArray,
    '#FFFFFF',
  ];
}

function typeFilter(selectedTypes) {
  return [
    'in',
    ['get', 'type'],
    ['literal', selectedTypes],
  ];
}

class RequestsLayer extends React.Component {

  componentDidUpdate(prev) {
    const {
      activeLayer,
      selectedTypes,
      requests,
      colorScheme,
    } = this.props;

    if (activeLayer !== prev.activeLayer)
      this.setActiveLayer(activeLayer);

    if (selectedTypes !== prev.selectedTypes)
      this.setSelectedTypes(selectedTypes);

    if (requests !== prev.requests)
      this.setRequests(requests);

    if (colorScheme !== prev.colorScheme)
      this.setColorScheme(colorScheme);
  }

  addSources = () => {
    const { map, requests } = this.props;
    map.addSource('requests', {
      type: 'geojson',
      data: requests
    });
  };

  addLayers = () => {
    const {
      map,
      activeLayer,
      selectedTypes,
      colorScheme,
    } = this.props;

    map.addLayer({
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
        'circle-color': circleColors(colorScheme),
        'circle-opacity': 0.8,
      },
      filter: typeFilter(selectedTypes),
    }, BEFORE_ID);

    map.addLayer({
      id: 'request-heatmap',
      type: 'heatmap',
      source: 'requests',
      layout: {
        visibility: activeLayer === 'heatmap' ? 'visible' : 'none',
      },
      paint: {
        'heatmap-radius': 5,
      },
      filter: typeFilter(selectedTypes),
    }, BEFORE_ID);
  };

  setActiveLayer = activeLayer => {
    const { map } = this.props;

    switch(activeLayer) {
      case 'points':
        map.setLayoutProperty('request-circles', 'visibility', 'visible');
        map.setLayoutProperty('request-heatmap', 'visibility', 'none');
        break;

      case 'heatmap':
        map.setLayoutProperty('request-circles', 'visibility', 'none');
        map.setLayoutProperty('request-heatmap', 'visibility', 'visible');
        break;

      default:
        break;
    }
  };

  setSelectedTypes = selectedTypes => {
    const { map } = this.props;
    map.setFilter('request-circles', typeFilter(selectedTypes));
    map.setFilter('request-heatmap', typeFilter(selectedTypes));
  };

  setRequests = requests => {
    const { map } = this.props;
    map.getSource('requests').setData(requests);
  };

  setColorScheme = colorScheme => {
    const { map } = this.props;
    map.setPaintProperty(
      'request-circles',
      'circle-color',
      circleColors(colorScheme),
    );
  };

  render() {
    return null;
  }
}

export default RequestsLayer;

RequestsLayer.propTypes = {
  activeLayer: PropTypes.oneOf(['points', 'heatmap']),
  selectedTypes: PropTypes.arrayOf(PropTypes.string),
  requests: PropTypes.shape({}),
  colorScheme: PropTypes.string,
};

RequestsLayer.defaultProps = {
  activeLayer: 'points',
  selectedTypes: [],
  requests: {},
  colorScheme: '',
};
