import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import SelectorBox from '@components/common/SelectorBox';
import DatePicker from '@components/common/DatePicker';
import options from './options';
import useStyles from './useStyles';
import DateRanges from './DateRanges';

function DateSelector({ onRangeSelect, range, initialDates }) {
  const [dates, setDates] = useState(initialDates);
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles();

  const handleOptionSelect = optionDates => {
    setDates(() => optionDates);
  };

  const handleDateSelect = selectedDays => {
    setDates(() => selectedDays);
    if (typeof onRangeSelect === 'function') onRangeSelect(selectedDays);
  };

  const closeOptionsOnDateToggle = useCallback(() => {
    setExpanded(false);
  }, []);

  const { option, selected } = classes;

  return (
    <>
      <span className={classes.label}>Date Range</span>
      <SelectorBox onToggle={() => setExpanded(!expanded)} expanded={expanded}>
        <SelectorBox.Display>
          <div className={classes.selector}>
            <DatePicker
              range={range}
              dates={dates}
              onToggle={closeOptionsOnDateToggle}
              onSelect={handleDateSelect}
            />
            <div className={classes.separator} />
          </div>
        </SelectorBox.Display>
        <SelectorBox.Collapse>
          <DateRanges
            classes={{ option, selected }}
            options={options}
            onSelect={handleOptionSelect}
            dates={dates}
          />
        </SelectorBox.Collapse>
      </SelectorBox>
    </>
  );
}

DateSelector.propTypes = {
  range: PropTypes.bool,
  onRangeSelect: PropTypes.func,
  initialDates: PropTypes.arrayOf(Date),
};

DateSelector.defaultProps = {
  range: false,
  onRangeSelect: null,
  initialDates: [],
};

export default DateSelector;
