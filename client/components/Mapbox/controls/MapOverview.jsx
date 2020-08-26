import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import clx from 'classnames';

import moment from 'moment';
import RequestsDonut from './RequestsDonut';
import RequestsBarChart from './RequestsBarChart';

import {
  setMapMode as reduxSetMapMode,
} from '@reducers/ui';

import { MAP_MODES } from '@components/common/CONSTANTS';

const MapOverview = ({
  date,
  locationInfo,
  selectedRequests,
  colorScheme,
  setMapMode,
  activeMode,
}) => {
  const modes = [
    MAP_MODES.OPEN,
    MAP_MODES.CLOSED,
  ];

  return (
    <div className="map-overview map-control">
      <div className="open-closed-requests-container">
        {modes.map(mode => (
          <a
            key={mode}
            className={clx('map-tab', { active: mode === activeMode })}
            onClick={mode === activeMode ? undefined : () => {
              setMapMode(mode)
            }}
          >
            { mode }
          </a>
        ))}
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

const mapStateToProps = state => ({
  activeMode: state.ui.map.activeMode,
});

const mapDispatchToProps = dispatch => ({
  setMapMode: mode => dispatch(reduxSetMapMode(mode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MapOverview);

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
