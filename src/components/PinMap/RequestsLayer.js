import { REQUEST_TYPES } from '@components/common/CONSTANTS';

const REQUEST_COLORS = Object.keys(REQUEST_TYPES).reduce((p, c) => {
  return [...p, c, REQUEST_TYPES[c].color]
}, []);

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
          [12, 2],
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
  });

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
  });
}
