import React from 'react';
import { keyframes } from '@mui/system';
import { styled } from '@mui/material/styles';
import {
  Box, Modal, Typography, Link,
} from '@mui/material';
import fonts from '@theme/fonts';
import LoadingModal311Logo from '@assets/311Logo.png';
import HFLALogo from '@assets/hack_for_la_logo.png';
import spinner from '@assets/spinner.png';
import colors from '@theme/colors';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledBox = styled(Box)(({ theme }) => ({
  color: 'white',
  position: 'absolute',
  bottom: '35vh',
  backgroundColor: '#29404F',
  padding: theme.spacing(4),
  boxShadow: theme.shadows[5],
  textAlign: 'center',
  maxWidth: '533px',
  maxHeight: '469px',
  borderRadius: '20px',
  outline: 'none',
}));

const StyledTypography = styled(Typography)({
  fontSize: '16px',
  fontFamily: fonts.family.roboto,
  fontWeight: fonts.weight.medium,
});

const ExternalLink = styled(Link)({
  color: colors.primaryFocus,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
});

// Loading png spinner animation
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const StyledSpinner = styled('img')({
  animation: `${spin} 2s linear infinite`,
  width: '36px',
  display: 'block',
  margin: '10px auto',
});

export default function LoadingModal() {
  return (
    <StyledModal open>
      <StyledBox>
        <Box sx={{ marginBottom: '20px' }}>
          <img src={LoadingModal311Logo} width="245" height="160" alt="311 data logo" />
          <StyledSpinner src={spinner} alt="Loading..." />
        </Box>
        <StyledTypography variant="body1">
          Loading data points and map. Please give us a moment.
          <br />
          For official information about 311 services in Los Angeles,
          <br />
          please visit
          {' '}
          <ExternalLink href="https://lacity.gov/myla311" target="_blank" rel="noopener noreferrer" aria-label="Visit MyLA311 for official information (opens in a new tab)">
            MyLA311
          </ExternalLink>
          .
        </StyledTypography>
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px',
        }}
        >
          <Typography sx={{ fontSize: '14px', fontFamily: fonts.family.roboto, fontWeight: fonts.weight.medium }}>
            Powered by Volunteers at Hack for LA
          </Typography>
          <img src={HFLALogo} alt="Hack For LA logo" width="40" />
        </Box>
      </StyledBox>
    </StyledModal>
  );
}
