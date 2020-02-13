import React, { useState } from 'react';
import PropTypes from 'proptypes';
import DatePicker from 'react-datepicker';
import Button from './Button';

import 'react-datepicker/dist/react-datepicker.css';
import COLORS from '../../styles/COLORS';

const cardStyle = {
  height: '225px',
  width: '350px',
  overflow: 'visible',
};

const headerStyle = {
  height: '50px',
  background: COLORS.BACKGROUND,
  color: COLORS.FONTS,
  fontWeight: 'bold',
  fontSize: '20px',
  border: 'none',
};

const textStyle = {
  fontSize: '16px',
};

const inputSpanStyle = {
  display: 'inline-block',
  width: '100px',
  color: headerStyle.color,
  ...textStyle,
};

const DateRangePicker = ({
  id,
  title,
  style,
}) => {
  const [startDate, updateStartDate] = useState();
  const [endDate, updateEndDate] = useState();

  const handleDateChange = (updateStartOrEndDate, date) => {
    updateStartOrEndDate(date);
  };

  return (
    <div
      id={id}
      className="modal-card"
      style={{ ...cardStyle, ...style }}
    >
      {/* ---------- Modal Card Header ---------- */}
      <header
        className="modal-card-head"
        style={headerStyle}
      >
        <p
          className="modal-card-title has-text-weight-bold is-size-5"
          style={{ color: headerStyle.color }}
        >
          {title}
        </p>
        <button
          type="button"
          className="delete"
          aria-label="close"
          onClick={() => {
            /*
             * Dispatch action to close modal
             */
          }}
        />
      </header>

      {/* ---------- Modal Card Body - main content ---------- */}
      <section
        className="modal-card-body"
        style={{
          overflow: 'visible',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="container">
          <div
            className="container"
            style={{
              height: '35px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            &nbsp;
            <span style={inputSpanStyle}>
              Start Date
            </span>
            <DatePicker
              todayButton="Today"
              selected={startDate}
              startDate={startDate}
              endDate={endDate}
              minDate={new Date('2015/1/1')}
              maxDate={new Date()}
              selectsStart
              showYearDropdown
              showMonthDropdown
              showPopperArrow={false}
              popperPlacement="right"
              onChange={(date) => handleDateChange(updateStartDate, date)}
              placeholderText="MM/DD/YYYY"
            />
          </div>
          <div
            className="container"
            style={{
              background: COLORS.FORMS.STROKE,
              height: '35px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            &nbsp;
            <span style={{ ...inputSpanStyle }}>
              End Date
            </span>
            <DatePicker
              todayButton="Today"
              selected={endDate}
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              maxDate={new Date()}
              showYearDropdown
              showMonthDropdown
              selectsStart
              showPopperArrow={false}
              popperPlacement="right"
              onChange={(date) => handleDateChange(updateEndDate, date)}
              placeholderText="MM/DD/YYYY"
            />
          </div>
        </div>
      </section>

      {/* ---------- Modal Card Footer - button(s) ---------- */}
      <footer
        className="modal-card-foot"
        style={{
          background: headerStyle.background,
          border: 'none',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <Button
            id="date-range-button"
            label="Save Changes"
            style={{
              background: COLORS.BRAND.CTA1,
              color: COLORS.FONTS,
              fontWeight: 'bold',
            }}
            handleClick={() => {
              /*
               * Dispatch start and end dates
               */
            }}
          />
        </div>
      </footer>
    </div>
  );
};

export default DateRangePicker;

DateRangePicker.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  style: PropTypes.shape({}),
};

DateRangePicker.defaultProps = {
  title: undefined,
  style: undefined,
};
