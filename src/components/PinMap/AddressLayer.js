
import geojsonExtent from '@mapbox/geojson-extent';
import { circle as turfCircle } from '@turf/turf';

function makeCircle(center, radius=1, opts={ units: 'miles' }) {
  return turfCircle([center.lng, center.lat], radius, opts);
}

export default function AddressLayer({ map, onSelectRegion }) {
  let canvas = map.getCanvasContainer();
  let offset;
  let center = map.getCenter();

  let circle = makeCircle(center);
  onSelectRegion(circle);

  map.addSource('shed', {
    type: 'geojson',
    data: circle
  });

  map.addLayer({
    id: 'shed-border',
    type: 'line',
    source: 'shed',
    layout: {
      visibility: 'visible'
    },
    paint: {
      'line-width': 1.5,
      'line-color': '#FFFFFF'
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
      'fill-opacity': 0.2
    }
  });

  map.on('mouseenter', 'shed-fill', e => {
    map.setPaintProperty('shed-fill', 'fill-color', '#FFFFFF');
    canvas.style.cursor = 'move';
  });

  map.on('mouseleave', 'shed-fill', e => {
    map.setPaintProperty('shed-fill', 'fill-color', 'transparent');
    canvas.style.cursor = '';
  });

  const onMove = e => {
    const { lng, lat } = e.lngLat;
    center = {
      lng: lng - offset.lng,
      lat: lat - offset.lat
    };

    const circle = makeCircle(center);
    map.getSource('shed').setData(circle);
    canvas.style.cursor = 'grabbing';
  };

  const onUp = e => {
    const { lng, lat } = e.lngLat;
    center = {
      lng: lng - offset.lng,
      lat: lat - offset.lat
    };

    const circle = makeCircle(center);
    map.getSource('shed').setData(circle);
    onSelectRegion(circle);

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

  return {
    show: () => {
      map.setLayoutProperty('shed-border', 'visibility', 'visible');
      map.setLayoutProperty('shed-fill', 'visibility', 'visible');
    },
    hide: () => {
      map.setLayoutProperty('shed-border', 'visibility', 'none');
      map.setLayoutProperty('shed-fill', 'visibility', 'none');
    },
    setCenter: lngLat => {
      center = lngLat;

      const circle = makeCircle(center);
      map.getSource('shed').setData(circle);
      map.fitBounds(geojsonExtent(circle), { padding: 50 });
      map.once('zoomend', () => onSelectRegion(circle));
    },
    setRadius: miles => {
      console.log('to be implemented');
    }
  };
}
