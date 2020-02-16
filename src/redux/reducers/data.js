// import axios from 'axios';

const types = {
  UPDATE_START_DATE: 'UPDATE_START_DATE',
  UPDATE_END_DATE: 'UPDATE_END_DATE',
  UPDATE_REQUEST_TYPE: 'UPDATE_REQUEST_TYPE',
  UPDATE_NEIGHBORHOOD_COUNCIL: 'UPDATE_NEIGHBORHOOD_COUNCIL',
};

export const updateStartDate = (newStartDate) => ({
  type: types.UPDATE_START_DATE,
  payload: newStartDate,
});

export const updateEndDate = (newEndDate) => ({
  type: types.UPDATE_END_DATE,
  payload: newEndDate,
});

export const updateRequestType = (requestType) => ({
  type: types.UPDATE_REQUEST_TYPE,
  payload: requestType,
});

export const updateNeighborhoodCouncil = (council) => ({
  type: types.UPDATE_NEIGHBORHOOD_COUNCIL,
  payload: council,
});

const initialState = {
  startDate: null,
  endDate: null,
  requestType: 'Bulky Items',
  council: null,
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
        requestType: action.payload,
      };
    case types.UPDATE_NEIGHBORHOOD_COUNCIL:
      return {
        ...state,
        council: action.payload,
      };
    default:
      return state;
  }
};
