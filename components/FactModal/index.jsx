import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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

export default function FactModal({ isLoading }) {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  useEffect(() => {
    let intervalId = null;
    let factIndex = 0;

    if (isLoading) {
      intervalId = setInterval(() => {
        factIndex = (factIndex + 1) % facts.length;
        setCurrentFactIndex(factIndex);
      }, seconds(5));
    }
    return () => clearInterval(intervalId);
  }, [isLoading]);

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

FactModal.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
