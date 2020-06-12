import { all } from 'redux-saga/effects';

import metadata from './sagas/metadata';
import data from './sagas/data';
import comparisonData from './sagas/comparisonData';
import analytics from './sagas/analytics';

export default function* rootSaga() {
  yield all([
    metadata(),
    data(),
    comparisonData(),
    analytics(),
  ]);
}
