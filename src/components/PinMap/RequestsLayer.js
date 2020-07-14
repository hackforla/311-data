import { REQUEST_TYPES } from '@components/common/CONSTANTS';

const REQUEST_COLORS = Object.keys(REQUEST_TYPES).reduce((p, c) => {
  return [...p, c, REQUEST_TYPES[c].color]
}, []);

// put layer underneath this layer (from original mapbox tiles)
// so you don't cover up important labels
const BEFORE_ID = 'poi-label';

export default function RequestsLayer({ map, sourceData, }) {
  map.addSource('requests', {
    type: 'geojson',
    data: sourceData
  });

  map.addLayer({
    id: 'request-circles',
    type: 'circle',
    source: 'requests',
    paint: {
      'circle-radius': {
        'base': 1.75,
        'stops': [
          [10, 2],
          [15, 10]
        ],
      },
      'circle-color': [
        'match',
        ['get', 'type'],
        ...REQUEST_COLORS,
        '#FFFFFF'
      ],
      'circle-opacity': 0.8
    }
  }, BEFORE_ID);

  map.addLayer({
    id: 'request-heatmap',
    type: 'heatmap',
    source: 'requests',
    layout: {
      visibility: 'none'
    },
    paint: {
      'heatmap-radius': 5,
    }
  }, BEFORE_ID);

  const typeFilter = selectedTypes => {
    return ['in', ['get', 'type'], ['literal', selectedTypes]];
  }

  return {
    setActiveLayer: layerName => {
      switch(layerName) {
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
    },
    setTypesFilter: selectedTypes => {
      map.setFilter('request-circles', typeFilter(selectedTypes));
      map.setFilter('request-heatmap', typeFilter(selectedTypes));
    },
    setData: requests => {
      map.getSource('requests').setData(requests);
    }
  }
}
