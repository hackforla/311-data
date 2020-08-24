import React from 'react';
import PropTypes from 'proptypes';
import moment from 'moment';
import RequestsDonut from './RequestsDonut';
import RequestsBarChart from './RequestsBarChart';

const MapOverview = ({
  date,
  locationInfo,
  selectedRequests,
  colorScheme,
}) => {
  return (
    <div className="map-overview map-control">
      <div className="open-closed-requests-container">
        <a className="open-closed-requests" target="_blank">
          Open Requests
        </a>
        <a className="open-closed-requests" target="_blank">
          Closed Requests
        </a>
      </div>
      <div className="info-heading">
        Date
      </div>
      <div className="info-content">
        { moment(date).format('MMMM Do, YYYY') }
      </div>

      { locationInfo.location && (
        <>
          <div className="info-heading">Location</div>
          <div className="info-content">{ locationInfo.location }</div>
        </>
      )}

      { locationInfo.radius && (
        <>
          <div className="info-heading">Radius</div>
          <div className="info-content">{ locationInfo.radius } mile</div>
        </>
      )}

      { locationInfo.nc && (
        <>
          <div className="info-heading">Neighborhood Council</div>
          {
            locationInfo.nc.url
              ? (
                <a className="info-content" href={locationInfo.nc.url} target="_blank">
                { locationInfo.nc.name }
                </a>
              ) : (
                <div className="info-content">
                  { locationInfo.nc.name }
                </div>
              )
          }
        </>
      )}

      { locationInfo.cc && (
        <>
          <div className="info-heading">City Council</div>
          <div className="info-content">{ locationInfo.cc }</div>
        </>
      )}

      <div className="info-heading">
        Total Requests
      </div>
      <div className="info-content">
        { Object.values(selectedRequests).reduce((p,c) => p + c, 0) }
      </div>

      {/*<RequestsBarChart selectedRequests={selectedRequests} />*/}
      <RequestsDonut
        selectedRequests={selectedRequests}
        colorScheme={colorScheme}
      />
    </div>
  );
};

MapOverview.propTypes = {
  date: PropTypes.any,
  locationInfo: PropTypes.shape({}),
  selectedRequests: PropTypes.shape({}),
  colorScheme: PropTypes.string.isRequired,
};

MapOverview.defaultProps = {
  date: undefined,
  locationInfo: {},
  selectedRequests: {},
};

export default MapOverview;
