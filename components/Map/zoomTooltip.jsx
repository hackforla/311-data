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

function StatusSelector({ updateStatusFilter, requestStatus }) {
  const classes = useStyles();
  const [selection, setSelection] = useState('open');

  const handleSelection = (event, newSelection) => {
    setSelection(newSelection);
  };

  return (
    <>
      <ArrowToolTip iconStyle={classes.iconStyle}>
        <p className={classes.tooltipParagraph}>
          <strong>
            Zoom features are limited while locked into a
            neighborhood council.
          </strong>
          {' '}
          <br />
          To reset zoom features, please exit by clicking out of
          the selected area.
        </p>
      </ArrowToolTip>
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
