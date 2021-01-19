import React, { useEffect, useRef, useState, useMemo } from "react";
import PropTypes from "prop-types";
import SelectorBox from "@components/common/SelectorBox";
import ReactDayPicker from "@components/common/ReactDayPicker";
import { DateUtils } from "react-day-picker";

import CalendarIcon from "@material-ui/icons/CalendarToday";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

const today = new Date();

const one_month_back = DateUtils.addMonths(new Date(), -1);
const six_months_back = DateUtils.addMonths(new Date(), -6);
const twelve_months_back = DateUtils.addMonths(new Date(), -12);
const start_of_this_year = new Date(`1/1/${today.getFullYear()}`);
const one_week_back = new Date(new Date().setDate(today.getDate() - 7));

const getMonthsLongString = (...dates) => {
  const months = dates.map((date) =>
    date.toLocaleString("default", {
      month: "long",
    })
  );
  return months.join(" - ");
};

const get_MMDD_String = (...dates) => {
  const localeStringWithoutYear = dates
    .map((date) => date.toLocaleDateString("en-Us").split("/"))
    .map((dateArr) => {
      const [day, month, year] = dateArr;
      return [day, month].join("/");
    });

  return localeStringWithoutYear.join(" - ");
};

const options = [
  {
    text: `Last Week ( ${get_MMDD_String(today, one_week_back)})`,
    dates: { to: today, from: one_week_back },
  },
  {
    text: `Last Month (${getMonthsLongString(one_month_back)})`,
    dates: { to: today, from: one_month_back },
  },
  {
    text: `Last 6 months (${getMonthsLongString(today, six_months_back)})`,
    dates: { to: today, from: six_months_back },
  },
  {
    text: `Last 12 months (${getMonthsLongString(today, twelve_months_back)})`,
    dates: { to: today, from: twelve_months_back },
  },
  {
    text: `Year to Date`,
    dates: { to: today, from: start_of_this_year },
  },
];

const useStyles = makeStyles((theme) => ({
  button: {
    padding: 0,
    color: theme.palette.text.dark,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
    "& svg": {
      fontSize: 20,
    },
  },
  selector: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorPopUp: {
    position: "fixed",
  },
  separator: {
    marginLeft: 5,
  },
  option: {
    cursor: "pointer",
    padding: 6,
    margin: "2px 0",
    fontFamily: "Roboto",
    width: "100%",
    backgroundColor: theme.palette.primary.dark,
    border: "none",
    textAlign: "left",
    color: theme.palette.text.primary,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

function DateSelector({ onRangeSelect, initialDates }) {
  const ref = useRef(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dates, setDates] = useState({
    from: initialDates.from,
    to: initialDates.to,
  });
  const [coord, setCoord] = useState({});
  const classes = useStyles();

  useEffect(() => {
    if (ref.current) {
      const { left, top } = ref.current.getClientRects()[0];
      const offsetFromSelectorDisplay = 39;
      const leftPadding = 10;

      setCoord(() => ({
        left: left - leftPadding,
        top: top + offsetFromSelectorDisplay,
      }));
    }
  }, [ref.current]);

  const toggleCalendar = () => {
    setShowCalendar((prevState) => !prevState);
  };

  const handleDateChage = (dates) => {
    setDates(() => dates);
    onRangeSelect(dates);
  };

  const separator = <span className={classes.separator}> &#10072; </span>;

  const onOptionSelect = (option) => {
    setDates(() => option.dates);
  };

  const closeReactDayPicker = useMemo(() => () => setShowCalendar(false), []);

  return (
    <SelectorBox onToggle={closeReactDayPicker}>
      <SelectorBox.Display>
        <div ref={ref} className={classes.selector}>
          <div>
            {dates.from && (
              <span> {dates.from.toLocaleDateString("en-US")} </span>
            )}
            {dates.to && <span> - {dates.to.toLocaleDateString("en-US")}</span>}
            {!dates.from && !dates.to && <span>Not selected</span>}
          </div>
          <IconButton
            className={classes.button}
            aria-label="toggle filter menu"
            onClick={toggleCalendar}
            disableFocusRipple
            disableRipple
          >
            <CalendarIcon /> {separator}
          </IconButton>
          {showCalendar ? (
            <div style={coord} className={classes.selectorPopUp}>
              <ReactDayPicker initialDates={dates} onChange={handleDateChage} />
            </div>
          ) : null}
        </div>
      </SelectorBox.Display>
      <SelectorBox.Collapse>
        {options.map((option) => (
          <button
            onClick={() => onOptionSelect(option)}
            className={classes.option}
          >
            {option.text}
          </button>
        ))}
      </SelectorBox.Collapse>
    </SelectorBox>
  );
}

DateSelector.propTypes = {
  onRangeSelect: PropTypes.func,
  initialDates: PropTypes.exact({
    from: PropTypes.instanceOf(Date),
    to: PropTypes.instanceOf(Date),
  }),
};

DateSelector.defaultProps = {
  initialDates: {
    from: null,
    to: null,
  },
};

export default DateSelector;
