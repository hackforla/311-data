import { REQUEST_TYPES } from '@components/common/CONSTANTS';

export const types = {
  UPDATE_START_DATE: 'UPDATE_START_DATE',
  UPDATE_END_DATE: 'UPDATE_END_DATE',
  UPDATE_REQUEST_TYPE: 'UPDATE_REQUEST_TYPE',
  UPDATE_NEIGHBORHOOD_COUNCIL: 'UPDATE_NEIGHBORHOOD_COUNCIL',
  UPDATE_COMPARISON_LIST: 'UPDATE_COMPARISON_LIST',
  UPDATE_COMPARISON_DISTRICT: 'UPDATE_COMPARISON_DISTRICT',
  UPDATE_COMPARISON_CHART: 'UPDATE_COMPARISON_CHART',
  SELECT_ALL_REQUEST_TYPES: 'SELECT_ALL_REQUEST_TYPES',
  DESELECT_ALL_REQUEST_TYPES: 'DESELECT_ALL_REQUEST_TYPES',
};

export const updateStartDate = newStartDate => ({
  type: types.UPDATE_START_DATE,
  payload: newStartDate,
});

export const updateEndDate = newEndDate => ({
  type: types.UPDATE_END_DATE,
  payload: newEndDate,
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

export const updateComparisonList = (set, list) => ({
  type: types.UPDATE_COMPARISON_SELECTION,
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
  startDate: null,
  endDate: null,
  councils: [],
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
    case types.UPDATE_REQUEST_TYPE:
      return {
        ...state,
        requestTypes: {
          ...state.requestTypes,
          // Flips boolean value for selected request type
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
        requestTypes: initialState.requestTypes,
      };
    case types.UPDATE_NEIGHBORHOOD_COUNCIL:
      return {
        ...state,
        councils: action.payload,
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
