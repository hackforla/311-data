import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';
import moment from 'moment';
import {
  updateStartDate,
  updateEndDate,
  openDateRangeModal,
} from '../../../../redux/reducers/data';

import Dropdown from '../../../common/Dropdown';
import COLORS from '../../../../styles/COLORS';

const getDates = (dateOptionValue) => {
  let newStartDate;
  const newEndDate = moment().format('MM/DD/YYYY');
  const formatPriorDate = (num, timeInterval) => moment().subtract(num, timeInterval).format('MM/DD/YYYY');

  switch (dateOptionValue) {
    case 'LAST_WEEK':
      newStartDate = formatPriorDate(1, 'week');
      break;
    case 'LAST_MONTH':
      newStartDate = formatPriorDate(1, 'month');
      break;
    case 'LAST_6_MONTHS':
      newStartDate = formatPriorDate(6, 'months');
      break;
    case 'LAST_12_MONTHS':
      newStartDate = formatPriorDate(12, 'months');
      break;
    case 'YEAR_TO_DATE':
      newStartDate = moment().startOf('year').format('MM/DD/YYYY');
      break;

    // comment below circumvents eslint(default-case)
    // no default
  }
  return { newStartDate, newEndDate };
};

const DateSelector = ({
  style,
  startDate,
  endDate,
  updateStart,
  updateEnd,
  openDateModal,
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
          width="349px"
          onClick={(dateOption) => {
            if (dateOption !== 'CUSTOM_DATE_RANGE') {
              const { newStartDate, newEndDate } = getDates(dateOption);
              updateStart(newStartDate);
              updateEnd(newEndDate);
            } else {
              openDateModal();
            }
          }}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  startDate: state.data.startDate,
  endDate: state.data.endDate,
});

const mapDispatchToProps = (dispatch) => ({
  updateStart: (newStartDate) => dispatch(updateStartDate(newStartDate)),
  updateEnd: (newEndDate) => dispatch(updateEndDate(newEndDate)),
  openDateModal: () => dispatch(openDateRangeModal()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DateSelector);

DateSelector.propTypes = {
  updateStart: PropTypes.func.isRequired,
  updateEnd: PropTypes.func.isRequired,
  openDateModal: PropTypes.func.isRequired,
  style: PropTypes.shape({}),
  startDate: PropTypes.string,
  endDate: PropTypes.string,
};

DateSelector.defaultProps = {
  style: undefined,
  startDate: undefined,
  endDate: undefined,
};
