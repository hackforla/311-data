import { all } from 'redux-saga/effects';

import metadata from './sagas/metadata';
import data from './sagas/data';
import analytics from './sagas/analytics';

export default function* rootSaga() {
  yield all([
    metadata(),
    data(),
    analytics(),
  ]);
}
