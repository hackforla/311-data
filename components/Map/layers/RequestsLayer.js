/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { INTERNAL_DATE_SPEC } from '../../common/CONSTANTS';
import moment from 'moment';

// put layer underneath this layer (from original mapbox tiles)
// so you don't cover up important labels
const BEFORE_ID = 'poi-label';

// Key for type id in store.data.requests.
const TYPE_ID = 'typeId';
// Key for closed date in store.data.requests.
const CLOSED_DATE = 'closedDate';

// Constants required for Mapbox filtering.
const LITERAL = 'literal';
const GET = 'get';

const WHITE_HEX = '#FFFFFF';

function circleColors(requestTypes) {
  const colors = [];
  requestTypes.forEach(type => colors.push(type.typeId, type.color))
  return [
    'match',
    [GET, TYPE_ID],
    ...colors,
    WHITE_HEX,
  ];
}

/**
 * Gets a MapBox GL JS filter specification to filter request types.
 * 
 * @param {Object} selectedTypes A mapping of k:v, where k is an str request
 * type, and v is a boolean indicating whether the request type is selected.
 * @return {Array} A Mapbox GL JS filter specification that filters out the
 * unselected types.
 */
function typeFilter(selectedTypes) {
  // Get an array of int typeIds corresponding value in selectedTypes is true.
  var trueTypes = Object.keys(selectedTypes).map((type) => parseInt(type)).filter((type) => selectedTypes[type]);
  return [
    'in',
    [GET, TYPE_ID],
    [LITERAL, trueTypes]
  ];
}

/**
 * Gets a MapBox GL JS filter specification to filter request statuses.
 * 
 * @param {Object} requestStatus A mapping of k:v, where k is a request status
 * (either open or closed), and v is a boolean indicating whether the request
 * status is selected.
 * @return {Array} A Mapbox GL JS filter specification that filters out the
 * unselected statuses.
 */
function statusFilter(requestStatus) {
  if (requestStatus.open && requestStatus.closed) {
    // Hack to allow ALL requests.
    return ['==', [LITERAL, 'a'], [LITERAL, 'a']];
  }
  if (!requestStatus.open && !requestStatus.closed) {
    // Hack to filter ALL requests.
    return ['==', [LITERAL, 'a'], [LITERAL, 'b']];
  }
  if (requestStatus.open) {
    return ['==', [GET, CLOSED_DATE], [LITERAL, null]];
  }
  return ['!=', [GET, CLOSED_DATE], [LITERAL, null]];
}

/**
 * Gets a MapBox GL JS filter specification to filter requests by date range.
 * 
 * @param {string} startDate The start date, in YYYY-MM-DD format.
 * @param {string} endDate The end date, in YYYY-MM-DD format.
 * @return {Array} A Mapbox GL JS filter specification that filters out
 * requests outside of the date range.
 */
function dateFilter(startDate, endDate) {
  const startDateMs = moment(startDate, INTERNAL_DATE_SPEC).valueOf();
  // Make the end date inclusive by adding 1 day.
  const endDateMs = moment(endDate, INTERNAL_DATE_SPEC).add(1, 'days').valueOf();
  const afterStartDate = ['>=', [GET, 'createdDateMs'], [LITERAL, startDateMs]];
  const beforeEndDate = ['<=', [GET, 'createdDateMs'], [LITERAL, endDateMs]];
  return ['all', afterStartDate, beforeEndDate];
}

class RequestsLayer extends React.Component {
  constructor(props) {
    super(props);
    this.ready = false;
  }

  init = ({ map }) => {
    this.map = map;
    this.addSources();
    this.addLayers();
    this.ready = true;
  }

  componentDidUpdate(prev) {
    const {
      activeLayer,
      selectedTypes,
      requestStatus,
      requests,
      colorScheme,
      startDate,
      endDate,
    } = this.props;

    if (activeLayer !== prev.activeLayer)
      this.setActiveLayer(activeLayer);

    // Check if the selected types OR the request status OR the date range has
    // changed.
    // These filters need to be updated together, since they are
    // actually composed into a single filter.
    if (selectedTypes !== prev.selectedTypes ||
      requestStatus.open !== prev.requestStatus.open ||
      requestStatus.closed !== prev.requestStatus.closed ||
      startDate != prev.startDate ||
      endDate != prev.endDate) {
      this.setFilters(selectedTypes, requestStatus, startDate, endDate);
    }
    if (requests !== prev.requests && this.ready) {
      this.setRequests(requests);
    }
    if (colorScheme !== prev.colorScheme) {
      this.setColorScheme(colorScheme);
    }
  }

  addSources = () => {
    const { requests } = this.props;
    this.map.addSource('requests', {
      type: 'geojson',
      data: requests,
    });
  };

  addLayers = () => {
    const {
      activeLayer,
      selectedTypes,
      colorScheme,
      requestTypes,
      requestStatus,
      startDate,
      endDate,
    } = this.props;

    this.map.addLayer({
      id: 'request-circles',
      type: 'circle',
      source: 'requests',
      layout: {
        visibility: activeLayer === 'points' ? 'visible' : 'none',
      },
      paint: {
        'circle-radius': {
          'base': 1.75,
          'stops': [
            [10, 2],
            [15, 10]
          ],
        },
        'circle-color': circleColors(requestTypes),
        'circle-opacity': 0.8,
      },
      filter: this.getFilterSpec(selectedTypes, requestStatus, startDate,
        endDate),
    }, BEFORE_ID);

    // this.map.addLayer({
    //   id: 'request-heatmap',
    //   type: 'heatmap',
    //   source: 'requests',
    //   layout: {
    //     visibility: activeLayer === 'heatmap' ? 'visible' : 'none',
    //   },
    //   paint: {
    //     'heatmap-radius': 5,
    //   },
    //   filter: typeFilter(selectedTypes),
    // }, BEFORE_ID);
  };

  setActiveLayer = activeLayer => {
    switch (activeLayer) {
      case 'points':
        this.map.setLayoutProperty('request-circles', 'visibility', 'visible');
        // this.map.setLayoutProperty('request-heatmap', 'visibility', 'none');
        break;

      case 'heatmap':
        this.map.setLayoutProperty('request-circles', 'visibility', 'none');
        // this.map.setLayoutProperty('request-heatmap', 'visibility', 'visible');
        break;

      default:
        break;
    }
  };

  /**
   * Gets a MapBox GL JS filter specification.
   * 
   * @param {Object} selectedTypes A mapping of k:v, where k is an int request
   * type, and v is a boolean indicating whether the request type is selected.
   * @param {Object} requestStatus A mapping of k:v, where k is a request status
   * (either open or closed), and v is a boolean indicating whether the request
   * status is selected.
   * @param {string} startDate The start date, in YYYY-MM-DD format.
   * @param {string} endDate The end date, in YYYY-MM-DD format.
    * @return {Array} A Mapbox GL JS filter specification that filters out the
   * unselected types and statuses.
   */
  getFilterSpec = (selectedTypes, requestStatus, startDate, endDate) => {
    return ['all', typeFilter(selectedTypes), statusFilter(requestStatus),
      dateFilter(startDate, endDate)];
  };

  setFilters = (selectedTypes, requestStatus, startDate, endDate) => {
    if (this.map){
      this.map.setFilter('request-circles',
      this.getFilterSpec(selectedTypes, requestStatus, startDate, endDate));
    // Currently, we do not support heatmap. If we did, we'd want to update
    // its filter here as well.
    }
  };

  setRequests = requests => {
    this.map.getSource('requests').setData(requests);
  };

  setColorScheme = colorScheme => {
    this.map.setPaintProperty(
      'request-circles',
      'circle-color',
      circleColors(colorScheme),
    );
  };

  render() {
    return null;
  }
}

RequestsLayer.propTypes = {
  activeLayer: PropTypes.oneOf(['points', 'heatmap']),
  colorScheme: PropTypes.string,
};

RequestsLayer.defaultProps = {
  activeLayer: 'points',
  colorScheme: '',
};

const mapStateToProps = state => ({
  selectedTypes: state.filters.requestTypes,
  requestStatus: state.filters.requestStatus,
  requests: state.data.requests,
  startDate: state.filters.startDate,
  endDate: state.filters.endDate,
});

// We need to specify forwardRef to allow refs on connected components.
// See https://github.com/reduxjs/react-redux/issues/1291#issuecomment-494185126
// for more info.
export default connect(mapStateToProps, null, null, { forwardRef: true })(RequestsLayer);