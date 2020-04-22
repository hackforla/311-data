import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';
import moment from 'moment';
import clx from 'classnames';
import DatePicker from 'react-datepicker';
import Button from '@components/common/Button';
import DatePickerSVG from '@assets/datepicker.svg';
import {
  updateStartDate,
  updateEndDate,
} from '@reducers/filters';
import {
  updateComparisonStartDate,
  updateComparisonEndDate,
} from '@reducers/comparisonFilters';

const DateRangePicker = ({
  id,
  title,
  style,
  comparison,
  handleClick,
  updateStart,
  updateEnd,
  updateComparisonStart,
  updateComparisonEnd,
}) => {
  const [startDate, updateLocalStart] = useState();
  const [endDate, updateLocalEnd] = useState();
  const [focus, setFocus] = useState();
  const [error, setError] = useState();
  const [startError, setStartError] = useState();
  const [endError, setEndError] = useState();

  const handleDateChange = (updateStartOrEndDate, date) => {
    updateStartOrEndDate(date);
  };

  const clearErrors = () => {
    setError(null);
    setStartError(false);
    setEndError(false);
  };

  return (
    <div
      id={id}
      className="date-range-picker modal-card"
      style={style}
    >
      {/* ---------- Modal Card Header ---------- */}
      <header className="modal-card-head">
        <h1>{ title }</h1>
        <Button
          id="date-picker-close-button"
          className="picker-close-button"
          icon="times"
          handleClick={() => { clearErrors(); handleClick(); }}
        />
      </header>

      {/* ---------- Modal Card Body - main content ---------- */}
      <section className="modal-card-body">
        <div className="container">
          <div className={clx('container', 'inner', { focus: focus === 'start' })}>
            <span className="input-label">
              Start Date
            </span>
            <span className={clx('input-wrapper', { error: startError })}>
              <DatePicker
                todayButton="Today"
                selected={startDate}
                startDate={startDate}
                endDate={endDate}
                minDate={moment('01/01/2015', 'MM/DD/YYYY').toDate()}
                maxDate={moment().toDate()}
                selectsStart
                showYearDropdown
                showMonthDropdown
                showPopperArrow={false}
                popperPlacement="right"
                onChange={date => handleDateChange(updateLocalStart, date)}
                onFocus={() => { setFocus('start'); clearErrors(); }}
                placeholderText="MM/DD/YYYY"
                className="date-input"
              />
              <span className="svg-wrapper">
                <DatePickerSVG />
              </span>
            </span>
          </div>
          <div className={clx('container', 'inner', { focus: focus === 'end' })}>
            <span className="input-label">
              End Date
            </span>
            <span className={clx('input-wrapper', { error: endError })}>
              <DatePicker
                todayButton="Today"
                selected={endDate}
                startDate={endDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={moment().toDate()}
                showYearDropdown
                showMonthDropdown
                selectsEnd
                showPopperArrow={false}
                popperPlacement="right"
                onChange={date => handleDateChange(updateLocalEnd, date)}
                onFocus={() => { setFocus('end'); clearErrors(); }}
                placeholderText="MM/DD/YYYY"
                className="date-input"
              />
              <span className="svg-wrapper">
                <DatePickerSVG />
              </span>
            </span>
          </div>
          <div className="error-message">{ error }</div>
        </div>
      </section>

      {/* ---------- Modal Card Footer - button(s) ---------- */}
      <footer className="modal-card-foot">
        <div className="container">
          <Button
            id="date-range-button"
            className="date-range-button"
            label="Save"
            handleClick={() => {
              setFocus(null);
              if (startDate && endDate) {
                const formatDate = date => moment(date).format('MM/DD/YYYY');
                const dispatchStart = comparison ? updateComparisonStart : updateStart;
                const dispatchEnd = comparison ? updateComparisonEnd : updateEnd;
                dispatchStart(formatDate(startDate));
                dispatchEnd(formatDate(endDate));
                handleClick();
              } else if (!startDate && !endDate) {
                setError('Please provide start and end dates.');
                setStartError(true);
                setEndError(true);
              } else if (!startDate) {
                setError('Please provide a start date.');
                setStartError(true);
              } else if (!endDate) {
                setError('Please provide an end date.');
                setEndError(true);
              }
            }}
          />
        </div>
      </footer>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  updateStart: newStartDate => dispatch(updateStartDate(newStartDate)),
  updateEnd: newEndDate => dispatch(updateEndDate(newEndDate)),
  updateComparisonStart: newStartDate => dispatch(updateComparisonStartDate(newStartDate)),
  updateComparisonEnd: newEndDate => dispatch(updateComparisonEndDate(newEndDate)),
});

export default connect(
  null,
  mapDispatchToProps,
)(DateRangePicker);

DateRangePicker.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  style: PropTypes.shape({}),
  handleClick: PropTypes.func.isRequired,
  updateStart: PropTypes.func.isRequired,
  updateEnd: PropTypes.func.isRequired,
  updateComparisonStart: PropTypes.func.isRequired,
  updateComparisonEnd: PropTypes.func.isRequired,
  comparison: PropTypes.bool,
};

DateRangePicker.defaultProps = {
  title: undefined,
  style: undefined,
  comparison: false,
};
