import React from "react";
import PropTypes from "prop-types";
import { LocaleUtils, WeekdayElementProps } from "react-day-picker";

const Weekday = (props) => {
  const { weekday, className, localeUtils, locale } = props;
  const weekdayName = localeUtils.formatWeekdayLong(weekday, locale);
  return (
    <div className={className} title={weekdayName}>
      {weekdayName.slice(0, 3)}
    </div>
  );
};

Weekday.propTypes = WeekdayElementProps;

export default Weekday;
