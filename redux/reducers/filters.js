import { DATE_RANGES, INTERNAL_DATE_SPEC, USER_DATE_SPEC } from '@components/common/CONSTANTS';
import moment from 'moment';

export const types = {
  UPDATE_START_DATE: 'UPDATE_START_DATE',
  UPDATE_END_DATE: 'UPDATE_END_DATE',
  UPDATE_REQUEST_TYPES: 'UPDATE_REQUEST_TYPES',
  UPDATE_REQUEST_STATUS: 'UPDATE_REQUEST_STATUS',
  UPDATE_NEIGHBORHOOD_COUNCIL: 'UPDATE_NEIGHBORHOOD_COUNCIL',
  UPDATE_SELECTED_COUNCILS: 'UPDATE_SELECTED_COUNCILS',
  UPDATE_UNSELECTED_COUNCILS: 'UPDATE_UNSELECTED_COUNCILS',
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

export const updateSelectedCouncils = councils => ({
  type: types.UPDATE_SELECTED_COUNCILS,
  payload: councils,
});

export const updateUnselectedCouncils = councils => ({
  type: types.UPDATE_UNSELECTED_COUNCILS,
  payload: councils,
});

export const updateRequestStatus = status => ({
  type: types.UPDATE_REQUEST_STATUS,
  payload: status,
});

const initialState = {
  // dateRange: null,
  // Always store dates using the INTERNAL_DATE_SPEC.
  startDate: moment(DATE_RANGES[0].startDate, USER_DATE_SPEC).format(INTERNAL_DATE_SPEC),
  endDate: moment(DATE_RANGES[0].endDate, USER_DATE_SPEC).format(INTERNAL_DATE_SPEC),
  councilId: null,
  selected: [],
  unselected: [],
  requestTypes: {
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
    10: true,
    11: true,
    12: true,
  },
  requestStatus: {
    open: true,
    closed: false,
  },
};

export default (state = initialState, action) => {
  const url = new URL(window.location.href);
  const newSearchParams = url.searchParams;

  switch (action.type) {
    case types.UPDATE_START_DATE: {
      newSearchParams.set('startDate', action.payload);
      url.search = newSearchParams.toString();
      window.history.replaceState(null, 'Change URL', url);
      return {
        ...state,
        startDate: action.payload,
      };
    }
    case types.UPDATE_END_DATE: {
      newSearchParams.set('endDate', action.payload);
      url.search = newSearchParams.toString();
      window.history.replaceState(null, 'Change URL', url);
      return {
        ...state,
        endDate: action.payload,
      };
    }
    case types.UPDATE_REQUEST_TYPES:
      if (!state.requestTypes[action.payload]) {
        newSearchParams.delete(`rtId${action.payload}`);
      } else {
        newSearchParams.set(`rtId${action.payload}`, 'false');
      }
      url.search = newSearchParams.toString();
      window.history.replaceState(null, 'Change URL', url);
      return {
        ...state,
        requestTypes: {
          ...state.requestTypes,
          [action.payload]: !state.requestTypes[action.payload],
        },
      };
    case types.UPDATE_NEIGHBORHOOD_COUNCIL:
      if (action.payload === state.councilId) {
        newSearchParams.delete('councilId');
      } else {
        newSearchParams.set('councilId', action.payload);
      }
      url.search = newSearchParams.toString();
      window.history.replaceState(null, 'Change URL', url);
      return {
        ...state,
        councilId: action.payload,
      };
    case types.UPDATE_SELECTED_COUNCILS:
      return {
        ...state,
        selected: action.payload,
      };
    case types.UPDATE_UNSELECTED_COUNCILS:
      return {
        ...state,
        unselected: action.payload,
      };
    case types.UPDATE_REQUEST_STATUS:
      switch (action.payload) {
        case 'all':
          newSearchParams.set('requestStatusOpen', true);
          newSearchParams.set('requestStatusClosed', true);
          url.search = newSearchParams.toString();
          window.history.replaceState(null, 'Change URL', url);
          return {
            ...state,
            requestStatus: {
              ...state.requestStatus,
              open: true,
              closed: true,
            },
          };
        case 'open':
          newSearchParams.set('requestStatusOpen', true);
          newSearchParams.set('requestStatusClosed', false);
          url.search = newSearchParams.toString();
          window.history.replaceState(null, 'Change URL', url);
          return {
            ...state,
            requestStatus: {
              ...state.requestStatus,
              open: true,
              closed: false,
            },
          };
        case 'closed':
          newSearchParams.set('requestStatusOpen', false);
          newSearchParams.set('requestStatusClosed', true);
          url.search = newSearchParams.toString();
          window.history.replaceState(null, 'Change URL', url);
          return {
            ...state,
            requestStatus: {
              ...state.requestStatus,
              open: false,
              closed: true,
            },
          };

        // default to non-exclusive v1 'open' and 'closed' toggle code
        // where 'open' and 'closed' can be selected/deselected at same time
        // v2 will not need this default clause and should simply return state
        default:
          return {
            ...state,
            requestStatus: {
              ...state.requestStatus,
              [action.payload]: !state.requestStatus[action.payload],
            },
          };
      }
    default:
      return state;
  }
};
