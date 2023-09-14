import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Typography } from '@material-ui/core';
import { seconds } from '@utils';
import facts from '@data/facts';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={handleClose} className={classes.modal}>
      <div className={classes.paper}>
        <Typography variant="h5" gutterBottom>
          Did you know?
        </Typography>
        <Typography variant="body1">{facts[currentFactIndex]}</Typography>
      </div>
    </Modal>
  );
}
