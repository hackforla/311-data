import React from 'react';
import PropTypes from 'proptypes';

const MapMeta = ({ position: { zoom } }) => (
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

export default MapMeta;
