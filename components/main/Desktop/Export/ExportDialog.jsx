import React from 'react';
import PropTypes from 'prop-types';
import {
  styled,
  Modal as BaseModal,
} from '@mui/material';
import ExportConfirmation from './ExportConfirmation';
import ExportDownload from './ExportDownload';
import ExportWarning from './ExportWarning';
import ExportFailure from './ExportFailure';

const StyledModal = styled(BaseModal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

function ExportDialog({
  open, onClose, onConfirm, onConfirmationClose, errorType, requestType, dialogType, fileSize,
}) {
  return (
    <StyledModal
      open={open}
      onClose={onClose}
    >
      <>
        {errorType && <ExportWarning open={open} onClose={onClose} errorType={errorType} />}
        {(dialogType === 'confirmation') && <ExportConfirmation onClose={onConfirmationClose} onConfirm={onConfirm} requestType={requestType} fileSize={fileSize} />}
        {(dialogType === 'downloading') && <ExportDownload dialogType={dialogType} />}
        {(dialogType === 'success') && <ExportDownload dialogType={dialogType} />}
        {(dialogType === 'failed') && <ExportFailure onClose={onClose} />}
      </>
    </StyledModal>
  );
}

export default ExportDialog;

ExportDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  onConfirmationClose: PropTypes.func,
  errorType: PropTypes.string,
  requestType: PropTypes.string,
  dialogType: PropTypes.string,
  fileSize: PropTypes.number,
};

ExportDialog.defaultProps = {
  onClose: undefined,
  onConfirm: undefined,
  onConfirmationClose: undefined,
  errorType: undefined,
  requestType: undefined,
  dialogType: undefined,
  fileSize: undefined,
};
