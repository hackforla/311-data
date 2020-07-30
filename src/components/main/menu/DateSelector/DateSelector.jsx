import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';
import moment from 'moment';
import {
  updateStartDate,
  updateEndDate,
} from '@reducers/filters';
import {
  updateComparisonStartDate,
  updateComparisonEndDate,
} from '@reducers/comparisonFilters';

import Dropdown from '../../../common/Dropdown';
import Modal from '../../../common/Modal';
import DateRangePicker from './DateRangePicker';

import COLORS from '../../../../styles/COLORS';

const getDates = dateOptionValue => {
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
    default:
      break;
  }
  return { newStartDate, newEndDate };
};

const DateSelector = ({
  style,
  comparison,
  startDate,
  endDate,
  comparisonStartDate,
  comparisonEndDate,
  updateStart,
  updateEnd,
  updateComparisonStart,
  updateComparisonEnd,
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
  const [modalOpen, setModalOpen] = useState(false);

  const handleSelection = dateOption => {
    const dispatchStart = comparison ? updateComparisonStart : updateStart;
    const dispatchEnd = comparison ? updateComparisonEnd : updateEnd;

    if (dateOption !== 'CUSTOM_DATE_RANGE') {
      const { newStartDate, newEndDate } = getDates(dateOption);
      dispatchStart({ dateRange: dateOption, startDate: newStartDate });
      dispatchEnd(newEndDate);
    } else {
      setModalOpen(true);
    }
  };

  useEffect(() => {
    const handleEscapeClick = e => {
      if (e.keyCode !== 27) {
        return;
      }
      setModalOpen(false);
    };

    if (modalOpen) {
      document.addEventListener('keydown', handleEscapeClick);
    } else {
      document.removeEventListener('keydown', handleEscapeClick);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeClick);
    };
  }, [modalOpen]);

  return (
    <div
      className="date-selector-container"
      style={{
        width: '349px',
        color: COLORS.FONTS,
        ...style,
      }}
    >
      <div className="date-selector-dates" style={{ padding: '0 0 10px' }}>
        <span className="has-text-weight-normal">
          {`Start ${(comparison ? comparisonStartDate : startDate) || placeHolder}
          To ${(comparison ? comparisonEndDate : endDate) || placeHolder}`}
        </span>
      </div>
      <div className="date-selector-dropdown">
        <Dropdown
          id="date-selector-dropdown"
          list={dateRangeOptions}
          title="Select Date Range"
          width="349px"
          style={{ color: COLORS.FONTS }}
          onClick={handleSelection}
        />
      </div>
      <Modal
        open={modalOpen}
        content={(
          <DateRangePicker
            id="date-range-picker"
            title="Custom Range Filter"
            comparison={comparison}
            handleClick={() => setModalOpen(false)}
          />
        )}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  startDate: state.filters.startDate,
  endDate: state.filters.endDate,
  comparisonStartDate: state.comparisonFilters.startDate,
  comparisonEndDate: state.comparisonFilters.endDate,
});

const mapDispatchToProps = dispatch => ({
  updateStart: newStartDate => dispatch(updateStartDate(newStartDate)),
  updateEnd: newEndDate => dispatch(updateEndDate(newEndDate)),
  updateComparisonStart: newStartDate => dispatch(updateComparisonStartDate(newStartDate)),
  updateComparisonEnd: newEndDate => dispatch(updateComparisonEndDate(newEndDate)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DateSelector);

DateSelector.propTypes = {
  updateStart: PropTypes.func.isRequired,
  updateEnd: PropTypes.func.isRequired,
  updateComparisonStart: PropTypes.func.isRequired,
  updateComparisonEnd: PropTypes.func.isRequired,
  style: PropTypes.shape({}),
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  comparisonStartDate: PropTypes.string,
  comparisonEndDate: PropTypes.string,
  comparison: PropTypes.bool,
};

DateSelector.defaultProps = {
  style: undefined,
  startDate: undefined,
  endDate: undefined,
  comparisonStartDate: undefined,
  comparisonEndDate: undefined,
  comparison: false,
};
