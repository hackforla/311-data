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

function* getData() {
  const {
    startDate,
    endDate,
    councils,
    requestTypes,
  } = yield select(getState, 'data');

  const options = {
    startDate,
    endDate,
    ncList: councils,
    requestTypes: Object.keys(requestTypes).filter((req) => req !== 'All' && requestTypes[req]),
  };

  try {
    const response = yield call(axios.post, process.env.DB_URL, options);
    const { data } = response;
    yield put(getDataSuccess(data));
  } catch (e) {
    yield put(getDataFailure(e));
  }
}

export default function* rootSaga() {
  yield takeLatest(types.GET_DATA_REQUEST, getData);
}
