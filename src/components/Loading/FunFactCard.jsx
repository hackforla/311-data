import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Card, Box, Typography } from '@mui/material';
import { seconds } from '@utils';
import facts from '@data/facts';

const StyledCard = styled(Card)({
  display: 'flex',
  alignItems: 'flex',
  justifyContent: 'center',
});

const StyledBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '12vh',
  backgroundColor: '#424242',
  padding: theme.spacing(3, 3, 3),
  boxShadow: theme.shadows[5],
  textAlign: 'center',
  maxWidth: '533px',
  width: 'auto',
  borderRadius: '10px',
  zIndex: 50000, // This prevents from being overlay by LoadingModal's backdrop
}));

export default function FunFactCard() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const factsLength = facts.length;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentFactIndex(prevIndex => (prevIndex + 1) % factsLength);
    }, seconds(5));
    return () => clearInterval(intervalId);
  }, [factsLength]);

  return (
    <StyledCard>
      <StyledBox>
        <Typography variant="body1" sx={{ fontSize: '14px' }}>
          Did you know?
          {' '}
          {facts[currentFactIndex]}
        </Typography>
      </StyledBox>
    </StyledCard>
  );
}
