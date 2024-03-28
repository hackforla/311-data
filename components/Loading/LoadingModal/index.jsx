import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Modal, Typography, Link } from '@mui/material';
import fonts from '@theme/fonts';
import LoadingModal311Logo from '@assets/311Logo.png';
import colors from '@theme/colors';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'flex',
  justifyContent: 'center',
});

const StyledBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '40vh',
  backgroundColor: '#29404F',
  padding: theme.spacing(4, 4, 4),
  boxShadow: theme.shadows[5],
  textAlign: 'center',
  maxWidth: '533px',
  maxHeight: '469px',
  borderRadius: '20px',
}));

const StyledTypography = styled(Typography)({
  fontSize: '18px',
  fontFamily: fonts.family.roboto,
  fontWeight: fonts.weight.medium,
});

const ExternalLink = styled(Link)({
  color: colors.primaryFocus,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'none',
  },
});

export default function LoadingModal() {
  return (
    <StyledModal open disableAutoFocus disableEnforceFocus disableRestoreFocus keepMounted>
      <StyledBox>
        <img src={LoadingModal311Logo} width={300} alt="311 data logo" />
        <StyledTypography variant="body1">
          Loading data points and map. Please give us a moment.
          For official information about 311 services in Los Angeles,
          please visit
          {' '}
          <ExternalLink href="https://lacity.gov/myla311" target="_blank" rel="noopener noreferrer" aria-label="Visit MyLA311 for official information (opens in a new tab)">
            MyLA311
          </ExternalLink>
          .
        </StyledTypography>

      </StyledBox>
    </StyledModal>
  );
}
