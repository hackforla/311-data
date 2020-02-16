import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';
import moment from 'moment';
import DatePicker from 'react-datepicker';

import {
  updateStartDate,
  updateEndDate,
} from '../../../../redux/reducers/data';

import Button from '../../../common/Button';
import Icon from '../../../common/Icon';

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
  handleClick,
  updateStart,
  updateEnd,
}) => {
  const [startDate, updateLocalStart] = useState();
  const [endDate, updateLocalEnd] = useState();

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
        <a href="# " onClick={handleClick}>
          <Icon
            id="date-picker-close-button"
            icon="times"
            color="grey"
          />
        </a>
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
              minDate={moment('01/01/2015', 'MM/DD/YYYY').toDate()}
              maxDate={moment().toDate()}
              selectsStart
              showYearDropdown
              showMonthDropdown
              showPopperArrow={false}
              popperPlacement="right"
              onChange={(date) => handleDateChange(updateLocalStart, date)}
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
              startDate={endDate}
              endDate={endDate}
              minDate={startDate}
              maxDate={moment().toDate()}
              showYearDropdown
              showMonthDropdown
              selectsEnd
              showPopperArrow={false}
              popperPlacement="right"
              onChange={(date) => handleDateChange(updateLocalEnd, date)}
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
              if (startDate && endDate) {
                const formatDate = (date) => moment(date).format('MM/DD/YYYY');
                updateStart(formatDate(startDate));
                updateEnd(formatDate(endDate));
                handleClick();
              } else {
                alert('Provide valid start and end dates.');
              }
            }}
          />
        </div>
      </footer>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  updateStart: (newStartDate) => dispatch(updateStartDate(newStartDate)),
  updateEnd: (newEndDate) => dispatch(updateEndDate(newEndDate)),
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
};

DateRangePicker.defaultProps = {
  title: undefined,
  style: undefined,
};
