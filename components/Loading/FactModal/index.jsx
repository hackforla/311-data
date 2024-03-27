import React, { useState, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Modal, Typography } from '@mui/material';
import { seconds } from '@utils';
import facts from '@data/facts';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  paper: {
    position: 'absolute',
    bottom: '25vh',
    backgroundColor: '#424242',
    padding: theme.spacing(2, 4, 3),
    textAlign: 'center',
  },
}));

export default function FactModal() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const factsLength = facts.length;

  useEffect(() => {
    let intervalId = null;
    intervalId = setInterval(() => {
      setCurrentFactIndex((currentFactIndex + 1) % factsLength);
    }, seconds(5));
    return () => clearInterval(intervalId);
  }, [currentFactIndex, factsLength]);

  return (
    <Modal open={open} className={classes.modal}>
      <div className={classes.paper}>
        <Typography variant="body1">
          Did you know?
          {' '}
          {facts[currentFactIndex]}
        </Typography>
      </div>
    </Modal>
  );
}
