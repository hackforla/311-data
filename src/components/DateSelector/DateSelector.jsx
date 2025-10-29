import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import SelectorBox from '@components/common/SelectorBox';
import DatePicker from '@components/common/DatePicker';
import {
  updateStartDate as reduxUpdateStartDate,
  updateEndDate as reduxUpdateEndDate,
} from '@reducers/filters';
import Typography from '@mui/material/Typography';
import ArrowToolTip from '@components/common/ArrowToolTip';
import options from './options';
import useStyles from './useStyles';
import ReactDayPicker from '@components/common/ReactDayPicker';

const dateFormat = 'YYYY-MM-DD';

function DateSelector({
  range,
  updateStartDate,
  updateEndDate,
  startDate,
  endDate,
}) {
  const [expandedMenu, setExpandedMenu] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [initialStart, setInitialStart] = useState(null);
  const [initialEnd, setInitialEnd] = useState(null);
  const displayRef = useRef(null);
  const collapseRef = useRef(null);
  const classes = useStyles();

  // Close on outside click and revert if the selection was not completed
  useEffect(() => {
    const handleDocClick = (e) => {
      if (!expandedMenu) return;
      if (displayRef.current && displayRef.current.contains(e.target)) return;
      if (collapseRef.current && collapseRef.current.contains(e.target)) return;

      // clicked outside both display and collapse
      const selectionCompleted = !range
        ? (startDate && startDate !== initialStart)
        : (startDate && endDate);

      if (!selectionCompleted) {
        // revert to initial values captured when the collapse opened
        updateStartDate(initialStart);
        updateEndDate(initialEnd);
      }

      setExpandedMenu(false);
      setActiveField(null);
    };

    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, [expandedMenu, initialStart, initialEnd, startDate, endDate, range, updateStartDate, updateEndDate]);

  const handleOptionSelect = optionDates => {
    const formattedStart = moment(optionDates[0]).format(dateFormat);
    const formattedEnd = moment(optionDates[1]).format(dateFormat);
    updateStartDate(formattedStart);
    updateEndDate(formattedEnd);
    setExpandedMenu(false);
    setActiveField(null);
  };

  const closeOptionsOnDateToggle = useCallback(() => {
    setExpandedMenu(false);
    setActiveField(null);
  }, []);

  const {
    option, selected, tooltipParagraph,
  } = classes;

  const linkedinPageLink = <a href="https://www.linkedin.com/company/hack-for-la/">LinkedIn Page</a>;

  return (
    <>
      <Typography className={classes.header}>
        Date Range&nbsp;
        <ArrowToolTip iconStyle={classes.iconStyle}>
          <div>
            <p className={tooltipParagraph}>
              <strong>
                Currently, 311-Data loads only 311 service
                request data from 2020 onward.
              </strong>
            </p>
            <p className={tooltipParagraph}>
              For updates on the release of available 311
              Data, please follow our
              {' '}
              {linkedinPageLink}
              .
            </p>
          </div>
        </ArrowToolTip>
      </Typography>
      <SelectorBox onToggle={() => setExpandedMenu(!expandedMenu)} expanded={expandedMenu} arrowHidden>
        <SelectorBox.Display>
          <div className={classes.selector} ref={displayRef}>
            <DatePicker
              range={range}
              onOpenCollapse={(field) => {
                // capture initial values for possible revert
                setInitialStart(startDate);
                setInitialEnd(endDate);
                setActiveField(field);
                setExpandedMenu(true);
              }}
              onCloseCollapse={() => {
                setExpandedMenu(false);
                setActiveField(null);
              }}
              activeField={activeField}
              displayRef={displayRef}
            />
          </div>
        </SelectorBox.Display>
        <SelectorBox.Collapse>
          <div ref={collapseRef}>
            <ReactDayPicker
              range={range}
              updateStartDate={updateStartDate}
              updateEndDate={updateEndDate}
              activeField={activeField}
              onSelectionComplete={() => {
                setExpandedMenu(false);
                setActiveField(null);
              }}
            />
          </div>
        </SelectorBox.Collapse>
      </SelectorBox>
    </>
  );
}

const mapStateToProps = state => ({
  startDate: state.filters.startDate,
  endDate: state.filters.endDate,
});

const mapDispatchToProps = dispatch => ({
  updateStartDate: date => dispatch(reduxUpdateStartDate(date)),
  updateEndDate: date => dispatch(reduxUpdateEndDate(date)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DateSelector);

DateSelector.propTypes = {
  range: PropTypes.bool,
  updateStartDate: PropTypes.func.isRequired,
  updateEndDate: PropTypes.func.isRequired,
};

DateSelector.defaultProps = {
  range: false,
};
