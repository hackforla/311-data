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

const getInitialState = initialDates => {
  const [from, to] = initialDates;
  return {
    from,
    to,
    enteredTo: to, // Keep track of the last day for mouseEnter.
  };
};

const defaultState = { from: null, to: null };

function ReactDayPicker({
  onChange, initialDates, range, updateStartDate,
  updateEndDate,
}) {
  const [state, setState] = useState(getInitialState(initialDates));

  const isSelectingFirstDay = (from, to, day) => {
    const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
    const isRangeSelected = from && to;
    return !from || isBeforeFirstDay || isRangeSelected;
  };

  const resetDays = () => {
    setState(defaultState);
    onChange([]);
  };

  const setFromDay = day => {
    setState(() => ({
      from: day,
      to: null,
      enteredTo: null,
    }));
    updateStartDate(moment(day).format(INTERNAL_DATE_SPEC));
    onChange([day]);
  };

  const setFromToDay = day => {
    setState(prevState => ({
      ...prevState,
      to: day,
      enteredTo: day,
    }));
    updateEndDate(moment(day).format(INTERNAL_DATE_SPEC));
    onChange([state.from, day]);
  };

  const handleDayClick = day => {
    if (!range) {
      setFromDay(day);
      return;
    }

    const { from, to } = state;
    const dayIsInSelectedRange = from && to && day >= from && day <= to;
    const sameDaySelected = from ? day.getTime() === from.getTime() : false;

    if (dayIsInSelectedRange || sameDaySelected) {
      resetDays();
      return;
    }

    if (isSelectingFirstDay(from, to, day)) {
      setFromDay(day);
    } else {
      setFromToDay(day);
    }
  };

  const handleDayMouseEnter = day => {
    if (!range) return;
    const { from, to } = state;
    if (!isSelectingFirstDay(from, to, day)) {
      setState(prevState => ({
        ...prevState,
        enteredTo: day,
      }));
    }
  };

  const { from, enteredTo } = state;

  return (
    <>
      <Styles range={range} />
      <DayPicker
        className="Range"
        numberOfMonths={1}
        fromMonth={from}
        selectedDays={[from, { from, to: enteredTo }]}
        disabledDays={{ ...(range && { before: from }) }}
        modifiers={{ start: from, end: enteredTo }}
        onDayClick={handleDayClick}
        onDayMouseEnter={handleDayMouseEnter}
        weekdayElement={<WeekDay />}
      />
    </>
  );
}

ReactDayPicker.propTypes = {
  range: PropTypes.bool,
  onChange: PropTypes.func,
  initialDates: PropTypes.arrayOf(Date),
  updateStartDate: PropTypes.func,
  updateEndDate: PropTypes.func,
};

ReactDayPicker.defaultProps = {
  range: false,
  onChange: null,
  initialDates: [],
  updateStartDate: null,
  updateEndDate: null,
};

const mapDispatchToProps = dispatch => ({
  updateStartDate: date => dispatch(reduxUpdateStartDate(date)),
  updateEndDate: date => dispatch(reduxUpdateEndDate(date)),
});

export default connect(null, mapDispatchToProps)(ReactDayPicker);
