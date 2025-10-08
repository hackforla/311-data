import React, { useState, useCallback } from 'react';
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
// import DateRanges from './DateRanges';

const dateFormat = 'YYYY-MM-DD';

function DateSelector({
  range,
  updateStartDate,
  updateEndDate,
}) {
  const [expandedMenu, setExpandedMenu] = useState(false);
  const classes = useStyles();

  const handleOptionSelect = optionDates => {
    const formattedStart = moment(optionDates[0]).format(dateFormat);
    const formattedEnd = moment(optionDates[1]).format(dateFormat);
    updateStartDate(formattedStart);
    updateEndDate(formattedEnd);
    setExpandedMenu(false);
  };

  const closeOptionsOnDateToggle = useCallback(() => {
    setExpandedMenu(false);
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
      <SelectorBox onToggle={() => setExpandedMenu(!expandedMenu)} expanded={expandedMenu}>
        <SelectorBox.Display>
          <div className={classes.selector}>
            <DatePicker
              range={range}
              onTogglePresets={closeOptionsOnDateToggle}
            />
            {/* <div className={classes.separator} /> */}
          </div>
        </SelectorBox.Display>
        <SelectorBox.Collapse>
          {/* <DateRanges
            classes={{ option, selected }}
            options={options}
            onSelect={handleOptionSelect}
          /> */}
          <ReactDayPicker
            range={range}
            updateStartDate={updateStartDate}
            updateEndDate={updateEndDate}
          />
        </SelectorBox.Collapse>
      </SelectorBox>
    </>
  );
}

const mapDispatchToProps = dispatch => ({
  updateStartDate: date => dispatch(reduxUpdateStartDate(date)),
  updateEndDate: date => dispatch(reduxUpdateEndDate(date)),
});

export default connect(null, mapDispatchToProps)(DateSelector);

DateSelector.propTypes = {
  range: PropTypes.bool,
  updateStartDate: PropTypes.func.isRequired,
  updateEndDate: PropTypes.func.isRequired,
};

DateSelector.defaultProps = {
  range: false,
};
