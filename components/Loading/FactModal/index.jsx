import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Modal, Typography } from '@mui/material';
import { seconds } from '@utils';
import facts from '@data/facts';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'flex',
  justifyContent: 'center',
});

const StyledBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '15vh',
  backgroundColor: '#424242',
  padding: theme.spacing(4, 4, 4),
  boxShadow: theme.shadows[5],
  textAlign: 'center',
  maxWidth: '533px',
  width: 'auto',
  borderRadius: '10px',
}));

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
        <Typography variant="body1">
          Did you know?
          {' '}
          {facts[currentFactIndex]}
        </Typography>
      </StyledBox>
    </StyledModal>
  );
}
