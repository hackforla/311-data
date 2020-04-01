import axios from 'axios';
import {
  takeLatest,
  call,
  put,
  select,
  all,
} from 'redux-saga/effects';

import {
  types,
  getComparisonDataSuccess,
  getComparisonDataFailure,
} from '../reducers/comparisonData';

import {
  setErrorModal,
} from '../reducers/ui';

/* /////////// INDIVIDUAL API CALLS /////////// */

const BASE_URL = process.env.DB_URL;

function* getCounts(filters) {
  const countsUrl = `${BASE_URL}/requestcounts`;

  const { data: { data } } = yield call(axios.post, countsUrl, {
    ...filters,
    countFields: ['requesttype', 'requestsource'],
  });

  return {
    type: data.find(d => d.field === 'requesttype')?.counts,
    source: data.find(d => d.field === 'requestsource')?.counts,
  };
}

function* getFrequency(filters) {
  const frequencyUrl = `${BASE_URL}/requestfrequency`;

  const { data: { data } } = yield call(axios.post, frequencyUrl, filters);

  return data;
}

function* getTimeToClose(filters) {
  const ttcUrl = `${BASE_URL}/timetoclose`;

  const { data: { data } } = yield call(axios.post, ttcUrl, filters);

  return data;
}

function* getTimeToCloseComparison(filters) {
  // will hook up to comparison filters
  const temp = {
    ...filters,
    cdList: [1, 2, 3],
  };

  const url = `${BASE_URL}/timetoclose-comparison`;

  const { data: { data } } = yield call(axios.post, url, temp);

  return data;
}

/* //////////// COMBINED API CALL //////////// */

function* getAll(filters) {
  const [
    { lastUpdated, pins },
    counts,
    frequency,
    timeToClose,
  ] = yield all([
    call(getCounts, filters),
    call(getFrequency, filters),
    call(getTimeToClose, filters),
  ]);

  return {
    lastUpdated,
    pins,
    counts,
    frequency,
    timeToClose,
  };
}

/* ////////////////// FILTERS //////////////// */

const getState = (state, slice) => state[slice];

function* getFilters() {
  const {
    startDate,
    endDate,
    councils,
    requestTypes,
  } = yield select(getState, 'filters');

  return {
    startDate,
    endDate,
    ncList: councils,
    requestTypes: Object.keys(requestTypes).filter(req => req !== 'All' && requestTypes[req]),
  };
}

/* /////////////////// SAGAS ///////////////// */

function* getData() {
  const filters = yield getFilters();
  try {
    const data = yield call(getAll, filters);
    yield put(getComparisonDataSuccess(data));
  } catch (e) {
    yield put(getComparisonDataFailure(e));
    yield put(setErrorModal(true));
  }
}

export default function* rootSaga() {
  yield takeLatest(types.GET_COMPARISON_DATA_REQUEST, getData);
}
