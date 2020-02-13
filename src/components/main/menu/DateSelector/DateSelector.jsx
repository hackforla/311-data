import React from 'react';
import PropTypes from 'proptypes';
import Dropdown from '../../../common/Dropdown';

import COLORS from '../../../../styles/COLORS';

const getDates = (dateOptionValue) => {
  let startDate;
  let endDate = new Date();

  switch (dateOptionValue) {
    case 'LAST_WEEK':
      console.log(dateOptionValue);
      // DO STUFF
      break;
    case 'LAST_MONTH':
      console.log(dateOptionValue);
      // do stuff
      break;
    case 'LAST_6_MONTHS':
      console.log(dateOptionValue);
      // DO STUFF
      break;
    case 'LAST_12_MONTHS':
      console.log(dateOptionValue);
      // DO STUFF
      break;
    case 'YEAR_TO_DATE':
      console.log(dateOptionValue);
      // DO STUFF
      break;
    case 'CUSTOM_DATE_RANGE':
      console.log(dateOptionValue);
      // DO STUFF
      break;

    // no default
  }
};

const DateSelector = ({
  style,

  // Map these to state
  startDate,
  endDate,
}) => {
  const placeHolder = 'MM/DD/YYYY';
  const dateRangeOptions = [
    { label: 'Last Week', value: 'LAST_WEEK' },
    { label: 'Last Month', value: 'LAST_MONTH' },
    { label: 'Last 6 Months', value: 'LAST_6_MONTHS' },
    { label: 'Last 12 months', value: 'LAST_12_MONTHS' },
    { label: 'Year to Date', value: 'YEAR_TO_DATE' },
    { label: 'Custom Date Range', value: 'CUSTOM_DATE_RANGE' },
  ];

  return (
    <div
      className="date-selector-container"
      style={{
        width: '349px',
        color: COLORS.FONTS,
        ...style,
      }}
    >
      <div className="date-selector-title">
        <span className="has-text-weight-bold is-size-5">
          Date Range Selection
        </span>
      </div>
      <div className="date-selector-dates" style={{ padding: '15px 0 10px' }}>
        <span className="has-text-weight-normal is-size-6">
          {`Start ${startDate || placeHolder} To ${endDate || placeHolder}`}
        </span>
      </div>

      <div className="date-selector-dropdown">
        <Dropdown
          id="date-selector-dropdown"
          list={dateRangeOptions}
          title="Select Date Range"
          onClick={getDates}
          width="349px"
        />
      </div>

    </div>
  );
};


export default DateSelector;

DateSelector.propTypes = {
  style: PropTypes.shape({}),
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
};

DateSelector.defaultProps = {
  style: undefined,
  startDate: undefined,
  endDate: undefined,
};
