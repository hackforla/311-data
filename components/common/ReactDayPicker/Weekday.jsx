import React from 'react';
import { WeekdayElementProps } from 'react-day-picker/';

const Weekday = ({
  weekday, className, localeUtils, locale,
}) => {
  const weekdayName = localeUtils.formatWeekdayLong(weekday, locale);
  return (
    <div className={className} title={weekdayName}>
      {weekdayName.slice(0, 3)}
    </div>
  );
};

Weekday.propTypes = WeekdayElementProps;

export default Weekday;
