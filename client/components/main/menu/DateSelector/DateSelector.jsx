import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';
import { updateDateRange } from '@reducers/filters';
import {
  updateComparisonStartDate,
  updateComparisonEndDate,
} from '@reducers/comparisonFilters';

import Dropdown from '@components/common/Dropdown';
import Modal from '@components/common/Modal';
import DateRangePicker from './DateRangePicker';

import COLORS from '@styles/COLORS';
import { DATE_RANGES } from '@components/common/CONSTANTS';

const dateRangeOptions = DATE_RANGES.map(range => ({
  label: range.label,
  value: range.id,
}));

const DateSelector = ({
  style,
  comparison,
  dateRange,
  startDate,
  endDate,
  comparisonStartDate,
  comparisonEndDate,
  updateRange,
  updateComparisonStart,
  updateComparisonEnd,
}) => {
  const placeHolder = 'MM/DD/YYYY';
  const [modalOpen, setModalOpen] = useState(false);

  const handleSelection = rangeId => {
    if (rangeId === 'CUSTOM_DATE_RANGE')
      return setModalOpen(true);

    const { startDate, endDate } = DATE_RANGES.find(range => range.id === rangeId);
    if (comparison) {
      updateComparisonStart({ dateRange: rangeId, startDate });
      updateComparisonEnd(endDate);
    } else {
      updateRange({ dateRange: rangeId, startDate, endDate });
    }
  }

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
          value={dateRange}
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
  dateRange: state.filters.dateRange,
  startDate: state.filters.startDate,
  endDate: state.filters.endDate,
  comparisonStartDate: state.comparisonFilters.startDate,
  comparisonEndDate: state.comparisonFilters.endDate,
});

const mapDispatchToProps = dispatch => ({
  updateRange: ({ dateRange, startDate, endDate }) => {
    dispatch(updateDateRange({ dateRange, startDate, endDate }));
  },
  updateComparisonStart: newStartDate => dispatch(updateComparisonStartDate(newStartDate)),
  updateComparisonEnd: newEndDate => dispatch(updateComparisonEndDate(newEndDate)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DateSelector);

DateSelector.propTypes = {
  updateRange: PropTypes.func.isRequired,
  updateComparisonStart: PropTypes.func.isRequired,
  updateComparisonEnd: PropTypes.func.isRequired,
  style: PropTypes.shape({}),
  dateRange: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  comparisonStartDate: PropTypes.string,
  comparisonEndDate: PropTypes.string,
  comparison: PropTypes.bool,
};

DateSelector.defaultProps = {
  style: undefined,
  dateRange: undefined,
  startDate: undefined,
  endDate: undefined,
  comparisonStartDate: undefined,
  comparisonEndDate: undefined,
  comparison: false,
};
