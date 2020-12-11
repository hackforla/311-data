/* eslint-disable */

import React from 'react';
import PropTypes from 'proptypes';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';

const RequestsBarChart = ({ selectedRequests }) => {
  const max = Math.max(...Object.values(selectedRequests));
  return (
    <div className="requests-bar-chart">
      { Object.keys(REQUEST_TYPES).map(type => {
        if (Object.keys(selectedRequests).includes(type))
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
        else
          return null;
      })}
    </div>
  );
}

export default RequestsBarChart;
