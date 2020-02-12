// import axios from 'axios';

import { COUNCILS } from '../../components/common/CONSTANTS';

const types = {
  UPDATE_YEAR: 'UPDATE_YEAR',
  UPDATE_START_MONTH: 'UPDATE_START_MONTH',
  UPDATE_END_MONTH: 'UPDATE_END_MONTH',
  UPDATE_REQUEST_TYPE: 'UPDATE_REQUEST_TYPE',
  TOGGLE_NEIGHBORHOOD_COUNCIL: 'TOGGLE_NEIGHBORHOOD_COUNCIL',
};

export const updateYear = (year) => ({
  type: types.UPDATE_YEAR,
  payload: year,
});

export const updateStartMonth = (startMonth) => ({
  type: types.UPDATE_START_MONTH,
  payload: startMonth,
});

export const updateEndMonth = (endMonth) => ({
  type: types.UPDATE_END_MONTH,
  payload: endMonth,
});

export const updateRequestType = (requestType) => ({
  type: types.UPDATE_REQUEST_TYPE,
  payload: requestType,
});

export const toggleNeighborhoodCouncil = (council) => ({
  type: types.TOGGLE_NEIGHBORHOOD_COUNCIL,
  payload: council,
});

const makeCouncilState = () => COUNCILS.reduce((acc, council) => {
  acc[council] = false;
  return acc;
}, { all: false });

const initialState = {
  year: '2015',
  startMonth: '1',
  endMonth: '12',
  requestType: 'Bulky Items',
  councils: makeCouncilState(),
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_YEAR:
      return {
        ...state,
        year: action.payload,
      };
    case types.UPDATE_START_MONTH:
      return {
        ...state,
        startMonth: action.payload,
      };
    case types.UPDATE_END_MONTH:
      return {
        ...state,
        endMonth: action.payload,
      };
    case types.UPDATE_REQUEST_TYPE:
      return {
        ...state,
        requestType: action.payload,
      };
    case types.TOGGLE_NEIGHBORHOOD_COUNCIL: {
      const { payload } = action;

      const newCouncilsState = { ...state.councils };

      newCouncilsState[payload] = !newCouncilsState[payload];

      return {
        ...state,
        councils: newCouncilsState,
      };
    }
    default:
      return state;
  }
};
