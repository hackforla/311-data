export const types = {
  GET_DATA_REQUEST: 'GET_DATA_REQUEST',
  GET_PINS_SUCCESS: 'GET_PINS_SUCCESS',
  GET_PINS_FAILURE: 'GET_PINS_FAILURE',
  GET_PIN_INFO_REQUEST: 'GET_PIN_INFO_REQUEST',
  GET_PIN_INFO_SUCCESS: 'GET_PIN_INFO_SUCCESS',
  GET_PIN_INFO_FAILURE: 'GET_PIN_INFO_FAILURE',
  GET_PIN_CLUSTERS_SUCCESS: 'GET_PIN_CLUSTERS_SUCCESS',
  GET_PIN_CLUSTERS_FAILURE: 'GET_PIN_CLUSTERS_FAILURE',
  GET_HEATMAP_SUCCESS: 'GET_HEATMAP_SUCCESS',
  GET_HEATMAP_FAILURE: 'GET_HEATMAP_FAILURE',
  GET_VIS_DATA_SUCCESS: 'GET_VIS_DATA_SUCCESS',
  GET_VIS_DATA_FAILURE: 'GET_VIS_DATA_FAILURE',
  SEND_GIT_REQUEST: 'SEND_GIT_REQUEST',
  GIT_RESPONSE_SUCCESS: 'GIT_RESPONSE_SUCCESS',
  GIT_RESPONSE_FAILURE: 'GIT_RESPONSE_FAILURE',
};

export const getDataRequest = () => ({
  type: types.GET_DATA_REQUEST,
});

export const getPinsSuccess = response => ({
  type: types.GET_PINS_SUCCESS,
  payload: response,
});

export const getPinsFailure = error => ({
  type: types.GET_PINS_FAILURE,
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

export const getPinClustersSuccess = response => ({
  type: types.GET_PIN_CLUSTERS_SUCCESS,
  payload: response,
});

export const getPinClustersFailure = error => ({
  type: types.GET_PIN_CLUSTERS_FAILURE,
  payload: error,
});

export const getHeatmapSuccess = response => ({
  type: types.GET_HEATMAP_SUCCESS,
  payload: response,
});

export const getHeatmapFailure = error => ({
  type: types.GET_HEATMAP_FAILURE,
  payload: error,
});

export const getVisDataSuccess = response => ({
  type: types.GET_VIS_DATA_SUCCESS,
  payload: response,
});

export const getVisDataFailure = error => ({
  type: types.GET_VIS_DATA_FAILURE,
  payload: error,
});

export const sendGitRequest = fields => ({
  type: types.SEND_GIT_REQUEST,
  payload: fields,
});

export const gitResponseSuccess = response => ({
  type: types.GIT_RESPONSE_SUCCESS,
  payload: response,
});

export const gitResponseFailure = error => ({
  type: types.GIT_RESPONSE_FAILURE,
  payload: error,
});

const initialState = {
  isMapLoading: false,
  isVisLoading: false,
  error: null,
  pins: [],
  pinClusters: [],
  heatmap: [],
  pinsInfo: {},
  counts: {},
  frequency: {
    bins: [],
    counts: {},
  },
  timeToClose: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_DATA_REQUEST:
      return {
        ...state,
        isMapLoading: true,
        isVisLoading: true,
      };
    case types.GET_PINS_SUCCESS:
      return {
        ...state,
        error: null,
        pins: action.payload,
        isMapLoading: false,
      };
    case types.GET_PINS_FAILURE: {
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
        isMapLoading: false,
      };
    }
    case types.GET_PIN_INFO_SUCCESS:
      return {
        ...state,
        error: null,
        pinsInfo: {
          ...state.pinsInfo,
          [action.payload.srnumber]: action.payload,
        },
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
      };
    }
    case types.GET_PIN_CLUSTERS_SUCCESS:
      return {
        ...state,
        error: null,
        pinClusters: action.payload,
        isMapLoading: false,
      };
    case types.GET_PIN_CLUSTERS_FAILURE: {
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
        isMapLoading: false,
      };
    }
    case types.GET_HEATMAP_SUCCESS:
      return {
        ...state,
        error: null,
        heatmap: action.payload,
      };
    case types.GET_HEATMAP_FAILURE: {
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
    case types.GET_VIS_DATA_SUCCESS:
      return {
        ...state,
        error: null,
        ...action.payload,
        isVisLoading: false,
      };
    case types.GET_VIS_DATA_FAILURE: {
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
        isVisLoading: false,
      };
    }
    case types.GIT_RESPONSE_SUCCESS:
      return {
        ...state,
        error: null,
      };
    case types.GIT_RESPONSE_FAILURE: {
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
