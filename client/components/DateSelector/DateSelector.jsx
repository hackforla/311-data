import React, { useEffect, useRef, useState } from "react";
import SelectorBox from "../common/SelectorBox";
import ReactDayPicker from "@components/common/ReactDayPicker";

import CalendarIcon from "@material-ui/icons/CalendarToday";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

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
}));

function DateSelector() {
  const ref = useRef(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dates, setDates] = useState({ from: null, to: null });
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
  };

  const separator = <span className={classes.separator}> &#10072; </span>;

  return (
    <SelectorBox>
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
              <ReactDayPicker onChange={handleDateChage} />
            </div>
          ) : null}
        </div>
      </SelectorBox.Display>
      <SelectorBox.Collapse>
        <span>Last Week (11/01 - 11/08)</span>
        <span>Last Week (11/01 - 11/08)</span>
        <span>Last Week (11/01 - 11/08)</span>
        <span>Last Week (11/01 - 11/08)</span>
        <span>Last Week (11/01 - 11/08)</span>
      </SelectorBox.Collapse>
    </SelectorBox>
  );
}

export default DateSelector;
