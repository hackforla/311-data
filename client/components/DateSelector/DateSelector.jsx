import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SelectorBox from '@components/common/SelectorBox';
import DatePicker from '@components/common/DatePicker';
import options from './options';
import useStyles from './useStyles';
import DateRanges from './DateRanges';

function DateSelector({ onRangeSelect, range, initialDates }) {
  const [dates, setDates] = useState(initialDates);
  const classes = useStyles();

  const handleOptionSelect = option => {
    setDates(() => option.dates);
  };

  return (
    <SelectorBox>
      <SelectorBox.Display>
        <div className={classes.selector}>
          <DatePicker
            range={range}
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
