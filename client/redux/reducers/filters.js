import { DATE_RANGES } from '@components/common/CONSTANTS';

export const types = {
  UPDATE_START_DATE: 'UPDATE_START_DATE',
  UPDATE_END_DATE: 'UPDATE_END_DATE',
  UPDATE_REQUEST_TYPES: 'UPDATE_REQUEST_TYPES',
  UPDATE_REQUEST_STATUS: 'UPDATE_REQUEST_STATUS',
  UPDATE_NEIGHBORHOOD_COUNCIL: 'UPDATE_NEIGHBORHOOD_COUNCIL',
  SELECT_ALL_REQUEST_TYPES: 'SELECT_ALL_REQUEST_TYPES',
  DESELECT_ALL_REQUEST_TYPES: 'DESELECT_ALL_REQUEST_TYPES',
};

export const updateStartDate = startDate => ({
  type: types.UPDATE_START_DATE,
  payload: startDate,
});

export const updateEndDate = endDate => ({
  type: types.UPDATE_END_DATE,
  payload: endDate,
});

export const updateRequestTypes = typeId => ({
  type: types.UPDATE_REQUEST_TYPES,
  payload: typeId,
});

export const updateNcId = ncId => ({
  type: types.UPDATE_NEIGHBORHOOD_COUNCIL,
  payload: ncId,
});

export const updateRequestStatus = status => ({
  type: types.UPDATE_REQUEST_STATUS,
  payload: status,
});

const initialState = {
  // dateRange: null,
  startDate: DATE_RANGES[0].startDate,
  endDate: DATE_RANGES[0].endDate,
  councilId: null,
  requestTypes: {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    10: false,
    11: false,
    12: false,
  },
  requestStatus: {
    open: false,
    closed: false,
  },
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
    case types.UPDATE_REQUEST_TYPES:
      return {
        ...state,
        requestTypes: {
          ...state.requestTypes,
          [action.payload]: !state.requestTypes[action.payload],
        },
      };
    case types.UPDATE_NEIGHBORHOOD_COUNCIL:
      return {
        ...state,
        councilId: action.payload,
      };
    case types.UPDATE_REQUEST_STATUS:
      return {
        ...state,
        requestStatus: {
          ...state.requestStatus,
          [action.payload]: !state.requestStatus[action.payload],
        },
      };
    default:
      return state;
  }
};
