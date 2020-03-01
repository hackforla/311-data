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

const getState = (state, slice) => state[slice];

// For socrata only
// const dataResources = {
//   2019: 'pvft-t768',
//   2018: 'h65r-yf5i',
//   2017: 'd4vt-q4t5',
//   2016: 'ndkd-k878',
//   2015: 'ms7h-a45h',
// };

function* getData() {
  const {
    startDate,
    endDate,
    councils,
    requestTypes,
  } = yield select(getState, 'data');

  // const socrata = `https://data.lacity.org/resource/${dataResources[2018]}.json?$select=location,zipcode,address,requesttype,status,ncname,streetname,housenumber&$where=date_extract_m(CreatedDate)+between+${1}+and+${12}+and+requesttype='${'Bulky Items'}'`;

  const options = {
    startDate,
    endDate,
    ncList: councils,
    requestTypes: Object.keys(requestTypes).filter((req) => req !== 'All' && requestTypes[req]),
  };

  try {
    const response = yield call(axios.post, process.env.DB_URL, options);
    const { data } = response;
    yield put(getDataSuccess(data.data));
  } catch (e) {
    yield put(getDataFailure(e));
  }
}

export default function* rootSaga() {
  yield takeLatest(types.GET_DATA_REQUEST, getData);
}
