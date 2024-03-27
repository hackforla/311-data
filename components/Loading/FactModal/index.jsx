import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { seconds } from '@utils';
import facts from '@data/facts';
import fonts from '@theme/fonts';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'flex',
  justifyContent: 'center',
});

const StyledBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '20vh',
  backgroundColor: '#424242',
  padding: theme.spacing(4, 4, 4),
  boxShadow: theme.shadows[5],
  textAlign: 'center',
  maxWidth: '533px',
  width: 'auto',
  borderRadius: '10px',
}));

const StyledTypography = styled(Typography)({
  fontSize: '16px',
  fontFamily: fonts.family.roboto,
  fontWeight: fonts.weight.regular,
});

export default function FactModal() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const factsLength = facts.length;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentFactIndex(prevIndex => (prevIndex + 1) % factsLength);
    }, seconds(5));
    return () => clearInterval(intervalId);
  }, [factsLength]);

  return (
    <StyledModal open hideBackdrop disableAutoFocus>
      <StyledBox>
        <StyledTypography variant="body1">
          Did you know?
          {' '}
          {facts[currentFactIndex]}
        </StyledTypography>
      </StyledBox>
    </StyledModal>
  );
}
