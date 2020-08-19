import { REQUEST_TYPES, DATE_RANGES } from '@components/common/CONSTANTS';

export const types = {
  UPDATE_COMPARISON_START_DATE: 'UPDATE_COMPARISON_START_DATE',
  UPDATE_COMPARISON_END_DATE: 'UPDATE_COMPARISON_END_DATE',
  UPDATE_COMPARISON_REQUEST_TYPE: 'UPDATE_COMPARISON_REQUEST_TYPE',
  UPDATE_COMPARISON_LIST: 'UPDATE_COMPARISON_LIST',
  UPDATE_COMPARISON_DISTRICT: 'UPDATE_COMPARISON_DISTRICT',
  CLEAR_COMPARISON_SET: 'CLEAR_COMPARISON_SET',
  UPDATE_COMPARISON_CHART: 'UPDATE_COMPARISON_CHART',
  SELECT_ALL_COMPARISON_REQUEST_TYPES: 'SELECT_ALL_COMPARISON_REQUEST_TYPES',
  DESELECT_ALL_COMPARISON_REQUEST_TYPES: 'DESELECT_ALL_COMPARISON_REQUEST_TYPES',
};

export const updateComparisonStartDate = ({ dateRange, startDate }) => ({
  type: types.UPDATE_COMPARISON_START_DATE,
  payload: { dateRange, startDate },
});

export const updateComparisonEndDate = newEndDate => ({
  type: types.UPDATE_COMPARISON_END_DATE,
  payload: newEndDate,
});

export const updateComparisonRequestType = requestTypes => ({
  type: types.UPDATE_COMPARISON_REQUEST_TYPE,
  payload: requestTypes,
});

export const selectAllComparisonRequestTypes = () => ({
  type: types.SELECT_ALL_COMPARISON_REQUEST_TYPES,
});

export const deselectAllComparisonRequestTypes = () => ({
  type: types.DESELECT_ALL_COMPARISON_REQUEST_TYPES,
});

export const updateComparisonList = (set, list) => ({
  type: types.UPDATE_COMPARISON_LIST,
  payload: {
    set,
    list,
  },
});

export const updateComparisonDistrict = (set, district) => ({
  type: types.UPDATE_COMPARISON_DISTRICT,
  payload: {
    set,
    district,
  },
});

export const clearComparisonSet = set => ({
  type: types.CLEAR_COMPARISON_SET,
  payload: set,
});

export const updateComparisonChart = chart => ({
  type: types.UPDATE_COMPARISON_CHART,
  payload: chart,
});

// set all types to either true or false
const allRequestTypes = value => (
  Object.keys(REQUEST_TYPES).reduce((acc, type) => {
    acc[type] = value;
    return acc;
  }, { All: value })
);

const initialState = {
  dateRange: DATE_RANGES[0].id,
  startDate: DATE_RANGES[0].startDate,
  endDate: DATE_RANGES[0].endDate,
  comparison: {
    chart: '',
    set1: {
      district: '',
      list: [],
    },
    set2: {
      district: '',
      list: [],
    },
  },
  requestTypes: allRequestTypes(false),
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_COMPARISON_START_DATE: {
      const { dateRange, startDate } = action.payload;
      return {
        ...state,
        startDate,
        dateRange,
      };
    }
    case types.UPDATE_COMPARISON_END_DATE: {
      return {
        ...state,
        endDate: action.payload,
      };
    }
    case types.UPDATE_COMPARISON_REQUEST_TYPE:
      return {
        ...state,
        requestTypes: {
          ...state.requestTypes,
          All: false,
          [action.payload]: !state.requestTypes[action.payload],
        },
      };
    case types.SELECT_ALL_COMPARISON_REQUEST_TYPES:
      return {
        ...state,
        requestTypes: allRequestTypes(true),
      };
    case types.DESELECT_ALL_COMPARISON_REQUEST_TYPES:
      return {
        ...state,
        requestTypes: initialState.requestTypes,
      };
    case types.UPDATE_COMPARISON_LIST:
      return {
        ...state,
        comparison: {
          ...state.comparison,
          [action.payload.set]: {
            ...state.comparison[action.payload.set],
            list: action.payload.list,
          },
        },
      };
    case types.UPDATE_COMPARISON_DISTRICT:
      return {
        ...state,
        comparison: {
          ...state.comparison,
          [action.payload.set]: {
            ...state.comparison[action.payload.set],
            district: action.payload.district,
          },
        },
      };
    case types.CLEAR_COMPARISON_SET:
      return {
        ...state,
        comparison: {
          ...state.comparison,
          [action.payload]: initialState.comparison[action.payload],
        },
      };
    case types.UPDATE_COMPARISON_CHART:
      return {
        ...state,
        comparison: {
          ...state.comparison,
          chart: action.payload,
        },
      };
    default:
      return state;
  }
};
