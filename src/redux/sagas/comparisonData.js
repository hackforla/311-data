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

import { CITY_COUNCILS } from '@components/common/CONSTANTS';

/* /////////// INDIVIDUAL API CALLS /////////// */

const BASE_URL = process.env.DB_URL;

function* getCountsComparison(filters) {
  const url = `${BASE_URL}/requestcounts-comparison`;

  const { data } = yield call(axios.post, url, {
    ...filters,
    countFields: ['requestsource'],
  });

  const { set1, set2 } = data.data;

  return {
    ...data,
    data: {
      set1: {
        district: set1.district,
        source: set1.data.find(d => d.field === 'requestsource')?.counts,
      },
      set2: {
        district: set2.district,
        source: set2.data.find(d => d.field === 'requestsource')?.counts,
      },
    },
  };
}

function* getTimeToCloseComparison(filters) {
  const url = `${BASE_URL}/timetoclose-comparison`;

  const { data } = yield call(axios.post, url, filters);

  return data;
}

function* getFrequencyComparison(filters) {
  const url = `${BASE_URL}/requestfrequency-comparison`;

  const { data } = yield call(axios.post, url, filters);

  return data;
}

/* /////////////// CHART SWITCH /////////////// */

function* getChartData(filters) {
  switch (filters.chart) {
    case 'contact': {
      const data = yield call(getCountsComparison, filters);
      return {
        lastUpdated: data.lastPulled,
        counts: data.data,
      };
    }
    case 'time': {
      const data = yield call(getTimeToCloseComparison, filters);
      return {
        lastUpdated: data.lastPulled,
        timeToClose: data.data,
      };
    }
    case 'frequency':
    case 'request': {
      const data = yield call(getFrequencyComparison, filters);
      return {
        lastUpdated: data.lastPulled,
        frequency: data.data,
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

  // convert cc names to numeric ids
  const convertIfCC = set => {
    if (set.district !== 'cc') return set;
    
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
    set1: convertIfCC(set1),
    set2: convertIfCC(set2),
  };
}

/* /////////////////// SAGAS ///////////////// */

function* getData() {
  const filters = yield getFilters();
  try {
    const data = yield call(getChartData, filters);
    data.chart = filters.chart;
    yield put(getComparisonDataSuccess(data));
  } catch (e) {
    yield put(getComparisonDataFailure(e));
    yield put(setErrorModal(true));
  }
}

export default function* rootSaga() {
  yield takeLatest(types.GET_COMPARISON_DATA_REQUEST, getData);
}
