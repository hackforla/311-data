import { all } from 'redux-saga/effects';

import data from './sagas/data';
import comparisonData from './sagas/comparisonData';


export default function* rootSaga() {
  yield all([
    data(),
    comparisonData(),
  ]);
}
