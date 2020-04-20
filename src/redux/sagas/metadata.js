import axios from 'axios';
import {
  takeLatest,
  call,
  put,
} from 'redux-saga/effects';

import {
  types,
  getMetadataSuccess,
  getMetadataFailure,
} from '../reducers/metadata';

function* getMetadata() {
  const url = `${process.env.DB_URL}/apistatus`;
  try {
    const { data } = yield call(axios.get, url);
    yield put(getMetadataSuccess(data));
  } catch (e) {
    yield put(getMetadataFailure(e));
  }
}

export default function* rootSaga() {
  yield takeLatest(types.GET_METADATA_REQUEST, getMetadata);
}
