import React, { useState } from 'react';
import PropTypes from 'proptypes';
import DatePicker from 'react-datepicker';
import Button from '../../../common/Button';

import 'react-datepicker/dist/react-datepicker.css';
import COLORS from '../../../../styles/COLORS';

const cardStyle = {
  height: '299px',
  width: '400px',
  overflow: 'visible',
  boxShadow: '0px 6px 5px rgba(0, 0, 0, 0.5)',
};

const headerStyle = {
  height: '50px',
  background: COLORS.BACKGROUND,
  color: COLORS.FONTS,
  fontWeight: 'bold',
  fontSize: '20px',
  border: 'none',
  borderRadius: '0',
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

const containerDivStyle = {
  height: '42px',
  width: '317px',
  display: 'flex',
  alignItems: 'center',
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
          style={{
            color: headerStyle.color,
            paddingLeft: '18px',
            paddingTop: '18px',
          }}
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
          <div className="container" style={containerDivStyle}>
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
              ...containerDivStyle,
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
          borderRadius: '0',
        }}
      >
        <div className="container" style={{ paddingBottom: '30px' }}>
          <Button
            id="date-range-button"
            label="Save"
            style={{
              background: COLORS.BRAND.CTA1,
              color: COLORS.FONTS,
              fontWeight: 'bold',
              width: '125px',
              height: '42px',
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
