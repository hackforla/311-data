import React from 'react';
import {
  styled, Box, Modal, Typography, Link,
} from '@mui/material';
import colors from '@theme/colors';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  backgroundColor: '#29404F',
  padding: theme.spacing(4),
  boxShadow: theme.shadows[5],
  textAlign: 'center',
  maxWidth: '464px',
  borderRadius: '10px',
}));

const ExternalLink = styled(Link)({
  color: colors.primaryFocus,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
});

function AcknowledgeModal() {
  return (
    <StyledModal open disableAutoFocus disableEnforceFocus disableRestoreFocus keepMounted>
      <StyledBox>
        <Typography variant="h6" sx={{ fontWeight: 500 }} gutterBottom>
          Welcome to 311Data
        </Typography>
        <Typography variant="body2" sx={{ fontWieght: 400 }} gutterBottom>
          311-data.org is 100% powered by volunteers from Hack
          <br />
          for LA and is not affiliated with the city of Los Angeles.
          <br />
          For official information about 311 services in Los
          <br />
          Angeles, please visit
          {' '}
          <ExternalLink href="https://lacity.gov/myla311" target="_blank" rel="noopener noreferrer" aria-label="Visit MyLA311 for official information (opens in a new tab)">
            MyLA311
          </ExternalLink>
          .
        </Typography>
      </StyledBox>
    </StyledModal>
  );
}

export default AcknowledgeModal;
