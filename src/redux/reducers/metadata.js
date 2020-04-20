export const types = {
  GET_METADATA_REQUEST: 'GET_METADATA_REQUEST',
  GET_METADATA_SUCCESS: 'GET_METADATA_SUCCESS',
  GET_METADATA_FAILURE: 'GET_METADATA_FAILURE',
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

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_METADATA_SUCCESS:
      return {
        ...action.payload,
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
