import 'react-day-picker/lib/style.css';

import {
  updateEndDate as reduxUpdateEndDate,
  updateStartDate as reduxUpdateStartDate,
} from '@reducers/filters';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import DayPicker from 'react-day-picker';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

import fonts from '@theme/fonts';
import colors from '@theme/colors';
import { INTERNAL_DATE_SPEC } from '../CONSTANTS';
// import Styles from './Styles';
import WeekDay from './Weekday';

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: fonts.family.roboto,
    background: theme.palette.primary.dark,
    borderRadius: '5px',
    minWidth: '297px',
    '& .DayPicker-Months': {
      display: 'block',
      width: '83%',
      marginRight: 'auto',
      marginLeft: 'auto',
    },
    '& DayPicker-Month': {
      margin: '0 11px',
    },
    '& .DayPicker-Body': {
      fontSize: '0.9rem',
    },
    '& .DayPicker-Caption': {
      textAlign: 'center',
      textDecoration: 'underline',
    },

    /* Selected range without start and end dates */

    '& .DayPicker-Day--selected:not(.DayPicker-Day--outside)': {
      backgroundColor: `${theme.palette.selected.primary} !important`,
    },

    /* Disabled cell */

    '& .DayPicker-Day--disabled': {
      color: colors.textSecondaryDark,
    },

    /* Day cell hover */

    '& .DayPicker:not(.DayPicker--interactionDisabled), .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover': {
      backgroundColor: `${theme.palette.selected.primary} !important`,
      borderRadius: '50% !important',
    },

    /* General day cell */

    '& .DayPicker-Day': {
      borderRadius: '0 !important',
      display: 'block', // causing dates to run down in a single vertical column
      flexGrow: 1,
      maxWidth: '32px',
    },

    /* Today cell */

    '& .DayPicker-Day.DayPicker-Day--selected.DayPicker-Day--today, .DayPicker-Day--today': {
      color: theme.palette.primary.focus,
    },

    /* Selected start and end days  */

    '& .DayPicker-Day.DayPicker-Day--start.DayPicker-Day--selected, .DayPicker-Day.DayPicker-Day--end.DayPicker-Day--selected': {
      position: 'relative',
      zIndex: 1,
    },

    /* next and prev arrows */
    '& .DayPicker-NavButton.DayPicker-NavButton': {
      top: 0,
    },

    '& .DayPicker-NavButton.DayPicker-NavButton--prev': {
      left: '1.5rem',
    },

    /* Rounded border with volume for selected start and end days of a range */

    '& .DayPicker-Day.DayPicker-Day--start.DayPicker-Day--selected:not(.DayPicker-Day--outside):before, .DayPicker-Day.DayPicker-Day--end.DayPicker-Day--selected:not(.DayPicker-Day--outside):before': {
      content: '""',
      position: 'absolute',
      border: '2px solid white',
      height: 'calc(100% + 5px)',
      width: 'calc(100% + 5px)',
      borderRadius: '50%',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: -1,
      background: theme.palette.selected.primary,
    },

    /* Layout styling, Initial styling was table based. See docs:  */
    /* https://react-day-picker.js.org/examples/selected-range-enter  */

    '& .DayPicker-Caption, .DayPicker-Weekdays, .DayPicker-WeekdaysRow, .DayPicker-Body': {
      display: 'block',
      width: '100%',
    },

    '& .DayPicker-Week .DayPicker-Day': {
      padding: '5px 8px',
    },

    '& .DayPicker-Week': {
      marginBottom: '8px',
    },

    '& .DayPicker-Week, .DayPicker-WeekdaysRow': {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
    },

    '& .DayPicker-Weekday': {
      display: 'block',
      fontSize: '12px',
    },
  },
  hasRange: {
    '& .DayPicker-Week .DayPicker-Day--selected:last-child, .DayPicker-Day.DayPicker-Day--end.DayPicker-Day--selected': {
      borderTopRightRadius: '50% !important',
      borderBottomRightRadius: '50% !important',
    },

    '& .DayPicker-Week .DayPicker-Day--selected:first-child, .DayPicker-Day.DayPicker-Day--start.DayPicker-Day--selected': {
      borderTopLeftRadius: '50% !important',
      borderBottomLeftRadius: '50% !important',
    },
  },
  noRange: {
    '& .DayPicker-Day.DayPicker-Day--start.DayPicker-Day--selected': {
      borderRadius: '50% !important',
    },
  },
}));

/** A wrapper around react-day-picker that selects a date range. */
const ReactDayPicker = ({
  range, updateStartDate, updateEndDate, startDate, endDate,
}) => {
  const classes = useStyles();

  // enteredTo represents the day that the user is currently hovering over.
  const [enteredTo, setEnteredTo] = useState(endDate);

  const setFromDay = day => {
    updateStartDate(moment(day).format(INTERNAL_DATE_SPEC));
  };

  const setToDay = day => {
    updateEndDate(moment(day).format(INTERNAL_DATE_SPEC));
  };

  const handleDayClick = day => {
    if (!range) {
      setFromDay(day);
      return;
    }

    // Our date range selection logic is very simple: the user is selecting the
    // first day in their date range if from and to are set, or if they're both
    // unset. Otherwise, they are selecting the last day.
    if (!(startDate && endDate)) {
      // If the user picks the first date then picks the second date that is before the first date
      // Reassign the From and To Day
      if (moment(day).format(INTERNAL_DATE_SPEC) < startDate) {
        const tempDate = startDate;
        setToDay(moment(tempDate).toDate());
        setFromDay(day);
        updateEndDate(tempDate);
        setEnteredTo(moment(tempDate).toDate());
      } else {
        setToDay(day);
      }
      return;
    }
    setFromDay(day);
    updateEndDate(null);
    setEnteredTo(null);
  };

  const handleDayMouseEnter = day => {
    if (!range) return;
    if (startDate && !endDate) {
      setEnteredTo(day);
    }
  };

  const from = moment(startDate).toDate();
  const enteredToDate = moment(enteredTo).toDate();
  const today = new Date();
  const lastThreeMonths = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());

  return (
    <>
      {/* <Styles range={range} /> */}
      <DayPicker
        // className="Range"
        className={clsx(classes.root, range && classes.hasRange, !range && classes.noRange)}
        disabledDays={{ before: lastThreeMonths, after: today }}
        numberOfMonths={1}
        selectedDays={[from, { from, to: enteredToDate }]}
        modifiers={{ start: from, end: enteredToDate }}
        onDayClick={handleDayClick}
        onDayMouseEnter={handleDayMouseEnter}
        weekdayElement={<WeekDay />}
      />
    </>
  );
};

ReactDayPicker.propTypes = {
  range: PropTypes.bool,
  updateStartDate: PropTypes.func,
  updateEndDate: PropTypes.func,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
};

ReactDayPicker.defaultProps = {
  range: false,
  updateStartDate: null,
  updateEndDate: null,
  startDate: null,
  endDate: null,
};

const mapDispatchToProps = dispatch => ({
  updateStartDate: date => dispatch(reduxUpdateStartDate(date)),
  updateEndDate: date => dispatch(reduxUpdateEndDate(date)),
});

const mapStateToProps = state => ({
  startDate: state.filters.startDate,
  endDate: state.filters.endDate,
});

export default connect(mapStateToProps, mapDispatchToProps)(ReactDayPicker);
