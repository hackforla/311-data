import axios from 'axios';
import {
  takeLatest,
  call,
  put,
  select,
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

function* getTimeToCloseComparison(filters) {
  const url = `${BASE_URL}/timetoclose-comparison`;

  const { data } = yield call(axios.post, url, filters);

  return data;
}

/* /////////////// CHART SWITCH /////////////// */

function* getChartData(filters) {
  switch (filters.chart) {
    case 'time': {
      const data = yield call(getTimeToCloseComparison, filters);
      return {
        lastUpdated: data.lastPulled,
        timeToClose: data.data,
      };
    }
    default:
      return {};
  }
}

/* ////////////////// FILTERS //////////////// */

const getState = (state, slice) => state[slice];

function* getFilters() {
  const {
    startDate,
    endDate,
    requestTypes,
    comparison,
  } = yield select(getState, 'comparisonFilters');

  return {
    startDate,
    endDate,
    requestTypes: Object.keys(requestTypes).filter(req => req !== 'All' && requestTypes[req]),
    ...comparison,

    /* DELETE THESE LINES WHEN SET1/SET2 FILTERS ARE HOOKED UP */
    set1: {
      district: 'nc',
      list: ['ARLETA NC', 'ARROYO SECO NC', 'VOICES OF 90037', 'ZAPATA KING NC'],
    },
    set2: {
      district: 'cc',
      list: [1, 2, 3, 7, 8],
    },
    /* /////////////////////////////////////////////////////// */
  };
}

/* /////////////////// SAGAS ///////////////// */

function* getData() {
  const filters = yield getFilters();
  try {
    const data = yield call(getChartData, filters);
    yield put(getComparisonDataSuccess(data));
  } catch (e) {
    yield put(getComparisonDataFailure(e));
    yield put(setErrorModal(true));
  }
}

export default function* rootSaga() {
  yield takeLatest(types.GET_COMPARISON_DATA_REQUEST, getData);
}
