import React from 'react';
// import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles({
  appBar: {
    height: '62px',
    backgroundColor: '#2A404E'
  },
  button: {
    textTransform: 'none',
  },
  title: {
    flexGrow: 1,
    fontFamily: 'Oswald, sans-serif',
    fontSize: '30px',
    fontWeight: 'bold',
    letterSpacing: '4px'
  },
});

// TODO: links/routing, mobile
const Header = () => {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h1" className={classes.title}>
          311DATA
        </Typography>
        <Button className={classes.button}>Explore 311 Data</Button>
        <Button className={classes.button}>About 311 Data</Button>
        <Button className={classes.button}>Contact Us</Button>
        <Button className={classes.button}>Help Center</Button>
      </Toolbar>
    </AppBar>
  )
}

export default Header;
