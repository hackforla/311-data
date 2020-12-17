/* eslint-disable */

import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { updateMapDateRange } from '@reducers/mapFilters';
import clx from 'classnames';

import moment from 'moment';
import RequestsDonut from './RequestsDonut';
import RequestsBarChart from './RequestsBarChart';
import Button from '@components/common/Button';

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
  dateRange,
  startDate,
  endDate,
  updateRange,
}) => {
  const modes = [
    MAP_MODES.OPEN,
    MAP_MODES.CLOSED,
  ];

  const newDate = (mode, date, num, timeInterval) => {
    const ISOdate = new Date(date).toISOString();
    if (mode === 'prior') {
      return moment(ISOdate).subtract(num, timeInterval).format('MM/DD/YY');
    } else if (mode === 'future') {
      return moment(ISOdate).add(num, timeInterval).format('MM/DD/YY');
    }
  };

  const newRangeId = 'CUSTOM_DATE_RANGE';

  const handleLeftArrowClick = () => {
    const newStartDate = newDate('prior', startDate, 1, 'week');
    const newEndDate = newDate('prior', endDate, 1, 'week');
    updateRange({ dateRange: newRangeId, startDate: newStartDate, endDate: newEndDate });
  }

  const handleRightArrowClick = () => {
    const newStartDate = newDate('future', startDate, 1, 'week');
    const newEndDate = newDate('future', endDate, 1, 'week');
    updateRange({ dateRange: newRangeId, startDate: newStartDate, endDate: newEndDate });
  }

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
      { activeMode === MAP_MODES.OPEN &&
        <>
          <div className="info-heading">
            Date
          </div>
          <div className="info-content">
            { moment(date).format('MMMM Do, YYYY') }
          </div>
        </>
      }
      { activeMode === MAP_MODES.CLOSED &&
        <>
          <div className="info-heading">
            Dates
          </div>
          <div className="scroll-date-container">
            <a className="scroll-date" onClick={handleLeftArrowClick}>&lt;&nbsp;&nbsp;</a>
            {startDate} - {endDate}
            <a className="scroll-date" onClick={handleRightArrowClick}>&nbsp;&nbsp;&gt;</a>
          </div>
        </>
      }
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
  dateRange: state.mapFilters.dateRange,
  startDate: state.mapFilters.startDate,
  endDate: state.mapFilters.endDate,
});

const mapDispatchToProps = dispatch => ({
  setMapMode: mode => dispatch(reduxSetMapMode(mode)),
  updateRange: ({ dateRange, startDate, endDate }) => {
    dispatch(updateMapDateRange({ dateRange, startDate, endDate }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MapOverview);

MapOverview.propTypes = {
  date: PropTypes.any,
  locationInfo: PropTypes.shape({}),
  selectedRequests: PropTypes.shape({}),
  colorScheme: PropTypes.string.isRequired,
  activeMode: PropTypes.string,
  dateRange: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  setMapMode: PropTypes.func,
  updateRange: PropTypes.func,
};

MapOverview.defaultProps = {
  date: undefined,
  locationInfo: {},
  selectedRequests: {},
  activeMode: undefined,
  dateRange: undefined,
  startDate: undefined,
  endDate: undefined,
  setMapMode: () => {},
  updateRange: () => {},
};
