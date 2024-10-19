import React from 'react';
import PropTypes from 'prop-types';
import {
  styled,
  Box,
  Modal,
  Typography,
  Link,
  Button,
} from '@mui/material';
import colors from '@theme/colors';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledBox = styled(Box)(({ theme }) => ({
  color: 'white',
  position: 'absolute',
  backgroundColor: '#29404F',
  padding: theme.spacing(4),
  boxShadow: theme.shadows[5],
  textAlign: 'center',
  maxWidth: '464px',
  borderRadius: '10px',
  outline: 'none',
}));

const ExternalLink = styled(Link)({
  color: colors.primaryFocus,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const buttonStyle = {
  width: '104px',
  height: '29px',
  borderRadius: '5px',
  backgroundColor: '#ECECEC',
  border: '1px solid #ECECEC',
  '&:hover': {
    backgroundColor: '#DADADA',
    borderColor: '#DADADA',
  },
  color: '#29404F',
  fontWeight: '500',
};

function AcknowledgeModal({ onClose }) {
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
    onClose();
  };
  return (
    <StyledModal open={open}>
      <StyledBox>
        <Typography variant="h6" gutterBottom>
          Welcome to 311Data
        </Typography>
        <Typography
          variant="body2"
          sx={{ textAlign: 'start' }}
          gutterBottom
        >
          311-data.org is 100% powered by volunteers from Hack
          <br />
          for LA and is not affiliated with the city of Los Angeles.
          <br />
          For official information about 311 services in Los
          <br />
          Angeles, please visit
          {' '}
          <ExternalLink
            href="https://lacity.gov/myla311"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit MyLA311 for official information (opens in a new tab)"
          >
            MyLA311
          </ExternalLink>
          .
        </Typography>
        <Box sx={{ pt: 3 }}>
          <Button onClick={handleClose} sx={buttonStyle}>
            Ok
          </Button>
        </Box>
      </StyledBox>
    </StyledModal>
  );
}

export default AcknowledgeModal;

AcknowledgeModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};
