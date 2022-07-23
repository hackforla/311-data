import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectorBox from '@components/common/SelectorBox';
import DatePicker from '@components/common/DatePicker';
import {
  updateStartDate as reduxUpdateStartDate,
  updateEndDate as reduxUpdateEndDate,
} from '@reducers/filters';
import moment from 'moment';
import options from './options';
import useStyles from './useStyles';
import DateRanges from './DateRanges';

const dateFormat = 'YYYY-MM-DD';

function DateSelector({
  onRangeSelect,
  range,
  initialDates,
  updateStartDate,
  updateEndDate,
}) {
  const [dates, setDates] = useState(initialDates);
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles();

  const handleOptionSelect = optionDates => {
    const formattedStart = moment(optionDates[0]).format(dateFormat);
    const formattedEnd = moment(optionDates[1]).format(dateFormat);
    setDates(() => optionDates);
    updateStartDate(formattedStart);
    updateEndDate(formattedEnd);
    setExpanded(false);
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

const mapDispatchToProps = dispatch => ({
  updateStartDate: date => dispatch(reduxUpdateStartDate(date)),
  updateEndDate: date => dispatch(reduxUpdateEndDate(date)),
});

export default connect(null, mapDispatchToProps)(DateSelector);

DateSelector.propTypes = {
  range: PropTypes.bool,
  onRangeSelect: PropTypes.func,
  initialDates: PropTypes.arrayOf(Date),
  updateStartDate: PropTypes.func.isRequired,
  updateEndDate: PropTypes.func.isRequired,
};

DateSelector.defaultProps = {
  range: false,
  onRangeSelect: null,
  initialDates: [],
};
