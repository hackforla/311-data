import React, { useRef, useState, useEffect } from "react";
import ReactDayPicker from "@components/common/ReactDayPicker";
import PropTypes from "prop-types";
import CalendarIcon from "@material-ui/icons/CalendarToday";
import IconButton from "@material-ui/core/IconButton";
import { useOutsideClick } from "@components/common/customHooks";
import { makeStyles } from "@material-ui/core";

// TODO: Apply gaps (margin, padding) from theme

const useStyles = makeStyles((theme) => ({
  selector: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: 268,
    backgroundColor: theme.palette.primary.dark,
    padding: 10,
    borderRadius: 5,
  },
  selectorPopUp: {
    position: "fixed",
  },
  button: {
    padding: 0,
    color: theme.palette.text.dark,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
    "& svg": {
      fontSize: 20,
      fill: theme.palette.text.primary,
    },
  },
}));

const renderSelectedDays = (dates) => {
  console.log(dates);
  const [from, to] = dates;
  const isFromSelected = Boolean(from);
  const isBothSelected = Boolean(from && to);

  const selectedDaysElements = [];

  if (isBothSelected) {
    selectedDaysElements.push(
      <span key={"from"}> {from.toLocaleDateString("en-US")} </span>,
      <span key={"to"}> - {to.toLocaleDateString("en-US")}</span>
    );
    return selectedDaysElements;
  } else if (isFromSelected) {
    selectedDaysElements.push(
      <span key={"from"}> {from.toLocaleDateString("en-US")} </span>
    );
    return selectedDaysElements;
  } else {
    selectedDaysElements.push(<span key={"N/A"}>Not selected</span>);
    return selectedDaysElements;
  }
};

const DatePicker = ({ dates, onSelect, open, onToggle, range }) => {
  const [coord, setCoord] = useState({});
  const [selectedDays, setSelectedDays] = useState(() => dates);
  const [showCalendar, setShowCalendar] = useState(() => open);
  const classes = useStyles();

  const ref = useRef(null);

  useOutsideClick(ref, () => setShowCalendar(false));

  useEffect(() => {
    setShowCalendar(false);
  }, [open]);

  useEffect(() => {
    setSelectedDays(() => dates);
  }, [dates]);

  useEffect(() => {
    if (ref.current) {
      const { left, top, height } = ref.current.getClientRects()[0];
      const offsetFromSelectorDisplay = 2;

      setCoord(() => ({
        left: left,
        top: top + height + offsetFromSelectorDisplay,
      }));
    }
  }, [ref.current]);

  const toggleCalendar = () => {
    setShowCalendar((prevState) => {
      return !prevState;
    });
    onToggle && onToggle();
  };

  const handleDateChage = (dates) => {
    setSelectedDays(() => dates);
    onSelect && onSelect(dates);
  };

  return (
    <div ref={ref} className={classes.selector}>
      <div>{renderSelectedDays(selectedDays)}</div>
      <IconButton
        className={classes.button}
        aria-label="toggle filter menu"
        onClick={toggleCalendar}
        disableFocusRipple
        disableRipple
      >
        <CalendarIcon />
      </IconButton>
      <div style={coord} className={classes.selectorPopUp}>
        {showCalendar ? (
          <ReactDayPicker
            range={range}
            initialDates={selectedDays}
            onChange={handleDateChage}
          />
        ) : null}
      </div>
    </div>
  );
};

DatePicker.propTypes = {
  onSelect: PropTypes.func,
  open: PropTypes.bool,
  onToggle: PropTypes.func,
  dates: PropTypes.arrayOf(Date),
  classes: PropTypes.shape({
    button: PropTypes.string,
    selectorPopUp: PropTypes.string,
    selector: PropTypes.string,
    separator: PropTypes.string,
  }),
};

DatePicker.defaultProps = {
  open: false,
  dates: [],
  classes: {
    button: "",
    selectorPopUp: "",
    selector: "",
    separator: "",
  },
};

export default DatePicker;
