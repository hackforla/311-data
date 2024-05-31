import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { updateRequestStatus } from '@reducers/filters';
import ArrowToolTip from '@components/common/ArrowToolTip';

const useStyles = makeStyles(() => ({
  header: {
    marginBottom: 5,
    fontFamily: 'Roboto',
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    width: '50%',
  },
  tooltipParagraph: {
    margin: '1px',
  },
}));

function StatusSelector({
  updateStatusFilter,
  requestStatus,
}) {
  const classes = useStyles();
  const [selection, setSelection] = useState('open');

  const handleSelection = (event, newSelection) => {
    setSelection(newSelection);
  };

  return (
    <>
      <div className={classes.header}>
        Request Status&nbsp;
        <ArrowToolTip iconStyle={classes.iconStyle}>
          <p className={classes.tooltipParagraph}>
            There are multiple definitions of closed, including the following:
            The issue may have already been reported (duplicate request),
            the issue could have been resolved, or a service technician visited
            the site of the reported issue and put in an internal request to resolve it.
          </p>
        </ArrowToolTip>
      </div>
      <ToggleButtonGroup
        value={selection}
        onChange={handleSelection}
        exclusive
        className={classes.root}
      >
        <ToggleButton
          className={classes.button}
          selected={requestStatus.open && !requestStatus.closed}
          onClick={() => updateStatusFilter('open')}
          value="open"
          disableRipple
        >
          Open
        </ToggleButton>
        <ToggleButton
          className={classes.button}
          selected={requestStatus.open && requestStatus.closed}
          onClick={() => updateStatusFilter('all')}
          value="all"
          disableRipple
        >
          All
        </ToggleButton>
        <ToggleButton
          className={classes.button}
          selected={requestStatus.closed && !requestStatus.open}
          onClick={() => updateStatusFilter('closed')}
          value="closed"
          disableRipple
        >
          Closed
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  );
}

const mapStateToProps = state => ({
  requestStatus: state.filters.requestStatus,
});

const mapDispatchToProps = dispatch => ({
  updateStatusFilter: status => dispatch(updateRequestStatus(status)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StatusSelector);

StatusSelector.propTypes = {
  updateStatusFilter: PropTypes.func.isRequired,
  requestStatus: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    closed: PropTypes.bool.isRequired,
  }).isRequired,
};
