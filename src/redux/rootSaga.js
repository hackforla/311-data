import axios from 'axios';
import {
  takeLatest,
  takeEvery,
  call,
  put,
  select,
  all,
} from 'redux-saga/effects';

import {
  types,
  getDataSuccess,
  getDataFailure,
  getPinInfoSuccess,
  getPinInfoFailure,
} from './reducers/data';

import {
  setErrorModal,
} from './reducers/ui';

/* /////////// INDIVIDUAL API CALLS /////////// */

const BASE_URL = process.env.DB_URL;

function* getPins(filters) {
  const pinUrl = `${BASE_URL}/pins`;

  const { data: { lastPulled, data } } = yield call(axios.post, pinUrl, filters);

  return {
    lastUpdated: lastPulled,
    pins: data,
  };
}

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

function* fetchPinInfo(srnumber) {
  const pinInfoUrl = `${BASE_URL}/servicerequest/${srnumber}`;

  const { data: { data } } = yield call(axios.get, pinInfoUrl);

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
    timeToCloseComparison, // temporary
  ] = yield all([
    call(getPins, filters),
    call(getCounts, filters),
    call(getFrequency, filters),
    call(getTimeToClose, filters),
    call(getTimeToCloseComparison, filters), // temporary
  ]);

  return {
    lastUpdated,
    pins,
    counts,
    frequency,
    timeToClose,
    timeToCloseComparison, // temporary
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
    yield put(getDataSuccess(data));
  } catch (e) {
    yield put(getDataFailure(e));
    yield put(setErrorModal(true));
  }
}

function* getPinData(action) {
  try {
    const srnumber = action.payload;
    const data = yield call(fetchPinInfo, srnumber);
    yield put(getPinInfoSuccess(data));
  } catch (e) {
    yield put(getPinInfoFailure(e));
    yield put(setErrorModal(true));
  }
}

export default function* rootSaga() {
  yield takeLatest(types.GET_DATA_REQUEST, getData);
  yield takeEvery(types.GET_PIN_INFO_REQUEST, getPinData);
}
