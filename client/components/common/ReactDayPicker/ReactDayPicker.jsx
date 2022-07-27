import 'react-day-picker/lib/style.css';

import {
  updateEndDate as reduxUpdateEndDate,
  updateStartDate as reduxUpdateStartDate,
} from '@reducers/filters';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import { connect } from 'react-redux';

import { INTERNAL_DATE_SPEC } from '../CONSTANTS';
import Styles from './Styles';
import WeekDay from './Weekday';

function ReactDayPicker({
  range, updateStartDate, updateEndDate, startDate, endDate,
}) {
  const [enteredTo, setEnteredTo] = useState(endDate);
  const isSelectingFirstDay = (from, to, day) => {
    const isBeforeFirstDay = from && DateUtils.isDayBefore(moment(day).toDate(),
      moment(from).toDate());
    const isRangeSelected = from && to;
    return !from || isBeforeFirstDay || isRangeSelected;
  };

  const setFromDay = day => {
    updateStartDate(moment(day).format(INTERNAL_DATE_SPEC));
  };

  const setFromToDay = day => {
    updateEndDate(moment(day).format(INTERNAL_DATE_SPEC));
  };

  const handleDayClick = day => {
    if (!range) {
      setFromDay(day);
      return;
    }

    if (startDate && endDate) {
      setFromDay(day);
      updateEndDate(null);
      setEnteredTo(null);
      return;
    }

    if (isSelectingFirstDay(startDate, endDate, day)) {
      setFromDay(day);
    } else {
      setFromToDay(day);
    }
  };

  const handleDayMouseEnter = day => {
    if (!range) return;
    if (!isSelectingFirstDay(startDate, endDate, day)) {
      setEnteredTo(day);
    }
  };
  const from = moment(startDate).toDate();
  const enteredToDate = moment(enteredTo).toDate();
  return (
    <>
      <Styles range={range} />
      <DayPicker
        className="Range"
        numberOfMonths={1}
        fromMonth={from}
        selectedDays={[from, { from, to: enteredToDate }]}
        disabledDays={{ ...(range && { before: from }) }}
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
