import { REQUEST_TYPES, DATE_RANGES, COUNCILS } from '@components/common/CONSTANTS';

export const types = {
  UPDATE_DATE_RANGE: 'UPDATE_DATE_RANGE',
};

export const updateDateRange = ({ dateRange, startDate, endDate }) => ({
  type: types.UPDATE_DATE_RANGE,
  payload: { dateRange, startDate, endDate },
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
    default:
      return state;
  }
};
