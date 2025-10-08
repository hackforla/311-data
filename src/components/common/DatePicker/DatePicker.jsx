import React, {
  useRef, useState, useEffect, useCallback,
} from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
// import CalendarIcon from '@mui/icons-material/CalendarToday';
import IconButton from '@mui/material/IconButton';
import makeStyles from '@mui/styles/makeStyles';
import useOutsideClick from '@hooks/useOutsideClick';
import ReactDayPicker from '@components/common/ReactDayPicker';
import {
  updateEndDate as reduxUpdateEndDate,
  updateStartDate as reduxUpdateStartDate,
} from '@reducers/filters';
// TODO: Apply gaps (margin, padding) from theme

const useStyles = makeStyles(theme => ({
  selector: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 268,
    backgroundColor: theme.palette.primary.dark,
    padding: 10,
    borderRadius: 5,
    fontSize: '12px',
    color: theme.palette.text.secondaryLight,
    '& > div': {
      cursor: 'pointer',
    },
  },
  placeholder: {
    color: theme.palette.text.secondaryDark,
  },
  selectorPopUp: {
    position: 'fixed',
    zIndex: 1,
  },
  button: {
    padding: 0,
    color: theme.palette.text.dark,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    '& svg': {
      fontSize: 20,
      fill: theme.palette.text.secondaryLight,
    },
  },
}));

const renderSelectedDays = (dates, classes, range) => {
  const [from, to] = dates;
  const isFromSelected = Boolean(from);
  const isBothSelected = Boolean(from && to);

  const selectedDaysElements = [];

  if (isBothSelected) {
    selectedDaysElements.push(
      <span key="from">{moment(from).format('L')}</span>,
      <span key="delimiter"> - </span>,
      <span key="to">{moment(to).format('L')}</span>,
    );
    return selectedDaysElements;
  }
  if (isFromSelected) {
    selectedDaysElements.push(
      <span key="from">
        {' '}
        {moment(from).format('L')}
        {' '}
      </span>,
    );
    return selectedDaysElements;
  }
  selectedDaysElements.push(
    <span className={classes.placeholder} key="N/A">
      Select a date
      {' '}
      {range ? ' range' : ''}
    </span>,
  );
  return selectedDaysElements;
};

function DatePicker({
  open, onTogglePresets, range, startDate, endDate, updateStartDate, updateEndDate,
}) {
  const [showCalendar, setShowCalendar] = useState(() => open);
  const [initialStartDate, setInitialStartDate] = useState(startDate);
  const [initialEndDate, setInitialEndDate] = useState();
  const classes = useStyles();
  const ref = useRef(null);

  const closeCalendar = useCallback(
    () => {
    if (startDate && endDate){
      setShowCalendar(false);
    } else if (startDate && !endDate){
      // The calendar was closed with an incomplete date range selection so we need to restart
      // startDate and endDate to their initial values
      updateStartDate(initialStartDate);
      updateEndDate(initialEndDate);
      setShowCalendar(false);
    } else {
      // This should never happen. Log a warning.
      console.warn('Try to set a new date selection. Dates were in an invalid state. StartDate: ', startDate, " endDate: ", endDate);
    }
    }, [startDate, endDate]);
  useOutsideClick(ref, closeCalendar);

  const openCalendar = () => {
    setInitialStartDate(startDate);
    setInitialEndDate(endDate);
    setShowCalendar(true);
  }

  useEffect(() => {
    setShowCalendar(false);
    setInitialStartDate(startDate)
    setInitialEndDate(endDate)
  }, [open]);

  const getCoordinates = () => {
    if (ref.current) {
      const { left, top, height } =
        ref.current.getClientRects()[0] ?? ref.current.getBoundingClientRect();
      const offsetFromSelectorDisplay = 2;
      return {
        left,
        top: top + height + offsetFromSelectorDisplay,
      };
    }
    return {};
  };

  const toggleCalendar = () => {
    if (showCalendar) {
      closeCalendar();
    } else {
      openCalendar();
    }
    if (onTogglePresets) onTogglePresets();
  };

  return (
    <div ref={ref} className={classes.selector}>
      <div onClick={toggleCalendar}>
        {renderSelectedDays([startDate, endDate], classes, range)}
      </div>
      <IconButton
        className={classes.button}
        aria-label="toggle calendar datepicker"
        onClick={toggleCalendar}
        disableFocusRipple
        disableRipple
        size="large"
      >
        {/* <CalendarIcon /> */}
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12.6667 3.16671H12V1.83337H10.6667V3.16671H5.33333V1.83337H4V3.16671H3.33333C2.59333 3.16671 2 3.76671 2 4.50004V13.8334C2 14.5667 2.59333 15.1667 3.33333 15.1667H12.6667C13.4 15.1667 14 14.5667 14 13.8334V4.50004C14 3.76671 13.4 3.16671 12.6667 3.16671ZM12.6667 13.8334H3.33333V6.50004H12.6667V13.8334ZM4.33333 9.16671C4.33333 8.24671 5.08 7.50004 6 7.50004C6.92 7.50004 7.66667 8.24671 7.66667 9.16671C7.66667 10.0867 6.92 10.8334 6 10.8334C5.08 10.8334 4.33333 10.0867 4.33333 9.16671Z" fill="#A8A8A8"/>
        </svg>
      </IconButton>
      <div style={getCoordinates()} className={classes.selectorPopUp}>
        {showCalendar ? (
          <ReactDayPicker
            range={range}
            updateStartDate={updateStartDate}
            updateEndDate={updateEndDate}
          />
        ) : null}
      </div>
    </div>
  );
}

DatePicker.propTypes = {
  range: PropTypes.bool,
  open: PropTypes.bool,
  onTogglePresets: PropTypes.func,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
};

DatePicker.defaultProps = {
  open: false,
  range: false,
  onTogglePresets: null,
  startDate: null,
  endDate: null,
};

const mapStateToProps = state => ({
  startDate: state.filters.startDate,
  endDate: state.filters.endDate,
});

const mapDispatchToProps = dispatch => ({
  updateStartDate: date => dispatch(reduxUpdateStartDate(date)),
  updateEndDate: date => dispatch(reduxUpdateEndDate(date)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DatePicker);
