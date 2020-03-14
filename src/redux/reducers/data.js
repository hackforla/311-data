export const types = {
  GET_DATA_REQUEST: 'GET_DATA_REQUEST',
  GET_DATA_SUCCESS: 'GET_DATA_SUCCESS',
  GET_DATA_FAILURE: 'GET_DATA_FAILURE',
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

const initialState = {
  isLoading: false,
  error: null,
  lastUpdated: null,
  pins: [],
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
    case types.GET_DATA_SUCCESS: {
      const {
        lastUpdated,
        pins,
        counts,
        frequency,
        timeToClose,
      } = action.payload;

      return {
        ...state,
        error: null,
        isLoading: false,
        lastUpdated,
        pins,
        counts,
        frequency,
        timeToClose,
      };
    }
    case types.GET_DATA_FAILURE: {
      const { error } = action.payload;
      return {
        ...state,
        error,
        isLoading: false,
      };
    }
    default:
      return state;
  }
};
