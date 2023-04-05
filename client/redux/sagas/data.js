import axios from 'axios';
import {
  takeLatest,
  takeEvery,
  call,
  put,
  select,
} from 'redux-saga/effects';
import { COUNCILS } from '@components/common/CONSTANTS';

import {
  types,
  getPinsSuccess,
  getPinsFailure,
  getPinInfoSuccess,
  getPinInfoFailure,
  getNcByLngLatSuccess,
  getNcByLngLatFailure,
  gitResponseSuccess,
  gitResponseFailure,
} from '../reducers/data';

import {
  updateNcId,
} from '../reducers/filters';

import {
  setErrorModal,
  showFeedbackSuccess,
} from '../reducers/ui';

import {
  types as mapFiltersTypes,
} from '../reducers/mapFilters';

/* ////////////////// API CALLS  //////////////// */

const BASE_URL = process.env.API_URL;

/* ////  MAP //// */

function* fetchPins(filters) {
  const pinsUrl = `${BASE_URL}/map/pins`;

  const { data } = yield call(axios.post, pinsUrl, filters);

  return data;
}

function* fetchPinInfo(srnumber) {
  const pinInfoUrl = `${BASE_URL}/requests/${srnumber}`;

  const { data } = yield call(axios.get, pinInfoUrl);

  return data;
}

function* fetchNcByLngLat({ longitude, latitude }) {
  const geocodeUrl = `${BASE_URL}/geojson/geocode?latitude=${latitude}&longitude=${longitude}`;

  const { data } = yield call(axios.get, geocodeUrl);

  return data;
}

/* //// OTHER //// */

function* postFeedback(message) {
  const contactURL = `${BASE_URL}/feedback`;

  const response = yield call(axios.post, contactURL, message);
  return response;
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

function* getMapData() {
  const filters = yield getFilters();
  // const mapPosition = yield getMapPosition();

  if (filters.ncList.length === 0 || filters.requestTypes.length === 0) {
    yield put(getPinsSuccess([]));
    return;
  }

  try {
    const pinsData = yield call(fetchPins, filters);
    yield put(getPinsSuccess(pinsData));
  } catch (e) {
    yield put(getPinsFailure(e));
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

function* getNcByLngLat(action) {
  try {
    const data = yield call(fetchNcByLngLat, action.payload);
    yield put(getNcByLngLatSuccess(data));

    if (data?.council_id) {
      // This is where address search syncs with councilId state in reducers/filters.js
      // without this, address search will be out of sync with rest of code
      yield put(updateNcId(data.council_id));
    }
  } catch (e) {
    yield put(getNcByLngLatFailure(e));
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
  yield takeLatest(mapFiltersTypes.UPDATE_MAP_DATE_RANGE, getMapData);
  yield takeLatest(types.GET_NC_BY_LNG_LAT, getNcByLngLat);
  yield takeEvery(types.GET_PIN_INFO_REQUEST, getPinData);
  yield takeLatest(types.SEND_GIT_REQUEST, sendContactData);
}
