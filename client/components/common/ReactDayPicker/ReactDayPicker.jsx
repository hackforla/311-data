import 'react-day-picker/lib/style.css';

import {
  updateEndDate as reduxUpdateEndDate,
  updateStartDate as reduxUpdateStartDate,
} from '@reducers/filters';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import DayPicker from 'react-day-picker';
import { connect } from 'react-redux';

import { INTERNAL_DATE_SPEC } from '../CONSTANTS';
import Styles from './Styles';
import WeekDay from './Weekday';

/** A wrapper around react-day-picker that selects a date range. */
function ReactDayPicker({
  range, updateStartDate, updateEndDate, startDate, endDate,
}) {
  // enteredTo represents the day that the user is currently hovering over.
  const [enteredTo, setEnteredTo] = useState(endDate);

  const setFromDay = day => {
    updateStartDate(moment(day).format(INTERNAL_DATE_SPEC));
  };

  const setToDay = day => {
    updateEndDate(moment(day).format(INTERNAL_DATE_SPEC));
  };

  const handleDayClick = day => {
    if (!range) {
      setFromDay(day);
      return;
    }

    // Our date range selection logic is very simple: the user is selecting the
    // first day in their date range if from and to are set, or if they're both
    // unset. Otherwise, they are selecting the last day.
    if (!(startDate && endDate)) {
      setToDay(day);
      return;
    }
    setFromDay(day);
    updateEndDate(null);
    setEnteredTo(null);
  };

  const handleDayMouseEnter = day => {
    if (!range) return;
    if (startDate && !endDate) {
      setEnteredTo(day);
    }
  };

  const from = moment(startDate).toDate();
  const enteredToDate = moment(enteredTo).toDate();
  const today = new Date();
  const lastThreeMonths = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());

  return (
    <>
      <Styles range={range} />
      <DayPicker
        className="Range"
        disabledDays={{ before: lastThreeMonths, after: today }}
        numberOfMonths={1}
        fromMonth={from}
        selectedDays={[from, { from, to: enteredToDate }]}
        modifiers={{ start: from, end: enteredToDate }}
        onDayClick={handleDayClick}
        onDayMouseEnter={handleDayMouseEnter}
        weekdayElement={<WeekDay />}
      />
    </>
  );
}

ReactDayPicker.propTypes = {
  range: PropTypes.bool,
  updateStartDate: PropTypes.func,
  updateEndDate: PropTypes.func,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
};

ReactDayPicker.defaultProps = {
  range: false,
  updateStartDate: null,
  updateEndDate: null,
  startDate: null,
  endDate: null,
};

const mapDispatchToProps = dispatch => ({
  updateStartDate: date => dispatch(reduxUpdateStartDate(date)),
  updateEndDate: date => dispatch(reduxUpdateEndDate(date)),
});

const mapStateToProps = state => ({
  startDate: state.filters.startDate,
  endDate: state.filters.endDate,
});

export default connect(mapStateToProps, mapDispatchToProps)(ReactDayPicker);
