/* eslint-disable */

import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { getDataRequestSuccess, updateDateRanges } from '@reducers/data';
import { updateMapPosition } from '@reducers/ui';
import { trackMapExport } from '@reducers/analytics';
import { INTERNAL_DATE_SPEC } from '../common/CONSTANTS';
import CookieNotice from '../main/CookieNotice';
// import "mapbox-gl/dist/mapbox-gl.css";
import Map from './Map';
import moment from 'moment';

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
  }

  componentDidMount() {
    this.isSubscribed = true;
    this.setData();
  }

  componentDidUpdate(prevProps) {
    const { activeMode, pins, startDate, endDate } = this.props;
    if (prevProps.activeMode !== activeMode || prevProps.pins !== pins ||
      prevProps.startDate != startDate || prevProps.endDate != endDate) {
      this.setData();
    }
  }

  componentWillUnmount() {
    this.isSubscribed = false;
  }
  
  getNonOverlappingRanges = (startA, endA, startB, endB) => {
    var leftOverlap = null;
    var rightOverlap = null;
    if (startA < startB){
      leftOverlap = [startA, startB];
    }
    if (endB < endA){
      rightOverlap = [endB, endA];
    }
    return [leftOverlap, rightOverlap];
  }

  getMissingDateRanges = (startDate, endDate) => {
    const {dateRangesWithRequests} = this.props;
    var missingDateRanges = [];
    var currentStartDate = startDate;
    var currentEndDate = endDate;
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

  resolveDateRanges = (startDate, endDate) => {
    const {dateRangesWithRequests} = this.props;
    if (dateRangesWithRequests.length === 0){
      return [[startDate, endDate]];
    }
    var newDateRanges = [];
    var currentStartDate = startDate;
    var currentEndDate = endDate;
    for (let dateRange of dateRangesWithRequests.values()){
      const nonOverlappingRanges = this.getNonOverlappingRanges(currentStartDate,
        currentEndDate, dateRange[0], dateRange[1]);
      const leftOverlap = nonOverlappingRanges[0];
      const rightOverlap = nonOverlappingRanges[1];
      if (leftOverlap === null && rightOverlap === null){
        newDateRanges.push([dateRange]);
      }
      if (leftOverlap !== null){
        currentStartDate = leftOverlap[0];
      }
      if (rightOverlap === null){
        currentEndDate = dateRange[1];
        newDateRanges.push([currentStartDate, currentEndDate]);
      }
    }
    // Only sometimes need to add this...
    newDateRanges.push([currentStartDate, currentEndDate]);
    // Sort newDateRanges by startDate.
    // Merge adjacent date ranges.
    return newDateRanges;
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
   */
  getAllRequests = async (startDate, endDate) => {
    const datesInRange = this.getDatesInRange(startDate, endDate);
    var requests = [];
    for (let i in datesInRange){
      const url = new URL(`${process.env.API_URL}/requests`);
      url.searchParams.append("start_date", datesInRange[i]);
      url.searchParams.append("end_date", datesInRange[i]);
      url.searchParams.append("limit", `${REQUEST_LIMIT}`);
      requests.push(axios.get(url));
    }
    await Promise.all(requests).then(responses => {
      responses.forEach(response => this.rawRequests.push(...response.data))
    });
  };

  setData = async () => {
    const { startDate, endDate } = this.props;

    const missingDateRanges = this.getMissingDateRanges(startDate, endDate);
    if (missingDateRanges.length !== 0){
      this.rawRequests = [];
      for (let i in missingDateRanges){
        await this.getAllRequests(missingDateRanges[i][0], missingDateRanges[i][1]);
      }
    }

    if (this.isSubscribed) {
      const { getDataSuccess, updateDateRangesWithRequests } = this.props;
      getDataSuccess(this.convertRequests(this.rawRequests));
      const newDateRangesWithRequests = this.resolveDateRanges(startDate, endDate);
      updateDateRangesWithRequests(newDateRangesWithRequests);
    }
  };

  convertRequests = requests => ({
    type: 'FeatureCollection',
    features: requests.map(request => ({
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
    const { position, lastUpdated, updatePosition, exportMap, classes, requests } = this.props;
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
        />
        <CookieNotice />
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
});

const mapDispatchToProps = dispatch => ({
  updatePosition: position => dispatch(updateMapPosition(position)),
  exportMap: () => dispatch(trackMapExport()),
  getDataSuccess: data => dispatch(getDataRequestSuccess(data)),
  updateDateRangesWithRequests: dateRanges => dispatch(updateDateRanges(dateRanges)),
});

MapContainer.propTypes = {};

MapContainer.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MapContainer));
