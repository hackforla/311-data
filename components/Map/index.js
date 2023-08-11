/* eslint-disable */

import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
  getDbRequest,
  getDbRequestSuccess,
  getDataRequest,
  getDataRequestSuccess,
  updateDateRanges,
} from '@reducers/data';
import {
  updateStartDate,
  updateEndDate,
  updateNcId,
  updateRequestTypes,
} from '@reducers/filters';
import { updateMapPosition } from '@reducers/ui';
import { trackMapExport } from '@reducers/analytics';
import { INTERNAL_DATE_SPEC } from '../common/CONSTANTS';
import { getTypeIdFromTypeName } from '@utils';
import FactModal from '@components/FactModal';
import CookieNotice from '../main/CookieNotice';
import Map from './Map';
import moment from 'moment';
import gif from '@assets/loading.gif';
import ddbh from '@utils/duckDbHelpers.js';
import DbContext from '@db/DbContext';

// We make API requests on a per-day basis. On average, there are about 4k
// requests per day, so 10k is a large safety margin.
const REQUEST_LIMIT = 10000;

const styles = (theme) => ({
  root: {
    height: `calc(100vh - ${theme.header.height} - ${theme.footer.height})`,
  },
});

class MapContainer extends React.Component {
  // Note: 'this.context' is defined using the static contextType property
  // static contextType assignment allows MapContainer to access values provided by DbContext.Provider
  static contextType = DbContext;

  constructor(props) {
    super(props);

    this.state = {
      ncCounts: null,
      ccCounts: null,
      position: props.position,
      lastUpdated: props.lastUpdated,
      selectedTypes: this.getSelectedTypes(),
    };

    // We store the raw requests from the API call here, but eventually they aremap/inde
    // converted and stored in the Redux store.
    this.rawRequests = [];
    this.isSubscribed = null;
    this.initialState = props.initialState;
    this.startTime = 0;
    this.endTime = 0;
  }

  createRequestsTable = async () => {
    const { conn } = this.context;

    // Create the 'requests' table.
    const createSQL =
      'CREATE TABLE requests AS SELECT * FROM "requests.parquet"'; // parquet

    await conn.query(createSQL);
  };

  async componentDidMount(props) {
    this.isSubscribed = true;
    this.processSearchParams();
    await this.createRequestsTable();
    await this.setData();
  }

  async componentDidUpdate(prevProps) {
    const { activeMode, pins, startDate, endDate } = this.props;
    function didDateRangeChange() {
      // Check that endDate is not null since we only want to retrieve data
      // when both the startDate and endDate are selected.
      return (
        (prevProps.startDate != startDate || prevProps.endDate != endDate) &&
        endDate != null
      );
    }
    if (
      prevProps.activeMode !== activeMode ||
      prevProps.pins !== pins ||
      didDateRangeChange()
    ) {
      await this.setData();
    }
  }

  async componentWillUnmount() {
    this.isSubscribed = false;
  }

  processSearchParams = () => {
    // Dispatch to edit Redux store with url search params
    const {
      dispatchUpdateStartDate,
      dispatchUpdateEndDate,
      dispatchUpdateTypesFilter,
    } = this.props;

    // Filter requests on time
    const dateFormat = 'YYYY-MM-DD';
    // TODO: Check if endDate > startDate
    if (
      moment(this.initialState.startDate, 'YYYY-MM-DD', true).isValid() &&
      moment(this.initialState.endDate, 'YYYY-MM-DD', true).isValid()
    ) {
      const formattedStart = moment(this.initialState.startDate).format(
        dateFormat
      );
      const formattedEnd = moment(this.initialState.endDate).format(dateFormat);
      if (formattedStart <= formattedEnd) {
        dispatchUpdateStartDate(formattedStart);
        dispatchUpdateEndDate(formattedEnd);
      }
    }

    for (let request_id = 1; request_id < 13; request_id++) {
      if (this.initialState[`rtId${request_id}`] == 'false') {
        dispatchUpdateTypesFilter(request_id);
      }
    }
  };

  /**
   * Returns the non-overlapping date ranges of A before and after B.
   * @param {string} startA The start date of range A in INTERNAL_DATE_SPEC format.
   * @param {string} endA The end date of range A in INTERNAL_DATE_SPEC format.
   * @param {string} startB The start date of range B in INTERNAL_DATE_SPEC format.
   * @param {string} endB The end date of range B in INTERNAL_DATE_SPEC format.
   * @returns An array of two elements: the first element is the non-overlapping
   * range of A before B; the second is the non-overlapping range of A after B.
   * Each element can be null if there is no non-overlappping range.
   */
  getNonOverlappingRanges = (startA, endA, startB, endB) => {
    var leftNonOverlap = null;
    var rightNonOverlap = null;
    const momentStartA = moment(startA);
    const momentEndA = moment(endA);
    const momentStartB = moment(startB);
    const momentEndB = moment(endB);

    // If date range A starts before date range B, then it has a subrange that
    // does not overlap with B.
    if (momentStartA < momentStartB) {
      // For the left side, we want to choose the earlier of (startB, endA).
      // If startB is earlier than endA, that means A and B overlap, so we
      // subtract 1 day from startB, since it's already included in A.
      const leftNonOverlapEnd =
        momentStartB < momentEndA
          ? momentStartB.subtract(1, 'days')
          : momentEndA;
      leftNonOverlap = [startA, leftNonOverlapEnd.format(INTERNAL_DATE_SPEC)];
    }
    // If date range A ends after date range B, then it has a subrange that does
    // not overlap with B.
    if (momentEndB < momentEndA) {
      var rightNonOverlapStart =
        momentEndB < momentStartA ? momentStartA : momentEndB.add(1, 'days');
      rightNonOverlap = [rightNonOverlapStart.format(INTERNAL_DATE_SPEC), endA];
    }
    return [leftNonOverlap, rightNonOverlap];
  };

  /**
   * Returns the missing date ranges of a new date range against the existing
   * date ranges in the Redux store.
   *
   * In our Redux store, we keep track of date ranges that we already have 311
   * requests for. When the user changes the date range, we need to check
   * whether we need to retrieve more data; if we do, we only want to pull the
   * data from the date ranges that aren't already in the store.
   *
   * @param {string} startDate The start date in INTERNAL_DATE_SPEC format.
   * @param {string} endDate The end date in INTERNAL_DATE_SPEC format.
   * @returns An array of date ranges, where each date range is represented as
   * an array of string start and end dates.
   */
  getMissingDateRanges = (startDate, endDate) => {
    const { dateRangesWithRequests } = this.props;
    var missingDateRanges = [];
    var currentStartDate = startDate;
    var currentEndDate = endDate;
    // Compare the input date range with each date range with requests, which
    // are ordered chronologically from first to last. Every left non-overlapping
    // date range (i.e., a portion of the input date range that comes before the
    // existing date range with requests) is immediately added to the list of
    // missing date ranges. Otherwise, if there is overlap on the left (i.e.,
    // the input range is covered on the left side by the date range with
    // requests), we push the start date for our input range forward to the end
    // of the date range with requests. The process continues for every date
    // range with requests.
    // It stops when the input date range is covered on the right side.
    for (let dateRange of dateRangesWithRequests.values()) {
      const nonOverlappingRanges = this.getNonOverlappingRanges(
        currentStartDate,
        currentEndDate,
        dateRange[0],
        dateRange[1]
      );
      if (nonOverlappingRanges[0] !== null) {
        missingDateRanges.push(nonOverlappingRanges[0]);
      }
      if (nonOverlappingRanges[1] === null) {
        return missingDateRanges;
      }
      currentStartDate = nonOverlappingRanges[1][0];
      currentEndDate = nonOverlappingRanges[1][1];
    }
    missingDateRanges.push([currentStartDate, currentEndDate]);
    return missingDateRanges;
  };

  /**
   * Returns the updated date ranges given the date ranges that we just pulled
   * data for.
   * @param {Array} newDateRanges The new date ranges that we just pulled data for.
   * @returns The updated, complete array of date ranges for which we have data
   * in the Redux store.
   */
  resolveDateRanges = (newDateRanges) => {
    const { dateRangesWithRequests } = this.props;
    var allDateRanges = dateRangesWithRequests.concat(newDateRanges);
    // Sort date ranges by startDate. Since newDateRanges was retrieved using
    // getMissingDateRanges, there should be no overlapping date ranges in the
    // allDateRanges.
    const sortedDateRanges = allDateRanges.sort(function (
      dateRangeA,
      dateRangeB
    ) {
      return moment(dateRangeA[0]) - moment(dateRangeB[0]);
    });
    var resolvedDateRanges = [];
    var currentStart = null;
    var currentEnd = null;
    for (const dateRange of sortedDateRanges) {
      if (currentStart === null) {
        currentStart = dateRange[0];
        currentEnd = dateRange[1];
        continue;
      }
      // Check if the current date range is adjacent to the next date range.
      if (
        moment(currentEnd).add(1, 'days').valueOf() ===
        moment(dateRange[0]).valueOf()
      ) {
        // Extend the current date range to include the next date range.
        currentEnd = dateRange[1];
      } else {
        resolvedDateRanges.push([currentStart, currentEnd]);
        currentStart = dateRange[0];
        currentEnd = dateRange[1];
      }
    }
    if (currentStart !== null) {
      resolvedDateRanges.push([currentStart, currentEnd]);
    }
    return resolvedDateRanges;
  };

  /**
   * Gets all the dates within a given date range.
   * @param {string} startDate A date in INTERNAL_DATE_SPEC format.
   * @param {string} endDate A date in INTERNAL_DATE_SPEC format.
   * @returns An array of string dates in INTERNAL_DATE_SPEC format, including
   * the end date.
   */
  getDatesInRange = (startDate, endDate) => {
    var dateArray = [];
    var currentDateMoment = moment(startDate, INTERNAL_DATE_SPEC);
    const endDateMoment = moment(endDate, INTERNAL_DATE_SPEC);
    while (currentDateMoment <= endDateMoment) {
      dateArray.push(currentDateMoment.format(INTERNAL_DATE_SPEC));
      currentDateMoment = currentDateMoment.add(1, 'days');
    }
    return dateArray;
  };

  getAllRequests = async (startDate, endDate) => {
    try {
      const { conn } = this.context;

      // Execute a SELECT query from 'requests' table
      const selectSQL = `SELECT * FROM requests WHERE CreatedDate between '${startDate}' and '${endDate}'`;

      const requestsAsArrowTable = await conn.query(selectSQL);

      const requests = ddbh.getTableData(requestsAsArrowTable);

      this.endTime = performance.now(); // end bnechmark

      console.log(
        `Time taken to bootstrap db: ${this.endTime - this.startTime}ms`
      );
      return requests;
    } catch (e) {
      console.error(e);
    }
  };

  setData = async () => {
    const { startDate, endDate, dispatchGetDbRequest, dispatchGetDataRequest } =
      this.props;
    const missingDateRanges = this.getMissingDateRanges(startDate, endDate);
    if (missingDateRanges.length === 0) {
      return;
    }
    dispatchGetDataRequest(); // set isMapLoading in redux stat.data to true
    dispatchGetDbRequest(); // set isDbLoading in redux state.data to true
    this.rawRequests = await this.getAllRequests(startDate, endDate);

    if (this.isSubscribed) {
      const {
        dispatchGetDataRequestSuccess,
        dispatchGetDbRequestSuccess,
        dispatchUpdateDateRanges,
      } = this.props;
      const convertedRequests = this.convertRequests(this.rawRequests);
      // load map features/requests upon successful map load
      dispatchGetDataRequestSuccess(convertedRequests);
      // set isDbLoading in redux state.data to false
      dispatchGetDbRequestSuccess();
      const newDateRangesWithRequests =
        this.resolveDateRanges(missingDateRanges);
      dispatchUpdateDateRanges(newDateRangesWithRequests);
    }
  };

  convertRequests = (requests) =>
    requests.map((request) => {
      // Be careful, request properties are case-sensitive
      return {
        type: 'Feature',
        properties: {
          requestId: request.SRNumber,
          typeId: getTypeIdFromTypeName(request.RequestType),
          closedDate: request.ClosedDate,
          // Store this in milliseconds so that it's easy to do date comparisons
          // using Mapbox GL JS filters.
          createdDateMs: moment(request.CreatedDate).valueOf(),
        },
        geometry: {
          type: 'Point',
          coordinates: [request.Longitude, request.Latitude],
        },
      };
    });

  // TODO: fix this
  getSelectedTypes = () => {
    const { requestTypes } = this.props;
    // return Object.keys(requestTypes).filter(type => {
    //   return type !== 'All' && requestTypes[type]
    // });
    return requestTypes;
  };

  render() {
    const {
      position,
      lastUpdated,
      dispatchUpdateMapPosition,
      dispatchTrackMapExport,
      classes,
      requests,
      isMapLoading,
      isDbLoading,
    } = this.props;
    const { ncCounts, ccCounts, selectedTypes } = this.state;
    return (
      <div className={classes.root}>
        <Map
          requests={requests}
          ncCounts={ncCounts}
          ccCounts={ccCounts}
          position={position}
          lastUpdated={lastUpdated}
          updatePosition={dispatchUpdateMapPosition}
          exportMap={dispatchTrackMapExport}
          selectedTypes={selectedTypes}
          initialState={this.initialState}
        />
        <CookieNotice />
        {(isDbLoading || isMapLoading) && (
          <>
            <FactModal isLoading={isMapLoading} />
            <img
              style={{
                width: window.innerWidth,
                height: 16,
                position: 'absolute',
              }}
              src={gif}
            />
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  pins: state.data.pins,
  position: state.ui.map,
  lastUpdated: state.metadata.lastPulledLocal,
  activeMode: state.ui.map.activeMode,
  requestTypes: state.filters.requestTypes,
  startDate: state.filters.startDate,
  endDate: state.filters.endDate,
  requests: state.data.requests,
  dateRangesWithRequests: state.data.dateRangesWithRequests,
  isMapLoading: state.data.isMapLoading,
  isDbLoading: state.data.isDbLoading,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchUpdateMapPosition: (position) =>
    dispatch(updateMapPosition(position)),
  dispatchTrackMapExport: () => dispatch(trackMapExport()),
  dispatchGetDbRequest: () => dispatch(getDbRequest()),
  dispatchGetDbRequestSuccess: (data) => dispatch(getDbRequestSuccess()),
  dispatchGetDataRequest: () => dispatch(getDataRequest()),
  dispatchGetDataRequestSuccess: (data) =>
    dispatch(getDataRequestSuccess(data)),
  dispatchUpdateDateRanges: (dateRanges) =>
    dispatch(updateDateRanges(dateRanges)),
  dispatchUpdateStartDate: (startDate) => dispatch(updateStartDate(startDate)),
  dispatchUpdateEndDate: (endDate) => dispatch(updateEndDate(endDate)),
  dispatchUpdateNcId: (id) => dispatch(updateNcId(id)),
  dispatchUpdateTypesFilter: (type) => dispatch(updateRequestTypes(type)),
});

MapContainer.propTypes = {};

MapContainer.defaultProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(MapContainer));
