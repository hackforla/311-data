import axios from 'axios';
import {
  takeLatest,
  call,
  put,
  select,
} from 'redux-saga/effects';
import { CITY_COUNCILS, COUNCILS } from '@components/common/CONSTANTS';

import {
  types,
  getComparisonDataSuccess,
  getComparisonDataFailure,
} from '../reducers/comparisonData';

import {
  setErrorModal,
  showComparisonCharts,
} from '../reducers/ui';

/* /////////// INDIVIDUAL API CALLS /////////// */

const BASE_URL = process.env.DB_URL;

function* getCountsComparison(filters) {
  const url = `${BASE_URL}/comparison/counts`;

  const { data } = yield call(axios.post, url, filters);

  return data;
}

function* getTimeToCloseComparison(filters) {
  const url = `${BASE_URL}/comparison/timetoclose`;

  const { data } = yield call(axios.post, url, filters);

  return data;
}

function* getFrequencyComparison(filters) {
  const url = `${BASE_URL}/comparison/frequency`;

  const { data } = yield call(axios.post, url, filters);

  return data;
}

/* /////////////// CHART SWITCH /////////////// */

function* getChartData(filters) {
  switch (filters.chart) {
    case 'contact': {
      const counts = yield call(getCountsComparison, filters);
      return { counts };
    }
    case 'time': {
      const timeToClose = yield call(getTimeToCloseComparison, filters);
      return { timeToClose };
    }
    case 'frequency':
    case 'request': {
      const frequency = yield call(getFrequencyComparison, filters);
      return { frequency };
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

  const convertCouncilNameToID = set => {
    if (set.district !== 'cc') {
      return {
        district: set.district,
        list: set.list.map(name => COUNCILS.find(nc => nc.name === name)?.id),
      };
    }

    return {
      district: set.district,
      list: set.list.map(name => CITY_COUNCILS.find(cc => cc.name === name)?.id),
    };
  };

  const { chart, set1, set2 } = comparison;

  return {
    startDate,
    endDate,
    requestTypes: Object.keys(requestTypes).filter(req => req !== 'All' && requestTypes[req]),
    chart,
    set1: convertCouncilNameToID(set1),
    set2: convertCouncilNameToID(set2),
  };
}

/* /////////////////// SAGAS ///////////////// */

function* getData() {
  const filters = yield getFilters();
  try {
    const data = yield call(getChartData, filters);
    data.chart = filters.chart;
    yield put(getComparisonDataSuccess(data));
    yield put(showComparisonCharts(true));
  } catch (e) {
    yield put(getComparisonDataFailure(e));
    yield put(setErrorModal(true));
  }
}

export default function* rootSaga() {
  yield takeLatest(types.GET_COMPARISON_DATA_REQUEST, getData);
}
