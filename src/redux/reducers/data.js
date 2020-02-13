import axios from 'axios';

const types = {
  UPDATE_START_DATE: 'UPDATE_START_DATE',
  UPDATE_END_DATE: 'UPDATE_END_DATE',
  UPDATE_REQUEST_TYPE: 'UPDATE_REQUEST_TYPE',
  UPDATE_NEIGHBORHOOD_COUNCIL: 'UPDATE_NEIGHBORHOOD_COUNCIL',
  OPEN_DATE_RANGE_MODAL: 'OPEN_DATE_RANGE_MODAL',
  CLOSE_DATE_RANGE_MODAL: 'CLOSE_DATE_RANGE_MODAL',
  // UPDATE_YEAR: 'UPDATE_YEAR',
  // UPDATE_START_MONTH: 'UPDATE_START_MONTH',
  // UPDATE_END_MONTH: 'UPDATE_END_MONTH',
};

// export const updateYear = (year) => ({
//   type: types.UPDATE_YEAR,
//   payload: year,
// });

// export const updateStartMonth = (startMonth) => ({
//   type: types.UPDATE_START_MONTH,
//   payload: startMonth,
// });

// export const updateEndMonth = (endMonth) => ({
//   type: types.UPDATE_END_MONTH,
//   payload: endMonth,
// });

export const openDateRangeModal = () => ({
  type: types.OPEN_DATE_RANGE_MODAL,
});

export const closeDateRangeModal = () => ({
  type: types.CLOSE_DATE_RANGE_MODAL,
});

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
  startDate: '01/01/2015',
  endDate: '02/10/2020',
  requestType: 'Bulky Items',
  council: null,
  // year: '2015',
  // startMonth: '1',
  // endMonth: '12',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.OPEN_DATE_RANGE_MODAL: {
      return {
        ...state,
        dateRangeModalOpen: true,
      };
    }
    case types.CLOSE_DATE_RANGE_MODAL: {
      return {
        ...state,
        dateRangeModalOpen: false,
      };
    }
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
