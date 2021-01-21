import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import SelectorBox from "@components/common/SelectorBox";
import options from "./options";
import useStyles from "./useStyles";
import DateRanges from "./DateRanges";
import DatePicker from "./DatePicker";

function DateSelector({ onRangeSelect, initialDates }) {
  const [dates, setDates] = useState(initialDates);

  const [expanded, setExpanded] = useState(false);

  const classes = useStyles();

  const handleOptionSelect = (option) => {
    setDates(() => option.dates);
  };

  const closeCollapse = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <SelectorBox>
      <SelectorBox.Display>
        <div className={classes.selector}>
          <DatePicker
            range={false}
            onToggle={closeCollapse}
            classes={classes}
            dates={dates}
            onSelect={onRangeSelect}
          />
          <div className={classes.separator} />
        </div>
      </SelectorBox.Display>
      <SelectorBox.Collapse>
        <DateRanges
          className={classes.option}
          options={options}
          onSelect={handleOptionSelect}
        />
      </SelectorBox.Collapse>
    </SelectorBox>
  );
}

DateSelector.propTypes = {
  onRangeSelect: PropTypes.func,
  initialDates: PropTypes.arrayOf(Date),
};

DateSelector.defaultProps = {
  initialDates: [],
};

export default DateSelector;
