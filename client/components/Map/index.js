/* eslint-disable */

import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { getDataRequest, getDataRequestSuccess, updateDateRanges } from '@reducers/data';
import { updateStartDate, updateEndDate, updateNcId, updateRequestTypes} from '@reducers/filters'
import { updateMapPosition } from '@reducers/ui';
import { trackMapExport } from '@reducers/analytics';
import { INTERNAL_DATE_SPEC } from '../common/CONSTANTS';
import CookieNotice from '../main/CookieNotice';
// import "mapbox-gl/dist/mapbox-gl.css";
import Map from './Map';
import moment from 'moment';
import gif from '@assets/loading.gif'

// We make API requests on a per-day basis. On average, there are about 4k
// requests per day, so 10k is a large safety margin.
const REQUEST_LIMIT = 10000;

const styles = theme => ({
  root: {
    height: `calc(100vh - ${theme.header.height} - ${theme.footer.height})`,
  },
})

class MapContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ncCounts: null,
      ccCounts: null,
      position: props.position,
      lastUpdated: props.lastUpdated,
      selectedTypes: this.getSelectedTypes(),
    }

    // We store the raw requests from the API call here, but eventually they are
    // converted and stored in the Redux store.
    this.rawRequests = [];
    this.isSubscribed = null;

    this.initialState = props.initialState
  }

  componentDidMount(props) {
    this.processSearchParams()
    this.isSubscribed = true;
    this.setData();
  }

  componentDidUpdate(prevProps) {
    const { activeMode, pins, startDate, endDate } = this.props;
    function didDateRangeChange() {
      // Check that endDate is not null since we only want to retrieve data
      // when both the startDate and endDate are selected.
      return (prevProps.startDate != startDate || prevProps.endDate != endDate) && endDate != null;
    }
    if (prevProps.activeMode !== activeMode || prevProps.pins !== pins ||
      didDateRangeChange()) {
      this.setData();
    }
  }

  componentWillUnmount() {
    this.isSubscribed = false;
  }
  

  processSearchParams = () => {
    // Dispatch to edit Redux store with url search params
    const { dispatchUpdateStartDate, dispatchUpdateEndDate, dispatchUpdateTypesFilter } = this.props;

    // Filter requests on time
    const dateFormat = 'YYYY-MM-DD';
    // TODO: Check if endDate > startDate
    if (moment(this.initialState.startDate, 'YYYY-MM-DD', true).isValid() && moment(this.initialState.endDate, 'YYYY-MM-DD',true).isValid()){
      const formattedStart = moment(this.initialState.startDate).format(dateFormat);
      const formattedEnd = moment(this.initialState.endDate).format(dateFormat);
      if (formattedStart <= formattedEnd){
        dispatchUpdateStartDate(formattedStart);
        dispatchUpdateEndDate(formattedEnd);
      }
    }

    for(let request_id = 1; request_id < 13; request_id++){
      if (this.initialState[`rtId${request_id}`] == 'false'){
        dispatchUpdateTypesFilter(request_id);
      }
    }

  }

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
    if (momentStartA < momentStartB){
      // For the left side, we want to choose the earlier of (startB, endA).
      // If startB is earlier than endA, that means A and B overlap, so we
      // subtract 1 day from startB, since it's already included in A.
      const leftNonOverlapEnd = momentStartB < momentEndA ? momentStartB.subtract(1, 'days') : momentEndA;
      leftNonOverlap = [startA,
        leftNonOverlapEnd.format(INTERNAL_DATE_SPEC)];
    }
    // If date range A ends after date range B, then it has a subrange that does
    // not overlap with B.
    if (momentEndB < momentEndA){
      var rightNonOverlapStart = momentEndB < momentStartA ? momentStartA : momentEndB.add(1, 'days'); 
      rightNonOverlap = [rightNonOverlapStart.format(INTERNAL_DATE_SPEC),
        endA];
    }
    return [leftNonOverlap, rightNonOverlap];
  }

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
    const {dateRangesWithRequests} = this.props;
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
    for (let dateRange of dateRangesWithRequests.values()){
      const nonOverlappingRanges = this.getNonOverlappingRanges(currentStartDate,
        currentEndDate, dateRange[0], dateRange[1]);
      if (nonOverlappingRanges[0] !== null){
        missingDateRanges.push(nonOverlappingRanges[0]);
      }
      if (nonOverlappingRanges[1] === null){
        return missingDateRanges;
      }
      currentStartDate = nonOverlappingRanges[1][0];
      currentEndDate = nonOverlappingRanges[1][1];
    }
    missingDateRanges.push([currentStartDate, currentEndDate]);
    return missingDateRanges;
  }

  /**
   * Returns the updated date ranges given the date ranges that we just pulled
   * data for.
   * @param {Array} newDateRanges The new date ranges that we just pulled data for.
   * @returns The updated, complete array of date ranges for which we have data
   * in the Redux store.
   */
  resolveDateRanges = (newDateRanges) => {
    const {dateRangesWithRequests} = this.props;
    var allDateRanges = dateRangesWithRequests.concat(newDateRanges);
    // Sort date ranges by startDate. Since newDateRanges was retrieved using
    // getMissingDateRanges, there should be no overlapping date ranges in the
    // allDateRanges.
    const sortedDateRanges = allDateRanges.sort(function(dateRangeA, dateRangeB){
      return moment(dateRangeA[0]) - moment(dateRangeB[0])});
    var resolvedDateRanges = [];
    var currentStart = null;
    var currentEnd = null;
    for (const dateRange of sortedDateRanges){
      if (currentStart === null){
        currentStart = dateRange[0];
        currentEnd = dateRange[1];
        continue;
      }
      // Check if the current date range is adjacent to the next date range.
      if (moment(currentEnd).add(1, 'days').valueOf() === moment(dateRange[0]).valueOf()){
        // Extend the current date range to include the next date range.
        currentEnd = dateRange[1];
      } else {
        resolvedDateRanges.push([currentStart, currentEnd]);
        currentStart = dateRange[0];
        currentEnd = dateRange[1];
      }
    }
    if (currentStart !== null){
      resolvedDateRanges.push([currentStart, currentEnd]);
    }
    return resolvedDateRanges;
  }

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
  }

  /**
   * Gets all requests over the time range specified in the Redux store.
   * 
   * Since the server is slow to retrieve all the requests at once, we need to
   * make multiple API calls, one for each day.
   * 
   * @param {string} startDate A date in INTERNAL_DATE_SPEC format.
   * @param {string} endDate A date in INTERNAL_DATE_SPEC format.
   * @returns An array of Promises, each representing an API request for a
   * particular day in the input date range.
   */
  getAllRequests = (startDate, endDate) => {
    const datesInRange = this.getDatesInRange(startDate, endDate);
    var requests = [];
    for (const date of datesInRange){
      const url = new URL(`${process.env.API_URL}/requests`);
      url.searchParams.append("start_date", date);
      url.searchParams.append("end_date", date);
      url.searchParams.append("limit", `${REQUEST_LIMIT}`);
      requests.push(axios.get(url));
    }
    return requests;
  };

  setData = async () => {
    const { startDate, endDate, getDataRedux } = this.props;

    const missingDateRanges = this.getMissingDateRanges(startDate, endDate);
    if (missingDateRanges.length === 0){
      return;
    }
    getDataRedux();
    this.rawRequests = [];
    var allRequestPromises = [];
    for (const missingDateRange of missingDateRanges){
      const requestPromises = this.getAllRequests(missingDateRange[0],
        missingDateRange[1]);
      allRequestPromises.push(...requestPromises);    
    }
    await Promise.all(allRequestPromises).then(responses => {
      responses.forEach(response => this.rawRequests.push(...response.data))
    });

    if (this.isSubscribed) {
      const { getDataSuccess, updateDateRangesWithRequests } = this.props;
      getDataSuccess(this.convertRequests(this.rawRequests));
      const newDateRangesWithRequests = this.resolveDateRanges(missingDateRanges);
      updateDateRangesWithRequests(newDateRangesWithRequests);
    }
  };

  convertRequests = requests => (requests.map(request => ({
      type: 'Feature',
      properties: {
        requestId: request.requestId,
        typeId: request.typeId,
        closedDate: request.closedDate,
        // Store this in milliseconds so that it's easy to do date comparisons
        // using Mapbox GL JS filters.
        createdDateMs: moment(request.createdDate).valueOf(),
      },
      geometry: {
        type: 'Point',
        coordinates: [
          request.longitude,
          request.latitude,
        ]
      }
    }))
  );

  // TODO: fix this
  getSelectedTypes = () => {
    const { requestTypes } = this.props;
    // return Object.keys(requestTypes).filter(type => {
    //   return type !== 'All' && requestTypes[type]
    // });
    return requestTypes;
  };

  render() {
    const { position, lastUpdated, updatePosition, exportMap, classes, requests,
    isMapLoading } = this.props;
    const { ncCounts, ccCounts, selectedTypes } = this.state;
    return (
      <div className={classes.root}>
        <Map
          requests={requests}
          ncCounts={ncCounts}
          ccCounts={ccCounts}
          position={position}
          lastUpdated={lastUpdated}
          updatePosition={updatePosition}
          exportMap={exportMap}
          selectedTypes={selectedTypes}
          initialState={this.initialState}
        />
        <CookieNotice />
        {isMapLoading && <img style={{ width:window.innerWidth, height: 16, position:'absolute' }} src={gif}/>}
      </div>
    );
  }
}

const mapStateToProps = state => ({
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
});

const mapDispatchToProps = dispatch => ({
  updatePosition: position => dispatch(updateMapPosition(position)),
  exportMap: () => dispatch(trackMapExport()),
  getDataRedux: () => dispatch(getDataRequest()),
  getDataSuccess: data => dispatch(getDataRequestSuccess(data)),
  updateDateRangesWithRequests: dateRanges => dispatch(updateDateRanges(dateRanges)),
  dispatchUpdateStartDate: startDate => dispatch(updateStartDate(startDate)),
  dispatchUpdateEndDate: endDate => dispatch(updateEndDate(endDate)),
  dispatchUpdateNcId: id => dispatch(updateNcId(id)),
  dispatchUpdateTypesFilter: type => dispatch(updateRequestTypes(type))
});

MapContainer.propTypes = {};

MapContainer.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MapContainer));
