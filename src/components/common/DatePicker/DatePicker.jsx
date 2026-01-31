import React, {
  useRef, useState, useEffect, useCallback,
} from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import ReactDayPicker from '@components/common/ReactDayPicker';
import {
  updateEndDate as reduxUpdateEndDate,
  updateStartDate as reduxUpdateStartDate,
} from '@reducers/filters';
// TODO: Apply gaps (margin, padding) from theme

const useStyles = makeStyles(theme => {
  // local style constants to avoid repeating magic numbers
  const BORDER_RADIUS = 5;
  const GAP = '5px';
  const PADDING = '8px 10px';
  const BORDER_WIDTH = 2;
  const ICON_SIZE = 20;

  return ({
  selector: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    backgroundColor: theme.palette.primary.dark,
    borderRadius: 5,
    fontSize: '14px',
    color: theme.palette.text.secondaryLight,
    '& > *': {
      cursor: 'pointer',
      flex: '1 1 0%',
    },
  },
  placeholder: {
    color: theme.palette.text.secondaryDark,
  },
  selectorPopUp: {
    position: 'fixed',
    zIndex: 1,
  },
  datePicker: {
    display: 'flex',
    alignItems: 'center',
    gap: GAP,
    backgroundColor: theme.palette.primary.dark,
    border: `${BORDER_WIDTH}px solid ${theme.palette.primary.dark}`,
    color: theme.palette.text.secondaryLight,
    padding: PADDING,
    margin: 0,
    boxSizing: 'border-box',
    flex: '1 1 0%',
    borderRadius: BORDER_RADIUS,
    transition: 'border-color 150ms ease, box-shadow 150ms ease',

    '&:focus, &:focus-visible': {
      borderColor: theme.palette.secondaryFocus || theme.palette.textFocus || '#87C8BC',
      outline: 'none',
    },
  },
  active: {
    borderColor: theme.palette.secondaryFocus || theme.palette.textFocus || '#87C8BC',
  },
  button: {
    padding: 0,
    color: theme.palette.text.dark,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    '& svg': {
      fontSize: ICON_SIZE,
      fill: theme.palette.text.textSecondaryDark,
    },
  },
  });
});

/**
 * renderSelectedDays
 * - If fieldIndex is provided (0 = start, 1 = end) it returns a single element
 *   suitable for populating an individual field (shows the date or a placeholder).
 * - If fieldIndex is not provided it returns the combined display (same as before):
 *   either "from - to", a single date, or the generic placeholder.
 */
const renderSelectedDays = (dates, classes, range, fieldIndex) => {
  const [from, to] = dates;
  const isFromSelected = Boolean(from);
  const isBothSelected = Boolean(from && to);

  // If caller asks for a specific field (start or end), return a single element
  if (typeof fieldIndex === 'number') {
    if (fieldIndex === 0) {
      // Start field
      if (isFromSelected) return <span>{moment(from).format('L')}</span>;
      return <span className={classes.placeholder}>Start Date</span>;
    }
    if (fieldIndex === 1) {
      // End field
      if (to) return <span>{moment(to).format('L')}</span>;
      return <span className={classes.placeholder}>End Date</span>;
    }
  }

  // Backwards-compatible combined rendering
  if (isBothSelected) {
    return [
      <span key="from">{moment(from).format('L')}</span>,
      <span key="delimiter"> - </span>,
      <span key="to">{moment(to).format('L')}</span>,
    ];
  }
  if (isFromSelected) {
    return [(
      <span key="from">{moment(from).format('L')}</span>
    )];
  }
  return [(
    <span className={classes.placeholder} key="N/A">
      Select a date
      {' '}
      {range ? ' range' : ''}
    </span>
  )];
};

function DatePicker({
  // controlled by parent DateSelector
  onOpenCollapse, onCloseCollapse, activeField,
  range, startDate, endDate, updateStartDate, updateEndDate, displayRef, endDateBtnRef,
}) {
  const classes = useStyles();
  const ref = displayRef || useRef(null);

  const handleFieldClick = (field) => {
    // parent will open the SelectorBox collapse and tell ReactDayPicker which field is active
    if (activeField === field) {
      if (onCloseCollapse) onCloseCollapse();
    } else if (onOpenCollapse) {
      onOpenCollapse(field);
    }
  };

  return (
    <div ref={ref} className={classes.selector}>
      <button
        id="startDate"
        type="button"
        onClick={() => handleFieldClick('start')}
        className={clsx(classes.datePicker, activeField === 'start' && classes.active)}
        aria-haspopup="dialog"
        aria-expanded={activeField === 'start'}
        aria-label="Start date"
      >
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M12.6667 3.16671H12V1.83337H10.6667V3.16671H5.33333V1.83337H4V3.16671H3.33333C2.59333 3.16671 2 3.76671 2 4.50004V13.8334C2 14.5667 2.59333 15.1667 3.33333 15.1667H12.6667C13.4 15.1667 14 14.5667 14 13.8334V4.50004C14 3.76671 13.4 3.16671 12.6667 3.16671ZM12.6667 13.8334H3.33333V6.50004H12.6667V13.8334ZM4.33333 9.16671C4.33333 8.24671 5.08 7.50004 6 7.50004C6.92 7.50004 7.66667 8.24671 7.66667 9.16671C7.66667 10.0867 6.92 10.8334 6 10.8334C5.08 10.8334 4.33333 10.0867 4.33333 9.16671Z" fill="#A8A8A8"/>
        </svg>
        {renderSelectedDays([startDate, endDate], classes, range, 0)}
      </button>

      <button
        ref={endDateBtnRef}
        id="endDate"
        type="button"
        onClick={() => handleFieldClick('end')}
        className={clsx(classes.datePicker, activeField === 'end' && classes.active)}
        aria-haspopup="dialog"
        aria-expanded={activeField === 'end'}
        aria-label="End date"
      >
        {renderSelectedDays([startDate, endDate], classes, range, 1)}
      </button>
    </div>
  );
}

DatePicker.propTypes = {
  range: PropTypes.bool,
  open: PropTypes.bool,
  onOpenCollapse: PropTypes.func,
  onCloseCollapse: PropTypes.func,
  activeField: PropTypes.string,
  displayRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  endDateBtnRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

DatePicker.defaultProps = {
  open: false,
  range: false,
  onOpenCollapse: null,
  onCloseCollapse: null,
  activeField: null,
  displayRef: null,
  startDate: null,
  endDate: null,
  endDateBtnRef: null,
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
