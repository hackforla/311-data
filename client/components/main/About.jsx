import React from 'react';
import {
  makeStyles,
  Container,
} from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    color: 'black',
    backgroundColor: 'white',
    padding: '2em',
    '& h1': {
      fontSize: '2.5em',
    },
    '& img': {
      maxWidth: '100%',
      height: 'auto',
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
});

const About = () => {
  const classes = useStyles();

  return (
    <Container className={classes.root} maxWidth="lg">
      <h1>About</h1>
    </Container>
  );
};

export default About;
