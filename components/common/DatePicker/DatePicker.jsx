import React, {
  useRef, useState, useEffect, useCallback,
} from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import IconButton from '@mui/material/IconButton';
import makeStyles from '@mui/styles/makeStyles';
import useOutsideClick from '@components/common/customHooks/useOutsideClick';
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
//TODO: Why is it important that open is being passed as a prop?
// TODO: rename onToggle to indicate it is toggling the presets dropdown
function DatePicker({
  open, onToggle, range, startDate, endDate, updateStartDate, updateEndDate,
}) {
  const [showCalendar, setShowCalendar] = useState(() => open);
  const [initialStartDate, setInitialStartDate] = useState(startDate); // todo: maybe remove this
  const [initialEndDate, setInitialEndDate] = useState();
  const classes = useStyles();

  const ref = useRef(null);
  // const closeCalendar = useCallback(() => setShowCalendar(false), []);
  const closeCalendar = useCallback(
    () => {
    if (startDate && endDate){
      setShowCalendar(false);
    } else if (startDate && !endDate){ // warning: endDate may not be `null` at time of closing calendar :(
      //We need to restart startDate and endDate to their initial values
      //TODO: Make sure the formats are consistent
      updateStartDate(initialStartDate);
      updateEndDate(initialEndDate);
      console.log("StartDate", startDate)
      console.log("initial StartDate", initialStartDate)
      // setShowCalendar(false) // todo -- add this
    }
    // todo
    /*
    else {
      // log: something bad happened
    }
    */
    }, [startDate, endDate, initialStartDate, initialEndDate]); // todo: make sure these show up in dep array
  useOutsideClick(ref, closeCalendar);

  // TODO: (top-priority) write this...
  // optionally -- see if useCallback works
  /*
  const openCalendar = () => {
    // 1. setInitialStartDate(startDate)
    // 2. setInitialEndDate(endDate)
    // 3. setShowCalendar(true)
    // optional (maybe just for test purposes) make a few console.logs
  }
  */

  useEffect(() => {
    setShowCalendar(false);
    setInitialStartDate(startDate)
    setInitialEndDate(endDate)
  }, [open]);

  const getCoordinates = () => {
    if (ref.current) {
      const { left, top, height } = ref.current.getClientRects()[0];
      const offsetFromSelectorDisplay = 2;
      return {
        left,
        top: top + height + offsetFromSelectorDisplay,
      };
    }
    return {};
  };

  const toggleCalendar = () => {
    // TODO: (top priority) split this line up into an if-else
    setShowCalendar(prevShowCalendar => !prevShowCalendar); // i've updated this for clarity... but please remove this line (cus our if-statement will do the same job)
    /* suggested code
    if (showCalendar) {
      // we are showing the calendar, we want to change it to closed
      // TODO: ticket's work goes here

      closeCalendar(); //  utilize the work we already have, don't just call `setShowCalendar(false)`
    }
    else { // showCalendar is false
      // we are not showing the calendar, we want to change it to open
      

      // TODO: write `openCalendar()`, whose main job is to call
      // - setInitialStartDate
      // - setInitialEndDate
      // - setShowCalendar(true)
    }
    */

    // optionally: google "can I pass setState/setMyVariable as a prop"
    // note on useCallback: if (setExpanded) setExpanded(false); // <-- use callback lets us skip the parameter use

    // TODO: rename onToggle to indicate it is toggling the presets dropdown
    if (onToggle) onToggle(); // onToggle comes from DateSelector (aka parent component)
                              // which translates to `closeOptionsOnDateToggle()`
                              // (aka sets exapnded to false... doesn't actually toggle???)
    // Update: onToggle specifically refers to the toggling of the DROPDOWN MENU
    // e.g. it will set the dropdown's expanded state to false, closing the dropdown
    // whenever you interact with the calendar
  };
  return (
    // who is this: this is the entire bar
    // 1. selected days
    // 2. the IconButton
    // 3. the dropdown that shows pre-selected date ranges (e.g. last week/month/3 months )
    <div ref={ref} className={classes.selector}>
      {/* Careful: this calls toggleCalendar, not onToggle! */}
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
        <CalendarIcon />
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
  onToggle: PropTypes.func, // todo: rename
  startDate: PropTypes.string,
  endDate: PropTypes.string,
};

DatePicker.defaultProps = {
  open: false,
  range: false,
  onToggle: null, // todo: rename
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
