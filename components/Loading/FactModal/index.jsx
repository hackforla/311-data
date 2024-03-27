import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { seconds } from '@utils';
import facts from '@data/facts';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
});

const StyledBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '25vh',
  backgroundColor: '#424242',
  padding: theme.spacing(2, 4, 3),
  textAlign: 'center',
}));

export default function FactModal() {
  const [open, setOpen] = useState(true);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const factsLength = facts.length;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentFactIndex(prevIndex => (prevIndex + 1) % factsLength);
    }, seconds(5));
    return () => clearInterval(intervalId);
  }, [factsLength]);

  return (
    <StyledModal open={open}>
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
