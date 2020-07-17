import { REQUEST_TYPES } from '@components/common/CONSTANTS';
import { getColors } from './mapColors';

// put layer underneath this layer (from original mapbox tiles)
// so you don't cover up important labels
const BEFORE_ID = 'poi-label';

export default function RequestsLayer({ map, sourceData, addPopup, colorScheme }) {

  const getSchemeColors = scheme => {
    let colors = getColors(scheme);
    return Object.keys(REQUEST_TYPES).reduce((p, c) => {
      return [...p, c, colors[c]]
    }, []);
  }

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
        ...getSchemeColors(colorScheme),
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

  // map.on('click', 'request-circles', e => {
  //   const { coordinates } = e.features[0].geometry;
  //   const { id, type } = e.features[0].properties;
  //   const content = (
  //     '<div>' +
  //       `<div>${id}</div>` +
  //       `<div>${type}</div>` +
  //     '</div>'
  //   );
  //   addPopup(coordinates, content);
  // });
  //
  // map.on('mouseenter', 'request-circles', () => {
  //   map.getCanvas().style.cursor = 'pointer';
  // });
  //
  // map.on('mouseleave', 'request-circles', () => {
  //   map.getCanvas().style.cursor = '';
  // });

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
    },
    setColorScheme: scheme => {
      map.setPaintProperty('request-circles', 'circle-color', [
        'match',
        ['get', 'type'],
        ...getSchemeColors(scheme),
        '#FFFFFF'
      ]);
    }
  }
}
