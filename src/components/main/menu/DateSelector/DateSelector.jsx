import React from 'react';
import PropTypes from 'proptypes';
import moment from 'moment';
import Dropdown from '../../../common/Dropdown';

import COLORS from '../../../../styles/COLORS';

const getDates = (dateOptionValue) => {
  let startDate;
  const endDate = moment().format('MM/DD/YYYY');
  const formatPriorDate = (num, timeInterval) => moment().subtract(num, timeInterval).format('MM/DD/YYYY');

  switch (dateOptionValue) {
    case 'LAST_WEEK':
      startDate = formatPriorDate(1, 'week');
      break;
    case 'LAST_MONTH':
      startDate = formatPriorDate(1, 'month');
      break;
    case 'LAST_6_MONTHS':
      startDate = formatPriorDate(6, 'months');
      break;
    case 'LAST_12_MONTHS':
      startDate = formatPriorDate(12, 'months');
      break;
    case 'YEAR_TO_DATE':
      startDate = moment().startOf('year').format('MM/DD/YYYY');
      break;
    case 'CUSTOM_DATE_RANGE':
      // DISPATCH MODALOPEN: TRUE
      break;

    // comment below circumvents eslint(default-case)
    // no default
  }
  return { startDate, endDate };
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
  startDate: PropTypes.string,
  endDate: PropTypes.string,
};

DateSelector.defaultProps = {
  style: undefined,
  startDate: undefined,
  endDate: undefined,
};
