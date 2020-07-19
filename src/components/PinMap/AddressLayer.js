import {
  emptyGeo,
  makeGeoCircle,
  makeGeoMask,
  boundingBox
} from './utils';

const FIT_BOUNDS_PADDING = {
  top: 65,
  bottom: 65,
  left: 300,
  right: 300
};

export default function AddressLayer({ map, onDragEnd, onSetCenter }) {
  let canvas = map.getCanvasContainer();
  let offset;
  let center;

  map.addSource('shed', {
    type: 'geojson',
    data: null
  });

  map.addSource('shed-mask', {
    type: 'geojson',
    data: null
  });

  map.addLayer({
    id: 'shed-border',
    type: 'line',
    source: 'shed',
    layout: {
      visibility: 'visible'
    },
    paint: {
      'line-width': 1.0,
      'line-color': '#FFFFFF',
      // 'line-opacity': [
      //   'interpolate',
      //   ['linear'],
      //   ['zoom'],
      //   10, 1,
      //   13, 0.5
      // ]
    }
  });

  map.addLayer({
    id: 'shed-fill',
    type: 'fill',
    source: 'shed',
    layout: {
      visibility: 'visible'
    },
    paint: {
      'fill-color': 'transparent',
      // 'fill-opacity': 0.2
    }
  });

  map.addLayer({
    id: 'shed-mask-fill',
    type: 'fill',
    source: 'shed-mask',
    layout: {
      visibility: 'visible'
    },
    paint: {
      'fill-color': '#FFFFFF',
      'fill-opacity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        10, 0,
        13, 0.2
      ],
    }
  });

  map.on('mouseenter', 'shed-fill', e => {
    // map.setPaintProperty('shed-fill', 'fill-color', '#FFFFFF');
    canvas.style.cursor = 'move';
  });

  map.on('mouseleave', 'shed-fill', e => {
    // map.setPaintProperty('shed-fill', 'fill-color', 'transparent');
    canvas.style.cursor = '';
  });

  const onMove = e => {
    const { lng, lat } = e.lngLat;
    center = {
      lng: lng - offset.lng,
      lat: lat - offset.lat
    };

    const circle = makeGeoCircle(center);
    map.getSource('shed').setData(circle);
    map.getSource('shed-mask').setData(makeGeoMask(circle));
    canvas.style.cursor = 'grabbing';
  };

  const onUp = e => {
    const { lng, lat } = e.lngLat;
    center = {
      lng: lng - offset.lng,
      lat: lat - offset.lat
    };

    const circle = makeGeoCircle(center);
    map.getSource('shed').setData(circle);
    map.getSource('shed-mask').setData(makeGeoMask(circle));
    onDragEnd({ geo: circle, center });

    map.off('mousemove', onMove);
    map.off('touchmove', onMove);
    canvas.style.cursor = '';
  }

  map.on('mousedown', 'shed-fill', e => {
    e.preventDefault();

    offset = {
      lng: e.lngLat.lng - center.lng,
      lat: e.lngLat.lat - center.lat,
    };

    map.on('mousemove', onMove);
    map.once('mouseup', onUp);
    canvas.style.cursor = 'grab';
  });

  map.on('touchstart', 'shed-fill', e => {
    if (e.points.length !== 1) return;

    e.preventDefault();

    map.on('touchmove', onMove);
    map.once('touchend', onUp);
  });

  const removeMask = () => {
    // NOTE: make empty geojson a constant somewhere and use instead of this
    map.getSource('shed').setData(emptyGeo());
    map.getSource('shed-mask').setData(emptyGeo());
  }

  return {
    show: () => {
      map.setLayoutProperty('shed-border', 'visibility', 'visible');
      map.setLayoutProperty('shed-fill', 'visibility', 'visible');
      map.setLayoutProperty('shed-mask-fill', 'visibility', 'visible');
    },
    hide: () => {
      map.setLayoutProperty('shed-border', 'visibility', 'none');
      map.setLayoutProperty('shed-fill', 'visibility', 'none');
      map.setLayoutProperty('shed-mask-fill', 'visibility', 'none');

      removeMask();
    },
    removeMask,
    setCenter: (lngLat, cb) => {
      center = lngLat;

      const circle = makeGeoCircle(center);
      map.getSource('shed').setData(circle);
      map.getSource('shed-mask').setData(makeGeoMask(circle));
      map.fitBounds(boundingBox(circle), { padding: FIT_BOUNDS_PADDING });
      map.once('idle', () => cb(circle));
    },
    setRadius: miles => {
      console.log('to be implemented');
    }
  };
}
