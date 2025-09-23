import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { updateRequestStatus } from '@reducers/filters';
import ArrowToolTip from '@components/common/ArrowToolTip';

import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { borderColor } from '@mui/system';

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
  hasError = false // Form Validation for blank map
}) {
  const classes = useStyles();
  const [selection, setSelection] = useState('open');

  const handleSelection = (status, checked) => {
    const newStatus = {
      ...requestStatus,
      [status]: checked,
    };

    if (newStatus.open && newStatus.closed) {
      updateStatusFilter('all');
    } else if (newStatus.open) {
      updateStatusFilter('open');
    } else if (newStatus.closed) {
      updateStatusFilter('closed');
    } else {
      updateStatusFilter('none');
    }
  };

  return (
    <>
      <div className={classes.header} style={{ color: hasError ? '#DE2800' : 'inherit' }}>
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

      <Box
        display="flex"
        flexDirection="row"
        gap={2}
        style={{
          margin: 'auto',
          backgroundColor: '#192730',
          borderRadius: '5px',
          padding: '10px',
          paddingTop: '5px',
          paddingBottom: '10px',
          alignItems: 'center',
          border: hasError ? '1.3px solid #DE2800': undefined
        }}
      >
        <FormGroup row>
          <FormControlLabel
            key="open"
            classes={classes.button}
            control={(
              <Checkbox
                style={{
                  transform: 'scale(0.8)',
                  color: 'white',
                  padding: '0 0 0 9px',
                }}
                checked={requestStatus.open}
                onChange={e => handleSelection('open', e.target.checked)}
              />
            )}
            label="Open"
          />
          <FormControlLabel
            key="closed"
            classes={classes.button}
            control={(
              <Checkbox
                style={{
                  transform: 'scale(0.8)',
                  color: 'white',
                  padding: '0 0 0 20px',
                }}
                checked={requestStatus.closed}
                onChange={e => handleSelection('closed', e.target.checked)}
              />
            )}
            label="Closed"
          />
        </FormGroup>
      </Box>
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
   hasError: PropTypes.bool,
};
