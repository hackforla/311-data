import React from "react";
import PropTypes from "prop-types";

const DateRanges = ({ options, onSelect, className }) => {
  return (
    <div>
      {options
        ? options.map((option, index) => (
            <button
              key={index}
              onClick={() => onSelect(option)}
              className={className}
            >
              {option.text}
            </button>
          ))
        : null}
    </div>
  );
};

DateRanges.propTypes = {
  onSelect: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  className: PropTypes.string,
};

DateRanges.defaultProps = {
  className: "",
};

export default DateRanges;
