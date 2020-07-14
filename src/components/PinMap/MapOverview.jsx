import React from 'react';
import PropTypes from 'proptypes';
import moment from 'moment';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';
import RequestsDonut from './RequestsDonut';

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

const MapOverview = ({ date, locationInfo, selectedRequests }) => {
  return (
    <div className="map-overview map-control">
      <div className="requests-title">
        Open 311 Requests
      </div>
      <div className="info-heading">
        Date
      </div>
      <div className="info-content">
        { moment(date).format('MMMM Do, YYYY') }
      </div>
      <div className="info-heading">
        { locationInfo.name }
      </div>
      {
        locationInfo.url
          ? (
            <a className="info-content" href={locationInfo.url} target="_blank">
              { locationInfo.value }
            </a>
          ) : (
            <div className="info-content">
              { locationInfo.value }
            </div>
          )
      }
      <div className="info-heading">
        Total Requests
      </div>
      <div className="info-content">
        { Object.values(selectedRequests).reduce((p,c) => p + c, 0) }
      </div>
      {/*<BarChart selectedRequests={selectedRequests} />*/}
      <RequestsDonut selectedRequests={selectedRequests} />
    </div>
  );
};

MapOverview.propTypes = {
  date: PropTypes.string,
  locationInfo: PropTypes.shape({}),
  selectedRequests: PropTypes.shape({})
};

MapOverview.defaultProps = {
  date: undefined,
  locationInfo: {},
  selectedRequests: {}
};

export default MapOverview;
