import React from 'react';
import PropTypes from 'prop-types';

const DateRanges = ({ options, onSelect, className }) => (
  <div>
    {options
      ? options.map(option => (
        <button
          type="button"
          key={option.text}
          onClick={() => onSelect(option)}
          className={className}
        >
          {option.text}
        </button>
      ))
      : null}
  </div>
);

DateRanges.propTypes = {
  onSelect: PropTypes.func.isRequired,
  options: PropTypes.arrayOf({
    dates: { from: PropTypes.instanceOf(Date), to: PropTypes.instanceOf(Date) },
    text: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
};

DateRanges.defaultProps = {
  className: '',
};

export default DateRanges;
