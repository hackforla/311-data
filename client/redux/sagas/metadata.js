import {
  takeLatest,
  put,
  all,
} from 'redux-saga/effects';

import councils from '@root/data/councils';
import regions from '@root/data/regions';
import agencies from '@root/data/agencies';
import metadata from '@root/data/metadata';
import ncGeojson from '@root/data/ncGeojson';

import {
  types,
  getMetadataSuccess,
  getCouncilsSuccess,
  getRegionsSuccess,
  getNcGeojsonSuccess,
  getAgenciesSuccess,
  getMetadataFailure,
} from '../reducers/metadata';

function* getMetadata() {
  try {
    yield all([
      put(getMetadataSuccess(metadata)),
      put(getCouncilsSuccess(councils)),
      put(getRegionsSuccess(regions)),
      put(getAgenciesSuccess(agencies)),
      put(getNcGeojsonSuccess(ncGeojson)),
    ]);
  } catch (e) {
    yield put(getMetadataFailure(e));
  }
}

export default function* rootSaga() {
  yield takeLatest(types.GET_METADATA_REQUEST, getMetadata);
}
