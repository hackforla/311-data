import React from 'react';
import PropTypes from 'prop-types';

const DateRanges = ({
  options, onSelect, dates, classes,
}) => {
  function highlightIfSelected(optionDays, selectedDays) {
    if (dates.length > 0) {
      const [from, to, start, end] = [
        ...optionDays,
        ...selectedDays,
      ].map(date => date.toLocaleDateString('en-US'));
      const isSelected = from === start && to === end;

      if (isSelected) return classes.selected;
    }
    return ' ';
  }

  return (
    <div>
      {options
        ? options.map(option => (
          <button
            type="button"
            key={option.text}
            onClick={() => {
              onSelect(option.dates);
            }}
            className={`${classes.option} ${highlightIfSelected(
              option.dates,
              dates,
            )}`}
          >
            {option.text}
          </button>
        ))
        : null}
    </div>
  );
};

const {
  func, arrayOf, shape, string,
} = PropTypes;

const Option = shape({
  text: string,
  dates: arrayOf(Date),
});

DateRanges.propTypes = {
  onSelect: func.isRequired,
  options: arrayOf(Option).isRequired,
  dates: arrayOf(Date),
  classes: PropTypes.shape({
    selected: PropTypes.string,
    option: PropTypes.string,
  }),
};

DateRanges.defaultProps = {
  classes: { selected: '', option: '' },
  dates: [],
};

export default DateRanges;
