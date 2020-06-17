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
  getPinClustersSuccess,
  getPinClustersFailure,
  getHeatmapSuccess,
  getHeatmapFailure,
  getPinInfoSuccess,
  getPinInfoFailure,
  getVisDataSuccess,
  getVisDataFailure,
  gitResponseSuccess,
  gitResponseFailure,
} from '../reducers/data';

import {
  types as uiTypes,
  setErrorModal,
  showDataCharts,
  showFeedbackSuccess,
} from '../reducers/ui';

/* ////////////////// API CALLS  //////////////// */

const BASE_URL = process.env.DB_URL;

/* ////  MAP //// */

function* fetchPinClusters(filters, { zoom, bounds }) {
  const clustersUrl = `${BASE_URL}/map/clusters`;

  const {
    _northEast: { lat: north, lng: east },
    _southWest: { lat: south, lng: west },
  } = bounds;

  const { data } = yield call(axios.post, clustersUrl, {
    ...filters,
    zoom,
    bounds: {
      north,
      east,
      south,
      west,
    },
  });

  return data;
}

function* fetchHeatmap(filters) {
  const heatmapUrl = `${BASE_URL}/map/heat`;

  const { data } = yield call(axios.post, heatmapUrl, filters);

  return data;
}

function* fetchPinInfo(srnumber) {
  const pinInfoUrl = `${BASE_URL}/servicerequest/${srnumber}`;

  const { data } = yield call(axios.get, pinInfoUrl);

  return data;
}

/* //// VISUALIZATIONS //// */

function* fetchVisData(filters) {
  const visUrl = `${BASE_URL}/visualizations`;

  const { data } = yield call(axios.post, visUrl, filters);

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

function* getMapPosition() {
  const { map } = yield select(getState, 'ui');
  return map;
}

/* /////////////////// SAGAS ///////////////// */

function* getMapData() {
  const filters = yield getFilters();
  const mapPosition = yield getMapPosition();

  try {
    const clustersData = yield call(fetchPinClusters, filters, mapPosition);
    yield put(getPinClustersSuccess(clustersData));
  } catch (e) {
    yield put(getPinClustersFailure(e));
    yield put(setErrorModal(true));
    return;
  }

  try {
    const heatmapData = yield call(fetchHeatmap, filters);
    yield put(getHeatmapSuccess(heatmapData));
  } catch (e) {
    yield put(getHeatmapFailure(e));
    yield put(setErrorModal(true));
  }
}

function* getVisData() {
  const filters = yield getFilters();
  try {
    const data = yield call(fetchVisData, filters);
    yield put(getVisDataSuccess(data));
    yield put(showDataCharts(true));
  } catch (e) {
    yield put(getVisDataFailure(e));
    yield put(setErrorModal(true));
  }
}

function* updatePinClusters() {
  const filters = yield getFilters();

  if (
    !filters.startDate
    || !filters.endDate
    || !filters.ncList.length
    || !filters.requestTypes.length
  ) return;

  const mapPosition = yield getMapPosition();
  try {
    const data = yield call(fetchPinClusters, filters, mapPosition);
    yield put(getPinClustersSuccess(data));
  } catch (e) {
    yield put(getPinClustersFailure(e));
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
  yield takeLatest(types.GET_DATA_REQUEST, getMapData);
  yield takeLatest(types.GET_DATA_REQUEST, getVisData);
  yield takeLatest(uiTypes.UPDATE_MAP_POSITION, updatePinClusters);
  yield takeEvery(types.GET_PIN_INFO_REQUEST, getPinData);
  yield takeLatest(types.SEND_GIT_REQUEST, sendContactData);
}
