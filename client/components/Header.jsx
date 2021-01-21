import React from 'react';
// import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  appBar: {
    height: theme.header.height,
    backgroundColor: theme.palette.primary.main,
  },
  button: {
    textTransform: 'none',
    fontFamily: 'Roboto',
    marginLeft: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontFamily: theme.typography.fontFamily,
    fontSize: '30px',
    fontWeight: 'bold',
    letterSpacing: '4px',
  },
}));

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
  );
};

export default Header;
