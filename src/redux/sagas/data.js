import axios from 'axios';
import {
  takeLatest,
  call,
  put,
  select,
} from 'redux-saga/effects';
import { COUNCILS } from '@components/common/CONSTANTS';
import {
  types,
  getNcByLngLatSuccess,
  getNcByLngLatFailure,
  gitResponseSuccess,
  gitResponseFailure,
} from '../reducers/data';
import { updateNcId } from '../reducers/filters';
import { setErrorModal, showFeedbackSuccess } from '../reducers/ui';
import { types as mapFiltersTypes } from '../reducers/mapFilters';

//* API Call
const BASE_URL = import.meta.env.API_URL;

//* Map
function* fetchPins(filters) {
  const pinsUrl = `${BASE_URL}/map/pins`;

  const { data } = yield call(axios.post, pinsUrl, filters);

  return data;
}

function* fetchNcByLngLat({ longitude, latitude }) {
  const geocodeUrl = `${BASE_URL}/geojson/geocode?latitude=${latitude}&longitude=${longitude}`;

  const { data } = yield call(axios.get, geocodeUrl);

  return data;
}

//* Other
function* postFeedback(message) {
  const contactURL = `${BASE_URL}/feedback`;

  const response = yield call(axios.post, contactURL, message);
  return response;
}

//* Filters
const getState = (state, slice) => state[slice];

function* getFilters() {
  const {
    startDate, endDate, councils, requestTypes,
  } = yield select(
    getState,
    'filters',
  );

  const convertCouncilNameToID = ncList => ncList.map(name => COUNCILS.find(nc => nc.name === name)?.id);

  return {
    startDate,
    endDate,
    ncList: convertCouncilNameToID(councils),
    requestTypes: Object.keys(requestTypes).filter(
      req => req !== 'All' && requestTypes[req],
    ),
  };
}


//* Sagas
function* getMapData() {
  const filters = yield getFilters();
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
  yield takeLatest(types.SEND_GIT_REQUEST, sendContactData);
}
