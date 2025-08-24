import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  styled,
  Box,
  Button,
  Icon,
  Typography,
} from '@mui/material';
import moment from 'moment';
import DocumentDownload from '@assets/logo_downloading.svg';
import { StyledChip } from '@components/common/ChipList';
import sharedLayout from '@theme/layout';
import useStyles from './useStyles';

const StyledBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(4),
  boxShadow: theme.shadows[5],
  textAlign: 'center',
  maxWidth: '280px',
  maxHeight: '400px',
  borderRadius: '10px',
}));

function ExportConfirmation({
  onClose, onConfirm, requestType, filters, fileSize,
}) {
  const classes = { ...useStyles(), ...sharedLayout() };
  const {
    confirmationButton, confirmationCancel, confirmationOk, imageIcon,
  } = classes;

  return (
    <StyledBox>
      <Box sx={{ pt: '20x', pb: '36px' }}>
        <Icon sx={{ fontSize: 72, display: 'block', m: 'auto' }}>
          <img src={DocumentDownload} alt="document download icon" className={imageIcon} />
        </Icon>
        <StyledChip
          label={(
            <span>
              311Data
              <span style={{ color: 'darkgray' }}>{` ‧ zip ‧ ${(fileSize / 1000).toFixed(2)}MB`}</span>
            </span>
          )}
          color="#0e251d"
          sx={{ m: '6px', p: '6px' }}
        />
        <Typography className={classes.marginTopSmall}>
          Request Type:
          {requestType}
        </Typography>
        <Typography>
          For the dates:
        </Typography>
        <Typography>
          {`${moment(filters.startDate).format('MM/DD/YYYY')} - ${moment(filters.endDate).format('MM/DD/YYYY')}`}
        </Typography>
        <Typography variant="body2" className={classes.marginTopSmall}>
          Would you like to proceed the
        </Typography>
        <Typography variant="body2">
          download?
        </Typography>
        <Button onClick={onConfirm} className={`${confirmationButton} ${confirmationOk}`}>
          OK
        </Button>
        <Button onClick={onClose} className={`${confirmationButton} ${confirmationCancel}`}>
          Cancel
        </Button>
      </Box>
    </StyledBox>
  );
}

const mapStateToProps = state => ({
  filters: state.filters,
});

export default connect(mapStateToProps)(ExportConfirmation);

ExportConfirmation.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  requestType: PropTypes.string.isRequired,
  fileSize: PropTypes.number.isRequired,
  filters: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    councilId: PropTypes.number,
    requestStatus: PropTypes.shape({
      open: PropTypes.bool,
      closed: PropTypes.bool,
    }),
    requestTypes: PropTypes.objectOf(PropTypes.bool),
  }).isRequired,
};

ExportConfirmation.defaultProps = {
  onConfirm: undefined,
};
