import axios from 'axios';
import {
  takeLatest,
  call,
  put,
  select,
} from 'redux-saga/effects';
import {
  types,
  getDataSuccess,
  getDataFailure,
} from './reducers/data';

/* /////////// INDIVIDUAL API CALLS /////////// */

const BASE_URL = `https://${process.env.DB_URL}`;

async function getPins(filters) {
  const pinUrl = `${BASE_URL}/pins`;

  const { data: { lastPulled, data } } = await axios.post(pinUrl, filters);

  return {
    lastUpdated: lastPulled,
    pins: data,
  };
}

async function getCounts(filters) {
  const countsUrl = `${BASE_URL}/requestcounts`;

  const { data: { data } } = await axios.post(countsUrl, {
    ...filters,
    countFields: ['requesttype', 'requestsource'],
  });

  return {
    type: data.find(d => d.field === 'requesttype')?.counts,
    source: data.find(d => d.field === 'requestsource')?.counts,
  };
}

async function getFrequency() {
  return {};
}

async function getTimeToClose() {
  return {};
}

/* //////////// COMBINED API CALL //////////// */

function getAll(filters) {
  return Promise.all([
    getPins(filters),
    getCounts(filters),
    getFrequency(filters),
    getTimeToClose(filters),
  ])
    .then(([
      { lastUpdated, pins },
      counts,
      frequency,
      timeToClose,
    ]) => ({
      lastUpdated,
      pins,
      counts,
      frequency,
      timeToClose,
    }));
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
