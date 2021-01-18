import React, { useState } from "react";
import DayPicker, { DateUtils } from "react-day-picker";
import PropTypes from "proptypes";

import "react-day-picker/lib/style.css";
const getInitialState = () => {
  return {
    from: null,
    to: null,
    enteredTo: null, // Keep track of the last day for mouseEnter.
  };
};

const Weekday = ({ weekday, className, localeUtils, locale }) => {
  const weekdayName = localeUtils.formatWeekdayLong(weekday, locale);
  return (
    <div className={className} title={weekdayName}>
      {weekdayName.slice(0, 3)}
    </div>
  );
};

function ReactDayPicker({ onChange }) {
  const [state, setState] = useState(getInitialState());

  const isSelectingFirstDay = (from, to, day) => {
    const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
    const isRangeSelected = from && to;
    return !from || isBeforeFirstDay || isRangeSelected;
  };

  const resetDays = () => {
    const initialState = getInitialState();
    setState(initialState);
    onChange({ from: initialState.from, to: initialState.to });
  };

  const setFromDay = (day) => {
    setState(() => ({
      from: day,
      to: null,
      enteredTo: null,
    }));
    onChange({ from: day, to: null });
  };

  const setFromToDay = (day) => {
    setState((prevState) => ({
      ...prevState,
      to: day,
      enteredTo: day,
    }));
    onChange({ from, to: day });
  };

  const handleDayClick = (day) => {
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

  const handleDayMouseEnter = (day) => {
    const { from, to } = state;
    if (!isSelectingFirstDay(from, to, day)) {
      setState((prevState) => ({
        ...prevState,
        enteredTo: day,
      }));
    }
  };

  const { from, to, enteredTo } = state;

  return (
    <DayPicker
      className="Range"
      numberOfMonths={1}
      fromMonth={from}
      selectedDays={[from, { from, to: enteredTo }]}
      disabledDays={{ before: from }}
      modifiers={{ start: from, end: enteredTo }}
      onDayClick={handleDayClick}
      onDayMouseEnter={handleDayMouseEnter}
      weekdayElement={<Weekday />}
    />
  );
}

DayPicker.propTypes = {
  onChange: PropTypes.func,
};

export default ReactDayPicker;
