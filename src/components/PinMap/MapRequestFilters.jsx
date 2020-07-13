import React from 'react';
import PropTypes from 'proptypes';

const MapRequestFilters = ({ regionName, requestCounts }) => {
  return (
    <div className="map-request-filters map-control">
      <div className="requests-title">
        Open 311 Requests
      </div>
      <div className="info-heading">
        Date
      </div>
      <div className="info-content">
        June 8th, 2020
      </div>
      <div className="info-heading">
        Region
      </div>
      <div className="info-content">
        { regionName }
      </div>
      <div className="info-heading">
        Total Requests
      </div>
      <div className="info-content">
        10000
      </div>
      <div className="info-heading">
        Breakdown
      </div>
      <div className="info-content">
      </div>
    </div>
  );
};

MapRequestFilters.propTypes = {
  regionName: PropTypes.string,
};

MapRequestFilters.defaultProps = {
  regionName: 'All of Los Angeles'
};

export default MapRequestFilters;
