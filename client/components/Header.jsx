import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
} from '@material-ui/core';

// Header should make use of style overrides to look the same regardless of light/dark theme
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
    fontFamily: 'Roboto',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    textDecoration: 'none',
  },
  title: {
    ...theme.typography.h3,
    flexGrow: 1,
    letterSpacing: '4px',
  },
}));

const activeStyle = {
  borderBottom: '1px solid yellow',
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
        <Typography variant="h3" className={classes.title}>
          <Link to="/" className={classes.link}>311DATA</Link>
        </Typography>
        <NavLink className={classes.link} to="/map" activeStyle={activeStyle}>
          <Button className={classes.button}>Map</Button>
        </NavLink>
        <Button
          id="report-anchor"
          onClick={handleClick}
          className={classes.button}
        >
          Reports
        </Button>
        <Menu
          id="report-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Link to="/reports/dashboards/overview_combined">
            <MenuItem onClick={handleClose}>
              Overview
            </MenuItem>
          </Link>
          <Link to="/reports/dashboards/nc_summary_comparison">
            <MenuItem onClick={handleClose}>
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
