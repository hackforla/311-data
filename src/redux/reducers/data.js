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
  data: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_DATA_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case types.GET_DATA_SUCCESS: {
      const { data, lastPulled: lastUpdated } = action.payload;

      return {
        ...state,
        data,
        error: null,
        isLoading: false,
        lastUpdated,
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
