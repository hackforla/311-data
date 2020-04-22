import axios from 'axios';
import {
  takeLatest,
  takeEvery,
  call,
  put,
  select,
  all,
} from 'redux-saga/effects';
import { COUNCILS } from '@components/common/CONSTANTS';

import {
  types,
  getDataSuccess,
  getDataFailure,
  getPinInfoSuccess,
  getPinInfoFailure,
  gitResponseSuccess,
  gitResponseFailure,
} from '../reducers/data';

import {
  setErrorModal,
  showDataCharts,
  showFeedbackSuccess,
} from '../reducers/ui';


/* /////////// INDIVIDUAL API CALLS /////////// */

const BASE_URL = process.env.DB_URL;

function* getPins(filters) {
  const pinUrl = `${BASE_URL}/pins`;

  const { data } = yield call(axios.post, pinUrl, filters);

  return data;
}

function* getCounts(filters) {
  const countsUrl = `${BASE_URL}/requestcounts`;

  const { data } = yield call(axios.post, countsUrl, {
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

  const { data } = yield call(axios.post, frequencyUrl, filters);

  return data;
}

function* getTimeToClose(filters) {
  const ttcUrl = `${BASE_URL}/timetoclose`;

  const { data } = yield call(axios.post, ttcUrl, filters);

  return data;
}

function* fetchPinInfo(srnumber) {
  const pinInfoUrl = `${BASE_URL}/servicerequest/${srnumber}`;

  const { data } = yield call(axios.get, pinInfoUrl);

  return data;
}

function* postFeedback(message) {
  const contactURL = `${BASE_URL}/feedback`;

  const response = yield call(axios.post, contactURL, message);
  return response;
}

/* //////////// COMBINED API CALL //////////// */

function* getAll(filters) {
  const [
    pins,
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

  const convertCouncilNameToID = ncList => (
    ncList.map(name => COUNCILS.find(nc => nc.name === name)?.id)
  );

  return {
    startDate,
    endDate,
    ncList: convertCouncilNameToID(councils),
    requestTypes: Object.keys(requestTypes).filter(req => req !== 'All' && requestTypes[req]),
  };
}

/* /////////////////// SAGAS ///////////////// */

function* getData() {
  const filters = yield getFilters();
  try {
    const data = yield call(getAll, filters);
    yield put(getDataSuccess(data));
    yield put(showDataCharts(true));
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

function* sendContactData(action) {
  try {
    const message = action.payload;
    const data = yield call(postFeedback, message);
    yield put(gitResponseSuccess(data));
    yield put(showFeedbackSuccess(true));
  } catch (e) {
    yield put(gitResponseFailure(e));
    yield put(setErrorModal(true));
  }
}

export default function* rootSaga() {
  yield takeLatest(types.GET_DATA_REQUEST, getData);
  yield takeEvery(types.GET_PIN_INFO_REQUEST, getPinData);
  yield takeLatest(types.SEND_GIT_REQUEST, sendContactData);
}
