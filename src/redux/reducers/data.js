export const types = {
  UPDATE_START_DATE: 'UPDATE_START_DATE',
  UPDATE_END_DATE: 'UPDATE_END_DATE',
  UPDATE_REQUEST_TYPE: 'UPDATE_REQUEST_TYPE',
  UPDATE_NEIGHBORHOOD_COUNCIL: 'UPDATE_NEIGHBORHOOD_COUNCIL',
  GET_DATA_REQUEST: 'GET_DATA_REQUEST',
  GET_DATA_SUCCESS: 'GET_DATA_SUCCESS',
  GET_DATA_FAILURE: 'GET_DATA_FAILURE',
};

export const updateStartDate = (newStartDate) => ({
  type: types.UPDATE_START_DATE,
  payload: newStartDate,
});

export const updateEndDate = (newEndDate) => ({
  type: types.UPDATE_END_DATE,
  payload: newEndDate,
});

export const updateRequestType = (requestTypes) => ({
  type: types.UPDATE_REQUEST_TYPE,
  payload: requestTypes,
});

export const updateNC = (council) => ({
  type: types.UPDATE_NEIGHBORHOOD_COUNCIL,
  payload: council,
});

export const getDataRequest = () => ({
  type: types.GET_DATA_REQUEST,
});

export const getDataSuccess = (response) => ({
  type: types.GET_DATA_SUCCESS,
  payload: response,
});

export const getDataFailure = (error) => ({
  type: types.GET_DATA_FAILURE,
  payload: error,
});

const initialState = {
  startDate: null,
  endDate: null,
  requestTypes: {},
  councils: [],
  data: {},
  isLoading: false,
  error: null,
  lastUpdated: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_START_DATE: {
      return {
        ...state,
        startDate: action.payload,
      };
    }
    case types.UPDATE_END_DATE: {
      return {
        ...state,
        endDate: action.payload,
      };
    }
    case types.UPDATE_REQUEST_TYPE:
      return {
        ...state,
        requestTypes: action.payload,
      };
    case types.UPDATE_NEIGHBORHOOD_COUNCIL:
      return {
        ...state,
        councils: action.payload,
      };
    case types.GET_DATA_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case types.GET_DATA_SUCCESS:
      return {
        ...state,
        data: action.payload,
        error: null,
        isLoading: false,
        lastUpdated: new Date(),
      };
    case types.GET_DATA_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};
