export const types = {
  GET_COMPARISON_DATA_REQUEST: 'GET_COMPARISON_DATA_REQUEST',
  GET_COMPARISON_DATA_SUCCESS: 'GET_COMPARISON_DATA_SUCCESS',
  GET_COMPARISON_DATA_FAILURE: 'GET_COMPARISON_DATA_FAILURE',
};

export const getComparisonDataRequest = () => ({
  type: types.GET_COMPARISON_DATA_REQUEST,
});

export const getComparisonDataSuccess = response => ({
  type: types.GET_COMPARISON_DATA_SUCCESS,
  payload: response,
});

export const getComparisonDataFailure = error => ({
  type: types.GET_COMPARISON_DATA_FAILURE,
  payload: error,
});

const initialState = {
  isLoading: false,
  error: null,
  lastUpdated: null,
  counts: {
    set1: {
      district: '',
      source: {},
    },
    set2: {
      district: '',
      source: {},
    },
  },
  timeToClose: {
    set1: {
      district: '',
      data: {},
    },
    set2: {
      district: '',
      data: {},
    },
  },
  frequency: {
    bins: [],
    set1: {
      district: '',
      counts: {},
    },
    set2: {
      district: '',
      counts: {},
    },
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_COMPARISON_DATA_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case types.GET_COMPARISON_DATA_SUCCESS:
      return {
        ...state,
        error: null,
        isLoading: false,
        ...action.payload,
      };
    case types.GET_COMPARISON_DATA_FAILURE: {
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
