import Mixpanel from '@utils/Mixpanel';
import { select, call, takeLatest } from 'redux-saga/effects';
// import {
//   types as analyticsTypes,
//   startEventTimer,
// } from '../reducers/analytics';
import { types as dataTypes } from '../reducers/data';

const dataQueryEventName = 'Request Query';
const comparisonQueryEventName = 'Comparison Query';


function* timeDataQuery() {
  yield call(Mixpanel.time_event, dataQueryEventName);
}

/* ////////////////// FILTERS //////////////// */

const getState = (state, slice) => state[slice];

function countDaysBetweenDates(startDate, endDate) {
  const date1 = new Date(startDate);
  const date2 = new Date(endDate);
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function* getQueryFilters() {
  const {
    dateRange,
    startDate,
    endDate,
    councils,
    requestTypes,
  } = yield select(getState, 'filters');

  const filters = {
    'Time Frame': dateRange,
    'Time Frame Custom Start': false,
    'Time Frame Custom End': false,
    'Time Frame Custom Span': false,
    Areas: undefined,
    'Areas Fully Selected': undefined,
    'NC Count': councils.length,
    'Request Types': requestTypes,
  };

  if (dateRange === 'CUSTOM_DATE_RANGE') {
    const customStartDate = new Date(startDate).toIsoString();
    const customEndDate = new Date(endDate).toIsoString();
    filters['Time Frame Custom Start'] = customStartDate;
    filters['Time Frame Custom End'] = customEndDate;
    filters['Time Frame Custom Span'] = countDaysBetweenDates(customStartDate, customEndDate);
  }

  console.log(filters);
  return filters;
}

/* ////////////////// SAGAS //////////////// */

function* logQueryFilters() {
  const filters = yield getQueryFilters();
  // console.log(filters);
  yield call(Mixpanel.track, dataQueryEventName, filters);
}

export default function* rootSaga() {
  yield takeLatest(dataTypes.GET_DATA_REQUEST, timeDataQuery);
  yield takeLatest(dataTypes.GET_HEATMAP_SUCCESS, logQueryFilters);
}
