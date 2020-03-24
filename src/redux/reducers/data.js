export const types = {
  GET_DATA_REQUEST: 'GET_DATA_REQUEST',
  GET_DATA_SUCCESS: 'GET_DATA_SUCCESS',
  GET_DATA_FAILURE: 'GET_DATA_FAILURE',
  GET_PIN_INFO_REQUEST: 'GET_PIN_INFO_REQUEST',
  GET_PIN_INFO_SUCCESS: 'GET_PIN_INFO_SUCCESS',
  GET_PIN_INFO_FAILURE: 'GET_PIN_INFO_FAILURE',
};

export const getDataRequest = () => ({
  type: types.GET_DATA_REQUEST,
});

export const getDataSuccess = response => ({
  type: types.GET_DATA_SUCCESS,
  payload: response,
});

export const getDataFailure = error => ({
  type: types.GET_DATA_FAILURE,
  payload: error,
});

export const getPinInfoRequest = srnumber => ({
  type: types.GET_PIN_INFO_REQUEST,
  payload: srnumber,
});

export const getPinInfoSuccess = response => ({
  type: types.GET_PIN_INFO_SUCCESS,
  payload: response,
});

export const getPinInfoFailure = error => ({
  type: types.GET_PIN_INFO_FAILURE,
  payload: error,
});

const initialState = {
  isLoading: false,
  error: null,
  lastUpdated: null,
  pins: [],
  pinsInfo: {},
  counts: {},
  frequency: {},
  timeToClose: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_DATA_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case types.GET_DATA_SUCCESS:
      return {
        ...state,
        error: null,
        isLoading: false,
        ...action.payload,
      };
    case types.GET_DATA_FAILURE: {
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
        isLoading: false,
      };
    }
    case types.GET_PIN_INFO_REQUEST:
      return state;
    case types.GET_PIN_INFO_SUCCESS:
      return {
        ...state,
        error: null,
        pinsInfo: {
          ...state.pinsInfo,
          [action.payload.srnumber]: action.payload,
        },
        isLoading: false,
      };
    case types.GET_PIN_INFO_FAILURE: {
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
        isLoading: false,
      };
    }
    default:
      return state;
  }
};
