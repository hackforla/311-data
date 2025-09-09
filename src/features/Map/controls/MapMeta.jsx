/* eslint-disable */

import React, { useEffect, useState } from 'react';
import PropTypes from 'proptypes';

const MapMeta = ({ map }) => {
  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    const onZoomEnd = () => setZoom(map.getZoom());
    map.on('zoomend', onZoomEnd);
    return () => map.off('zoomend', onZoomEnd);
  }, []);

  return (
    <div style={{
      position: 'absolute',
      zIndex: 1,
      bottom: 5,
      left: '50%',
      transform: 'translateX(-50%)',
      color: 'white',
      fontSize: 12
    }}>
      { zoom.toFixed(2) }
    </div>
  );
};

export default MapMeta;
