import React from 'react';
import { useTheme } from '@material-ui/core';
import PropTypes from 'prop-types';

// This component is currently unused and has been ported to MUI makeStyles in ReactDayPicker.
// Keeping around for reference only.

const Styles = ({ range }) => {
  const theme = useTheme();

  return (
    <style>
      {`
     /* General background */

    .DayPicker.Range {
      font-family: Roboto;
      background: ${theme.palette.primary.dark};
      border-radius: 5px;
      min-width: 268px;
    }

    .Range .DayPicker-Body {
      font-size: 0.9rem;
    }

    .Range .DayPicker-Month {
      display: block;
      width: 83%;
      margin-right: auto;
      margin-left: auto;
    }

    .Range .DayPicker-Weekdays .DayPicker-Weekday {
      font-size: 0.7rem;
      color: white;
    }

    .DayPicker-Caption {
      text-align: center;
      text-decoration: underline;
    }

    /* Selected range without start and end dates */ 

    .Range .DayPicker-Day--selected:not(.DayPicker-Day--outside) {
      background-color: ${theme.palette.selected.primary} !important;
    }

    /* Disabled cell */
    
    .Range .DayPicker-Day--disabled {
      color: #a8a8a8;
    }

    /* Day cell hover */

    .DayPicker:not(.DayPicker--interactionDisabled)
      .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
      background-color:  ${theme.palette.selected.primary};
      border-radius: 50% !important;
    }

    /* General day cell */

    .Range .DayPicker-Day {
      border-radius: 0 !important;
      display: block;
      flex-grow: 1;
      max-width: 32px;
    }

    /* Today cell */

    .Range .DayPicker-Day.DayPicker-Day--selected.DayPicker-Day--today,
    .Range .DayPicker-Day--today {
      color: ${theme.palette.primary.focus};
    }

    /* Selected start and end days  */

    .Range .DayPicker-Day.DayPicker-Day--start.DayPicker-Day--selected,
    .Range .DayPicker-Day.DayPicker-Day--end.DayPicker-Day--selected {
      position: relative;
      z-index: 1;
    }

    /* next and prev arrows */

    .DayPicker-NavButton.DayPicker-NavButton--prev {
      left: 1.5rem;
    }

    /*Rounded border with volume for selected start and end days */

    .Range .DayPicker-Day.DayPicker-Day--start.DayPicker-Day--selected:not(.DayPicker-Day--outside):before,
    .Range .DayPicker-Day.DayPicker-Day--end.DayPicker-Day--selected:not(.DayPicker-Day--outside):before {
      content: "";
      position: absolute;
      border: 2px solid white;
      height: calc(100% + 5px);
      width: calc(100% + 5px);
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: -1;
      background: ${theme.palette.selected.primary};
    }

    ${
      range
        ? `
    .Range .DayPicker-Week .DayPicker-Day--selected:last-child,
    .Range .DayPicker-Day.DayPicker-Day--end.DayPicker-Day--selected {
      border-top-right-radius: 50% !important;
      border-bottom-right-radius: 50% !important;
    }

    .Range .DayPicker-Week .DayPicker-Day--selected:first-child,
    .Range .DayPicker-Day.DayPicker-Day--start.DayPicker-Day--selected {
      border-top-left-radius: 50% !important;
      border-bottom-left-radius: 50% !important;
    }
    
    `
        : `
    .Range .DayPicker-Day.DayPicker-Day--start.DayPicker-Day--selected{
      border-radius:50% !important;
    }
    `
    }


    /* Layout styling, Initial styling was table based. See docs:  */
    /* https://react-day-picker.js.org/examples/selected-range-enter  */ 

    .Range .DayPicker-Caption,
    .Range .DayPicker-Weekdays,
    .Range .DayPicker-WeekdaysRow,
    .Range .DayPicker-Body {
      display: block;
      width: 100%;
    }

    .Range .DayPicker-Week .DayPicker-Day {
      padding: 5px 8px;
    }

    .Range .DayPicker-Week {
      margin-bottom: 8px;
    }

    .Range .DayPicker-Week,
    .Range .DayPicker-WeekdaysRow {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }

    .Range .DayPicker-Weekday {
      display: block;
    }

    `}
    </style>
  );
};

Styles.propTypes = {
  range: PropTypes.bool,
};

Styles.defaultProps = {
  range: false,
};

export default Styles;
