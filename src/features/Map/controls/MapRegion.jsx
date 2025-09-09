/* eslint-disable */

import React from 'react';
import PropTypes from 'proptypes';

const MapRegion = ({ regionName }) => {
  if (!regionName)
    return null;

  return (
    <div className="map-region-name">
      { regionName }
    </div>
  );
};

export default MapRegion;
