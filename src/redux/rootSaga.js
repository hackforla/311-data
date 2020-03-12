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
  getDataSuccess,
  getDataFailure,
} from './reducers/data';

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

function* getFrequency() {
  return yield {};
}

function* getTimeToClose() {
  return yield {};
}

/* //////////// COMBINED API CALL //////////// */

function* getAll(filters) {
  const [
    { lastUpdated, pins },
    counts,
    frequency,
    timeToClose,
  ] = yield all([
    call(getPins, filters),
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
    yield put(getDataSuccess(data));
  } catch (e) {
    yield put(getDataFailure(e));
  }
}

export default function* rootSaga() {
  yield takeLatest(types.GET_DATA_REQUEST, getData);
}
