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
  const endDateBtnRef = useRef(null);
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
          <div className={classes.selector} ref={displayRef} style={{ marginTop: -5, marginBottom: -5, marginRight: -5 }}>
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
              endDateBtnRef={endDateBtnRef}
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
              onSelectionComplete={(selection) => {
                // If ReactDayPicker provided the selection object, immediately
                // ensure the redux store and our captured initial values match
                // the selection. This avoids a race where the collapse closes
                // before connected props reflect the new dates, which caused
                // stale highlights when reopening the calendar.
                if (selection && typeof selection.startDate !== 'undefined') {
                  if (selection.startDate !== startDate) updateStartDate(selection.startDate);
                  if (typeof selection.endDate !== 'undefined' && selection.endDate !== endDate) updateEndDate(selection.endDate);
                  setInitialStart(selection.startDate);
                  setInitialEnd(selection.endDate);
                }

                // If the selection contains only a start date (user picked Start
                // and still needs to pick an End), keep the collapse open and
                // move focus to the End field so it's clear the user should pick
                // an end date next.
                if (selection && selection.startDate && (typeof selection.endDate === 'undefined' || selection.endDate === null)) {
                  // ensure the store has the new startDate (done above) and
                  // mark the active field as 'end'
                  setActiveField('end');
                  setExpandedMenu(true);

                  const focusEndDate = () => {
                    const endBtn = endDateBtnRef.current || displayRef.current?.querySelector?.('#endDate');
                    if (endBtn) {
                      endBtn.focus();
                    }
                  }

                  // move focus to the End button using requestAnimationFrame for reliable DOM updates
                  requestAnimationFrame(() => {
                    requestAnimationFrame(focusEndDate);
                  });
                  return;
                }

                // Otherwise (selection includes end or is complete) close the
                // collapse after letting React/Redux flush updates.
                Promise.resolve().then(() => {
                  setExpandedMenu(false);
                  setActiveField(null);
                });
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
