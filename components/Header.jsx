import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import fonts from '@theme/fonts';
import colors from '@theme/colors';

// Header should make use of style overrides to look the same regardless of light/dark theme.
const useStyles = makeStyles(theme => ({
  appBar: {
    height: theme.header.height,
    backgroundColor: theme.palette.primary.main,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
  button: {
    color: 'white',
    textTransform: 'none',
    fontFamily: fonts.family.roboto,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    textDecoration: 'none',
  },
  title: {
    ...theme.typography.h4,
    fontFamily: fonts.family.oswald,
    fontSize: '30px',
    letterSpacing: '0.13em',
    fontWeight: theme.typography.fontWeightBold,
    flexGrow: 1,
  },
  menuPaper: {
    backgroundColor: colors.textPrimaryLight,
    '& a': {
      textDecoration: 'none',
    },
  },
  menuItem: {
    ...theme.typography.body2,
    color: 'white',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

const activeStyle = {
  borderBottom: `1px solid ${colors.primaryFocus}`,
};

// TODO: links/routing, mobile
const Header = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h4" className={classes.title}>
          <Link to="/" className={classes.link}>311DATA</Link>
        </Typography>
        <NavLink className={classes.link} to="/map" activeStyle={activeStyle}>
          <Button className={classes.button}>Map</Button>
        </NavLink>
        <Button
          id="dashboard-anchor"
          onClick={handleClick}
          className={classes.button}
        >
          Dashboard
        </Button>
        <Menu
          id="dashboard-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          classes={{ paper: classes.menuPaper }}
        >
          <Link to="/dashboard/overview-combined">
            <MenuItem onClick={handleClose} className={classes.menuItem}>
              Overview
            </MenuItem>
          </Link>
          <Link to="/dashboard/nc-summary-comparison">
            <MenuItem onClick={handleClose} className={classes.menuItem}>
              Compare Two Neighborhoods
            </MenuItem>
          </Link>
        </Menu>
        <NavLink to="/faqs" className={classes.link} activeStyle={activeStyle}>
          <Button className={classes.button}>FAQ</Button>
        </NavLink>
        <NavLink to="/about" className={classes.link} activeStyle={activeStyle}>
          <Button className={classes.button}>About</Button>
        </NavLink>
        <NavLink to="/research" className={classes.link} activeStyle={activeStyle}>
          <Button className={classes.button}>Research</Button>
        </NavLink>
        <NavLink to="/privacy" className={classes.link} activeStyle={activeStyle}>
          <Button className={classes.button}>Privacy</Button>
        </NavLink>
        <NavLink to="/contact" className={classes.link} activeStyle={activeStyle}>
          <Button className={classes.button}>Contact</Button>
        </NavLink>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
