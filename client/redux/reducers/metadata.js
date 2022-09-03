import tempTypes from '../tempTypes';

export const types = {
  GET_METADATA_REQUEST: 'GET_METADATA_REQUEST',
  GET_METADATA_SUCCESS: 'GET_METADATA_SUCCESS',
  GET_METADATA_FAILURE: 'GET_METADATA_FAILURE',
  GET_REQUEST_TYPES_SUCCESS: 'GET_REQUEST_TYPES_SUCCESS',
  GET_COUNCILS_SUCCESS: 'GET_COUNCILS_SUCCESS',
  GET_REGIONS_SUCCESS: 'GET_REGIONS_SUCCESS',
  GET_AGENCIES_SUCCESS: 'GET_AGENCIES_SUCCESS',
  GET_NC_GEOJSON_SUCCESS: 'GET_NC_GEOJSON_SUCCESS',
};

export const getMetadataRequest = () => ({
  type: types.GET_METADATA_REQUEST,
});

export const getMetadataSuccess = response => ({
  type: types.GET_METADATA_SUCCESS,
  payload: response,
});

export const getMetadataFailure = error => ({
  type: types.GET_METADATA_FAILURE,
  payload: error,
});

export const getRequestTypesSuccess = response => ({
  type: types.GET_REQUEST_TYPES_SUCCESS,
  payload: response,
});

export const getCouncilsSuccess = response => ({
  type: types.GET_COUNCILS_SUCCESS,
  payload: response,
});

export const getRegionsSuccess = response => ({
  type: types.GET_REGIONS_SUCCESS,
  payload: response,
});

export const getAgenciesSuccess = response => ({
  type: types.GET_AGENCIES_SUCCESS,
  payload: response,
});

export const getNcGeojsonSuccess = response => ({
  type: types.GET_NC_GEOJSON_SUCCESS,
  payload: response,
});

const initialState = {
  currentTimeUTC: null,
  currentTimeLocal: null,
  gitSha: null,
  version: null,
  lastPulledUTC: null,
  lastPulledLocal: null,
  requestTypes: tempTypes,
  councils: null,
  regions: null,
  agencies: null,
  ncGeojson: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_METADATA_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    case types.GET_REQUEST_TYPES_SUCCESS:
      return {
        ...state,
        requestTypes: action.payload,
      };
    case types.GET_COUNCILS_SUCCESS:
      return {
        ...state,
        councils: action.payload,
      };
    case types.GET_REGIONS_SUCCESS:
      return {
        ...state,
        regions: action.payload,
      };
    case types.GET_AGENCIES_SUCCESS:
      return {
        ...state,
        agencies: action.payload,
      };
    case types.GET_NC_GEOJSON_SUCCESS:
      return {
        ...state,
        ncGeojson: action.payload,
      };
    case types.GET_METADATA_FAILURE: {
      const {
        response: { status },
        message,
      } = action.payload;

      return {
        ...state,
        error: {
          code: status,
          message,
          error: action.payload,
        },
      };
    }
    default:
      return state;
  }
};
