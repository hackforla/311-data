import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';
import moment from 'moment';
import {
  updateStartDate,
  updateEndDate,
} from '../../../../redux/reducers/data';

import Dropdown from '../../../common/Dropdown';
import Modal from '../../../common/Modal';
import DateRangePicker from './DateRangePicker';
import Icon from '../../../common/Icon';
import HoverOverInfo from '../../../common/HoverOverInfo';

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

  useEffect(() => {
    const handleEscapeClick = (e) => {
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
      <div className="date-selector-title">
        <span
          className="has-text-weight-bold is-size-6"
          style={{ paddingRight: '10px' }}>
          Date Range Selection
        </span>
        <HoverOverInfo
          title="Date Range Selection"
          text="This filter allows the user to choose a date range for 311 data.">
          <Icon
            id="type-selector-info-icon"
            icon="info-circle"
            size="small"
          />
        </HoverOverInfo>
      </div>
      <div className="date-selector-dates" style={{ padding: '15px 0 10px' }}>
        <span className="has-text-weight-normal">
          {`Start ${startDate || placeHolder} To ${endDate || placeHolder}`}
        </span>
      </div>
      <div className="date-selector-dropdown">
        <Dropdown
          id="date-selector-dropdown"
          list={dateRangeOptions}
          title="Select Date Range"
          width="349px"
          style={{ color: COLORS.FONTS }}
          onClick={(dateOption) => {
            if (dateOption !== 'CUSTOM_DATE_RANGE') {
              const { newStartDate, newEndDate } = getDates(dateOption);
              updateStart(newStartDate);
              updateEnd(newEndDate);
            } else {
              setModalOpen(true);
            }
          }}
        />
      </div>
      <Modal
        open={modalOpen}
        content={(
          <DateRangePicker
            id="date-range-picker"
            title="Custom Range Filter"
            handleClick={() => setModalOpen(false)}
          />
        )}
      />
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DateSelector);

DateSelector.propTypes = {
  updateStart: PropTypes.func.isRequired,
  updateEnd: PropTypes.func.isRequired,
  style: PropTypes.shape({}),
  startDate: PropTypes.string,
  endDate: PropTypes.string,
};

DateSelector.defaultProps = {
  style: undefined,
  startDate: undefined,
  endDate: undefined,
};
