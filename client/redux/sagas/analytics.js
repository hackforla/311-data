import Mixpanel from '@utils/Mixpanel';
import { select, call, takeLatest } from 'redux-saga/effects';

import { types as dataTypes } from '../reducers/data';
import { types as analyticsTypes } from '../reducers/analytics';
import { COUNCILS } from '../../components/common/CONSTANTS';

const events = {
  dataQuery: 'Request Query',
  comparisonQuery: 'Comparison Query',
  exportRequest: 'Export Request',
  exportComparison: 'Export Comparison',
};

/* ////////////////// FILTERS //////////////// */

const getState = (state, slice) => state[slice];

const regionCounts = COUNCILS.reduce((acc, curr) => {
  const { region } = curr;
  if (!acc[region]) {
    acc[region] = 1;
  } else {
    acc[region] += 1;
  }
  return acc;
}, {});

const countDaysBetweenDates = (startDate, endDate) => {
  const date1 = new Date(startDate);
  const date2 = new Date(endDate);
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const dateFilters = (dateRange, startDate, endDate) => {
  const filters = {
    'Time Frame': dateRange,
    'Time Frame Custom Start': false,
    'Time Frame Custom End': false,
    'Time Frame Custom Span': false,
  };

  if (dateRange === 'CUSTOM_DATE_RANGE') {
    const customStartDate = new Date(startDate).toISOString();
    const customEndDate = new Date(endDate).toISOString();
    filters['Time Frame Custom Start'] = customStartDate;
    filters['Time Frame Custom End'] = customEndDate;
    filters['Time Frame Custom Span'] = countDaysBetweenDates(customStartDate, customEndDate);
  }

  return filters;
};

const councilAreaFilters = councils => {
  const filters = {
    Areas: [],
    'Areas Fully Selected': [],
  };
  const regions = { ...regionCounts };

  councils.forEach(name => {
    const region = COUNCILS.find(nc => nc.name === name)?.region;
    regions[region] -= 1;

    if (!filters.Areas.includes(region)) {
      filters.Areas.push(region);
    } else if (!regions[region]) {
      filters['Areas Fully Selected'].push(region);
    }
  });

  return filters;
};

const comparisonSetFilters = (set1, set2) => {
  const filters = {
    'Set1 District Type': set1.district,
    'Set1 Councils': set1.list,
    'Set1 Areas': [],
    'Set1 Areas Fully Selected': [],
    'Set2 District Type': set2.district,
    'Set2 Councils': set2.list,
    'Set2 Areas': [],
    'Set2 Areas Fully Selected': [],
  };

  if (set1.district === 'nc') {
    const regions = { ...regionCounts };

    set1.list.forEach(name => {
      const region = COUNCILS.find(nc => nc.name === name)?.region;
      regions[region] -= 1;

      if (!filters['Set1 Areas'].includes(region)) {
        filters['Set1 Areas'].push(region);
      } else if (!regions[region]) {
        filters['Set1 Areas Fully Selected'].push(region);
      }
    });
  }

  if (set2.district === 'nc') {
    const regions = { ...regionCounts };

    set2.list.forEach(name => {
      const region = COUNCILS.find(nc => nc.name === name)?.region;
      regions[region] -= 1;

      if (!filters['Set2 Areas'].includes(region)) {
        filters['Set2 Areas'].push(region);
      } else if (!regions[region]) {
        filters['Set2 Areas Fully Selected'].push(region);
      }
    });
  }
  return filters;
};

const requestTypeFilters = requestTypes => (
  { 'Request Types': Object.keys(requestTypes).filter(req => requestTypes[req]) }
);

/**
 *  Converts 311Data filters into Mixpanel event properties object.
 *   {
 *    'Time Frame': LAST_6_MONTHS,
 *    'Time Frame Custom Start': false,
 *    'Time Frame Custom End': false,
 *    'Time Frame Custom Span': false,
 *    Councils: ['Atwater Village', 'Echo Park', ...],
 *    'NC Count': councils.length,
 *    Areas: ['East', 'Central 2', ...],
 *    'Areas Fully Selected': ['East'],
 *    'Request Types': ['Bulky Items', 'Single Streetlight', ...]
 *   }
 */
function* getAllDataFilters() {
  const {
    dateRange,
    startDate,
    endDate,
    councils,
    requestTypes,
  } = yield select(getState, 'filters');
  const dateFields = dateFilters(dateRange, startDate, endDate);
  const areaFields = councilAreaFilters(councils);
  const typeFields = requestTypeFilters(requestTypes);

  return {
    Councils: councils,
    'NC Count': councils.length,
    ...dateFields,
    ...areaFields,
    ...typeFields,
  };
}

/**
 *  Converts comparison filters into Mixpanel event properties object.
 *   {
 *    'Time Frame': LAST_6_MONTHS,
 *    'Time Frame Custom Start': false,
 *    'Time Frame Custom End': false,
 *    'Time Frame Custom Span': false,
 *    'Chart Type': 'frequency',
 *    'Set1 District Type': 'nc',
 *    'Set1 Councils': ['Atwater Village', 'Echo Park', ...],
 *    'Set1 Areas': ['East', 'Central 2', ...],
 *    'Set1 Areas Fully Selected': ['East'],
 *    'Set2 District Type': 'cc',
 *    'Set2 Councils': ['Council District 1', 'Council District 2', ...],
 *    'Set2 Areas': [],
 *    'Set2 Areas Fully Selected': [],
 *    'Request Types': ['Bulky Items', 'Single Streetlight', ...]
 *   }
 */
function* getAllComparisonFilters() {
  const {
    dateRange,
    startDate,
    endDate,
    comparison: {
      chart,
      set1,
      set2,
    },
    requestTypes,
  } = yield select(getState, 'comparisonFilters');
  const dateFields = dateFilters(dateRange, startDate, endDate);
  const setFields = comparisonSetFilters(set1, set2);
  const typeFields = requestTypeFilters(requestTypes);

  return {
    ...dateFields,
    'Chart Type': chart,
    ...setFields,
    ...typeFields,
  };
}

/* ////////////////// SAGAS //////////////// */

/* //  DATA/COMPARISON QUERIES // */

function* timeDataQuery() {
  yield call(Mixpanel.time_event, events.dataQuery);
}

function* logDataQuery() {
  const filters = yield getAllDataFilters();
  yield call(Mixpanel.track, events.dataQuery, filters);
}

/* //  EXPORTS // */

function* logMapExport() {
  const filters = yield getAllDataFilters();
  const eventProps = {
    'Page Area': 'Map',
    Filetype: 'PNG',
    ...filters,
  };
  yield call(Mixpanel.track, events.exportRequest, eventProps);
}

function* logChartExport(action) {
  const {
    pageArea,
    fileType,
    path,
  } = action.payload;
  let eventName;
  const eventProps = {
    'Page Area': pageArea,
    Filetype: fileType,
    path,
  };

  if (path === '/comparison') {
    eventName = events.exportComparison;
    const filters = yield getAllComparisonFilters();
    Object.assign(eventProps, {
      ...filters,
    });
  } else {
    eventName = events.exportRequest;
    const filters = yield getAllDataFilters();
    Object.assign(eventProps, {
      ...filters,
    });
  }

  yield call(Mixpanel.track, eventName, eventProps);
}

export default function* rootSaga() {
  yield takeLatest(dataTypes.GET_DATA_REQUEST, timeDataQuery);
  yield takeLatest(dataTypes.GET_HEATMAP_SUCCESS, logDataQuery);
  yield takeLatest(analyticsTypes.TRACK_MAP_EXPORT, logMapExport);
  yield takeLatest(analyticsTypes.TRACK_CHART_EXPORT, logChartExport);
}
