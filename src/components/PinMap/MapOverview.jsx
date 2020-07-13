import React from 'react';
import PropTypes from 'proptypes';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';

const BarChart = ({ selectedRequests }) => {
  const max = Math.max(...Object.values(selectedRequests));
  return (
    Object.keys(selectedRequests).map(type => {
      return (
        <div key={type}>
          <div className="info-heading">
            { type } ({selectedRequests[type]})
          </div>
          <div
            className="count-bar"
            style={{
              backgroundColor: REQUEST_TYPES[type].color,
              width: 100 * (selectedRequests[type] / max) + '%'
            }}
          />
        </div>
      )
    })
  );
}

const MapOverview = ({ regionName, selectedRequests }) => {
  return (
    <div className="map-request-filters map-control">
      <div className="requests-title">
        Open 311 Requests
      </div>
      <div className="info-heading">
        Date
      </div>
      <div className="info-content">
        July 8th, 2020
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
        { Object.values(selectedRequests).reduce((p,c) => p + c, 0) }
      </div>
      <BarChart selectedRequests={selectedRequests} />
    </div>
  );
};

MapOverview.propTypes = {
  regionName: PropTypes.string,
  selectedRequests: PropTypes.shape({})
};

MapOverview.defaultProps = {
  regionName: 'All of Los Angeles',
  selectedRequests: {}
};

export default MapOverview;
