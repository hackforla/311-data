import { REQUEST_TYPES, DATE_RANGES, COUNCILS } from '@components/common/CONSTANTS';

export const types = {
  UPDATE_DATE_RANGE: 'UPDATE_DATE_RANGE',
  UPDATE_REQUEST_TYPE: 'UPDATE_REQUEST_TYPE',
  UPDATE_NEIGHBORHOOD_COUNCIL: 'UPDATE_NEIGHBORHOOD_COUNCIL',
  SELECT_ALL_REQUEST_TYPES: 'SELECT_ALL_REQUEST_TYPES',
  DESELECT_ALL_REQUEST_TYPES: 'DESELECT_ALL_REQUEST_TYPES',
};

export const updateDateRange = ({ dateRange, startDate, endDate }) => ({
  type: types.UPDATE_DATE_RANGE,
  payload: { dateRange, startDate, endDate },
});

export const updateRequestType = requestTypes => ({
  type: types.UPDATE_REQUEST_TYPE,
  payload: requestTypes,
});

export const selectAllRequestTypes = () => ({
  type: types.SELECT_ALL_REQUEST_TYPES,
});

export const deselectAllRequestTypes = () => ({
  type: types.DESELECT_ALL_REQUEST_TYPES,
});

export const updateNC = council => ({
  type: types.UPDATE_NEIGHBORHOOD_COUNCIL,
  payload: council,
});

// set all types to either true or false
const allRequestTypes = value => (
  Object.keys(REQUEST_TYPES).reduce((acc, type) => {
    acc[type] = value;
    return acc;
  }, { All: value })
);

const allCouncils = COUNCILS.map(council => council.name);

const initialState = {
  dateRange: DATE_RANGES[0].id,
  startDate: DATE_RANGES[0].startDate,
  endDate: DATE_RANGES[0].endDate,
  councils: allCouncils,
  requestTypes: allRequestTypes(true),
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_DATE_RANGE: {
      const { dateRange, startDate, endDate } = action.payload;
      return {
        ...state,
        dateRange,
        startDate,
        endDate,
      };
    }
    case types.UPDATE_REQUEST_TYPE:
      return {
        ...state,
        requestTypes: {
          ...state.requestTypes,
          All: false,
          [action.payload]: !state.requestTypes[action.payload],
        },
      };
    case types.SELECT_ALL_REQUEST_TYPES:
      return {
        ...state,
        requestTypes: allRequestTypes(true),
      };
    case types.DESELECT_ALL_REQUEST_TYPES:
      return {
        ...state,
        requestTypes: allRequestTypes(false),
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
