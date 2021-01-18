import SelectorBox from "../common/SelectorBox";
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
  separator: {
    marginLeft: 5,
  },
}));

function DatePicker() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [dates, setDates] = useState({ from: null, to: null });
  const classes = useStyles();


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
        <div className={classes.selector}>
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
        </div>
      </SelectorBox.Display>
      <SelectorBox.Collapse>
        TO DO: ADD Options here . . 
      </SelectorBox.Collapse>
    </SelectorBox>
  );
}

export default DatePicker;
