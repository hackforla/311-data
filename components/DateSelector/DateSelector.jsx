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
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { styled } from '@mui/material/styles';
import options from './options';
import useStyles from './useStyles';
import DateRanges from './DateRanges';

const dateFormat = 'YYYY-MM-DD';

function DateSelector({
  range,
  updateStartDate,
  updateEndDate,
}) {
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles();

  const handleOptionSelect = optionDates => {
    const formattedStart = moment(optionDates[0]).format(dateFormat);
    const formattedEnd = moment(optionDates[1]).format(dateFormat);
    updateStartDate(formattedStart);
    updateEndDate(formattedEnd);
    setExpanded(false);
  };

  const closeOptionsOnDateToggle = useCallback(() => {
    setExpanded(false);
  }, []);

  const { option, selected } = classes;

  const ArrowToolTip = styled(({ className }) => (
    <Tooltip
      placement="top-end"
      arrow
      classes={{ popper: className }}
      title={
        (
          <div>
            <p className={classes.tooltipParagraph}>
              <strong>
                Currently, 311-Data loads only 311 service
                request data from 2024 onward.
              </strong>
            </p>
            <p className={classes.tooltipParagraph}>
              For updates on the release of available 311
              Data, please follow our
              {` `}
              <a href='https://www.linkedin.com/company/hack-for-la/'>
                LinkedIn Page
              </a>
            .
            </p>
          </div>
        )
      }
    >
      <InfoOutlinedIcon
        className={classes.iconStyle}
        fontSize="inherit"
      />
    </Tooltip>
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      '&::before': {
        backgroundColor: theme.palette.common.white,
      },
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
      marginLeft: '-4px',
      maxWidth: '275px',
      padding: '5px',
    },
  }));
  return (
    <>
      <span className={classes.label}>
        Date Range&nbsp;
        <ArrowToolTip />
      </span>
      <SelectorBox onToggle={() => setExpanded(!expanded)} expanded={expanded}>
        <SelectorBox.Display>
          <div className={classes.selector}>
            <DatePicker
              range={range}
              onToggle={closeOptionsOnDateToggle}
            />
            <div className={classes.separator} />
          </div>
        </SelectorBox.Display>
        <SelectorBox.Collapse>
          <DateRanges
            classes={{ option, selected }}
            options={options}
            onSelect={handleOptionSelect}
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
