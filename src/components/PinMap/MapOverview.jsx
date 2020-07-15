import React from 'react';
import PropTypes from 'proptypes';
import moment from 'moment';
import RequestsDonut from './RequestsDonut';
import RequestsBarChart from './RequestsBarChart';

const MapOverview = ({
  date,
  locationInfo,
  selectedRequests
}) => {
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
      {/*<RequestsBarChart selectedRequests={selectedRequests} />*/}
      <RequestsDonut selectedRequests={selectedRequests} />
    </div>
  );
};

MapOverview.propTypes = {
  date: PropTypes.any,
  locationInfo: PropTypes.shape({}),
  selectedRequests: PropTypes.shape({})
};

MapOverview.defaultProps = {
  date: undefined,
  locationInfo: {},
  selectedRequests: {}
};

export default MapOverview;
