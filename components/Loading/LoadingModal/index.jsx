import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import fonts from '@theme/fonts';
import LoadingModal311Logo from '@assets/311Logo.png';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'flex',
  justifyContent: 'center',
});

const StyledBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '35vh',
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

export default function LoadingModal() {
  return (
    <StyledModal open>
      <StyledBox>
        <img src={LoadingModal311Logo} width={300} alt="311 data logo" />
        <StyledTypography variant="body1">
          Loading data points and map. Please give us a moment.
          For official information about 311 services in Los Angeles,
          please visit MyLA311.
        </StyledTypography>
        <StyledTypography variant="body1">
          Loading data points and map. Please give us a moment.
          For official information about 311 services in Los Angeles,
          please visit MyLA311.
        </StyledTypography>
      </StyledBox>
    </StyledModal>
  );
}
