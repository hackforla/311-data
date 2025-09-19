/* eslint-disable */

import React from 'react';
import { connect } from 'react-redux';
import withStyles from '@mui/styles/withStyles';
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
import LoadingModal from '../Loading/LoadingModal';
import FunFactCard from '@components/Loading/FunFactCard';
import CookieNotice from '../main/CookieNotice';
import Map from './Map';
import moment from 'moment';
import DbContext from '@db/DbContext';
import AcknowledgeModal from '../Loading/AcknowledgeModal';
import { getServiceRequestHF, getServiceRequestSocrata } from '../../utils/DataService';

const styles = (theme) => ({
  root: {
    height: `calc(100vh - ${theme.header.height} - ${theme.footer.height})`,
  },
});

const DATA_SOURCE = import.meta.env.VITE_DATA_SOURCE;


class MapContainer extends React.Component {
  // Note: 'this.context' is defined using the static contextType property
  // static contextType assignment allows MapContainer to access values provided by DbContext.Provider
  static contextType = DbContext;
  useConnQuery = async (sql) => {
    const { conn } = this.context;
    return await conn.query(sql);
  };

  constructor(props) {
    super(props);

    this.state = {
      ncCounts: null,
      ccCounts: null,
      position: props.position,
      lastUpdated: props.lastUpdated,
      selectedTypes: this.getSelectedTypes(),
      acknowledgeModalShown: false,
      isTableLoading: false,
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
    this.setState({ isTableLoading: true });
    const {tableNameByYear, setDbStartTime } = this.context;
    const startDate = this.props.startDate; // directly use the startDate prop transformed for redux store
    const year = moment(startDate).year(); // extract the year
    const datasetFileName = `requests${year}.parquet`;

    // Create the year data table if not exist already
    const createSQL =
      `CREATE TABLE IF NOT EXISTS ${tableNameByYear} AS SELECT * FROM "${datasetFileName}"`; // query from parquet

    const startTime = performance.now(); // start the time tracker
    setDbStartTime(startTime)

      try {
        await this.useConnQuery(createSQL);
        const endTime = performance.now() // end the timer
        console.log(`Dataset registration & table creation (by year) time: ${Math.floor(endTime - startTime)} ms.`);
      } catch (error) {
        console.error("Error in creating table or registering dataset:", error);
      } finally {
        this.setState({ isTableLoading: false});
      }
  };

  async componentDidMount(props) {
    this.isSubscribed = true;
    this.processSearchParams();
    if (DATA_SOURCE !== 'SOCRATA') await this.createRequestsTable();
    await this.setData();
  }

  async componentDidUpdate(prevProps) {
    const { activeMode, startDate, endDate, councilId } = this.props;
    // create conditions to check if year or startDate or endDate changed
    const yearChanged = moment(prevProps.startDate).year() !== moment(startDate).year();
    const startDateChanged = prevProps.startDate !== startDate;
    const endDateChanged = prevProps.endDate !== endDate;

    // Check that endDate is not null since we only want to retrieve data
    // when both the startDate and endDate are selected.
    const didDateRangeChange = (yearChanged || startDateChanged || endDateChanged) && endDate !== null;

    if (prevProps.activeMode !== activeMode || prevProps.councilId !== councilId || didDateRangeChange) {
      if (DATA_SOURCE !== 'SOCRATA') await this.createRequestsTable();
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

  // To handle cross-year date ranges, we check if the startDate and endDate year are the same year
  // if same year, we simply query from that year's table
  // if different years, we query both startDate year and endDate year, then union the result

  async getAllRequests(startDate, endDate) {
    let dataRequest;
    if (DATA_SOURCE === 'SOCRATA') {
      dataRequest = await getServiceRequestSocrata();
    } else {
      dataRequest = await getServiceRequestHF(this.useConnQuery, startDate, endDate);
    }
    return dataRequest;
  }


  setData = async () => {
    const { startDate, endDate, dispatchGetDbRequest, dispatchGetDataRequest } =
      this.props;
    const missingDateRanges = this.getMissingDateRanges(startDate, endDate);
    if (missingDateRanges.length === 0) {
      return;
    }
    dispatchGetDataRequest(); // set isMapLoading in redux stat.data to true
    dispatchGetDbRequest(); // set isDbLoading in redux state.data to true
    this.rawRequests = await this.getAllRequests(startDate, endDate) || [];

    if (this.isSubscribed) {
      const {
        dispatchGetDataRequestSuccess,
        dispatchGetDbRequestSuccess,
        dispatchUpdateDateRanges,
      } = this.props;
      let requests;
      /*
      Another area to revisit later to toggle between Socrata vs HF data
      if (DATA_SOURCE !== 'SOCRATA') {
        const convertedRequests = this.convertRequests(this.rawRequests);
        // load map features/requests upon successful map load
        requests = convertedRequests;
        } else {
          requests = this.rawRequests;
      }
      dispatchGetDataRequestSuccess(requests);
      */
     // set isDbLoading in redux state.data to false
      requests = this.convertRequests(this.rawRequests);
      dispatchGetDataRequestSuccess(requests);
      dispatchGetDbRequestSuccess();
      const newDateRangesWithRequests =
        this.resolveDateRanges(missingDateRanges);
      dispatchUpdateDateRanges(newDateRangesWithRequests);
    }
  };

  convertRequests = (requests) =>
    requests.map((request) => {
      // Be careful, request properties are case-sensitive
      const lon = request.Longitude ?? request.longitude;
      const lat = request.Latitude ?? request.latitude;
      const closedDate = Math.floor(moment(request.ClosedDate ?? request.closeddate).valueOf() / 1000);
      const typeId = getTypeIdFromTypeName(request.RequestType ?? request.requesttype);
      const requestId = request.SRNumber ?? request.srnumber
      const createdDateMs = Math.floor(moment(request.CreatedDate ?? request.createddate).valueOf() / 1000);
      return {
        type: 'Feature',
        properties: {
          requestId,
          typeId,
          closedDate,
          // Store this in milliseconds so that it's easy to do date comparisons
          // using Mapbox GL JS filters.
          createdDateMs
        },
        geometry: {
          type: 'Point',
          coordinates: [lon, lat],
        },
      };
    });

  // TODO: fix this
  //? Fix what? Need to leave more detailed comments.
  getSelectedTypes = () => {
    const { requestTypes } = this.props;
    return requestTypes;
  };

  onClose = () => {
    this.state.acknowledgeModalShown = true;
  }

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
    const { ncCounts, ccCounts, selectedTypes, acknowledgeModalShown, isTableLoading } = this.state;
    
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
        {
          window.location.hash == '#/map' && (
            (isDbLoading || isMapLoading || isTableLoading) ? (
              <>
                <LoadingModal />
                <FunFactCard />
              </>
            ) : (acknowledgeModalShown === false) ? (
              <AcknowledgeModal onClose={this.onClose}/>
            ) : null
          )
        }
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
	councilId: state.filters.councilId,
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

// connect MapContainer to Redux store
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(MapContainer));
