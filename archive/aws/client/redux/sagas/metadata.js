import axios from 'axios';
import {
  takeLatest,
  call,
  put,
  all,
} from 'redux-saga/effects';

import {
  types,
  getMetadataSuccess,
  // getRequestTypesSuccess,
  getCouncilsSuccess,
  getRegionsSuccess,
  getNcGeojsonSuccess,
  getAgenciesSuccess,
  getMetadataFailure,
} from '../reducers/metadata';

function* getMetadata() {
  const baseUrl = process.env.API_URL;
  try {
    const [
      metadata,
      // requestTypes,
      councils,
      regions,
      agencies,
      ncGeojson,
    ] = yield all([
      call(axios.get, `${baseUrl}/status/api`),
      // call(axios.get, `${baseUrl}/types`),
      call(axios.get, `${baseUrl}/councils`),
      call(axios.get, `${baseUrl}/regions`),
      call(axios.get, `${baseUrl}/agencies`),
      call(axios.get, `${baseUrl}/geojson`),
    ]);
    const { data: statusMetadata } = metadata;
    // const { data: typesMetadata } = requestTypes;
    const { data: councilsMetadata } = councils;
    const { data: regionsMetadata } = regions;
    const { data: agenciesMetadata } = agencies;
    const { data: ncGeojsonMetadata } = ncGeojson;

    yield all([
      put(getMetadataSuccess(statusMetadata)),
      // put(getRequestTypesSuccess(typesMetadata)),
      put(getCouncilsSuccess(councilsMetadata)),
      put(getRegionsSuccess(regionsMetadata)),
      put(getAgenciesSuccess(agenciesMetadata)),
      put(getNcGeojsonSuccess(ncGeojsonMetadata)),
    ]);
  } catch (e) {
    yield put(getMetadataFailure(e));
  }
}

export default function* rootSaga() {
  yield takeLatest(types.GET_METADATA_REQUEST, getMetadata);
}
