import React from 'react';
import PropTypes from 'prop-types';
import { LocaleUtils } from 'react-day-picker';

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

Weekday.propTypes = {
  weekday: PropTypes.number.isRequired,
  className: PropTypes.string.isRequired,
  localeUtils: PropTypes.instanceOf(LocaleUtils).isRequired,
  locale: PropTypes.string.isRequired,
};

export default Weekday;
