export const types = {
  UPDATE_START_DATE: 'UPDATE_START_DATE',
  UPDATE_END_DATE: 'UPDATE_END_DATE',
  UPDATE_REQUEST_TYPES: 'UPDATE_REQUEST_TYPES',
  UPDATE_NEIGHBORHOOD_COUNCIL: 'UPDATE_NEIGHBORHOOD_COUNCIL',
  SELECT_ALL_REQUEST_TYPES: 'SELECT_ALL_REQUEST_TYPES',
  DESELECT_ALL_REQUEST_TYPES: 'DESELECT_ALL_REQUEST_TYPES',
};

export const updateStartDate = ({ dateRange, startDate }) => ({
  type: types.UPDATE_START_DATE,
  payload: { dateRange, startDate },
});

export const updateEndDate = newEndDate => ({
  type: types.UPDATE_END_DATE,
  payload: newEndDate,
});

export const updateRequestTypes = requestTypes => ({
  type: types.UPDATE_REQUEST_TYPES,
  payload: requestTypes,
});

export const updateNC = councils => ({
  type: types.UPDATE_NEIGHBORHOOD_COUNCIL,
  payload: councils.map(({ councilId }) => councilId),
});

const initialState = {
  dateRange: null,
  startDate: null,
  endDate: null,
  councils: [],
  requestTypes: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_START_DATE: {
      const { dateRange, startDate } = action.payload;
      return {
        ...state,
        startDate,
        dateRange,
      };
    }
    case types.UPDATE_END_DATE: {
      return {
        ...state,
        endDate: action.payload,
      };
    }
    case types.UPDATE_REQUEST_TYPES:
      return {
        ...state,
        requestTypes: action.payload,
      };
    case types.UPDATE_NEIGHBORHOOD_COUNCIL:
      return {
        ...state,
        councils: action.payload,
      };
    default:
      return state;
  }
};
